import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import InputField from "./InputField";
import PasswordField from "./PasswordField";
import SocialButtons from "./SocialButtons";
import axios from "axios";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    role: "user",
    termsAgreed: false,
  });

  const [focused, setFocused] = useState({
    userName: false,
    userEmail: false,
    userPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    setFocused({ ...focused, [e.target.name]: true });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    setFocused({ ...focused, [e.target.name]: false });

  const validateUserName = (name: string) => ({
    minLength: name.length >= 3,
    validCharacters: /^[A-Za-z0-9]+$/.test(name),
  });

  const validateEmail = (email: string) => ({
    format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    gmailOnly: /@gmail\.com$/.test(email),
  });

  const validatePassword = (password: string) => ({
    minLength: password.length >= 8,
    alphanumeric: /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  });

  const isFormValid = () => {
    const userNameValid =
      validateUserName(formData.userName).minLength &&
      validateUserName(formData.userName).validCharacters;
    const emailValid = validateEmail(formData.userEmail).format;
    const passwordValid =
      validatePassword(formData.userPassword).minLength &&
      validatePassword(formData.userPassword).alphanumeric &&
      validatePassword(formData.userPassword).specialChar;

    return userNameValid && emailValid && passwordValid && formData.termsAgreed;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/v1/user/register", {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
        role: formData.role,
      });

      toast.success(
        <div className="text-center">
          <p className="font-semibold">User created successfully!</p>
          <p>Verify your email: {formData.userEmail}</p>
        </div>,
        {
          duration: 7000,
          style: {
            borderRadius: "12px",
            background: "#1a202c",
            color: "#fff",
            padding: "16px 24px",
            minWidth: "450px",
            fontSize: "16px",
            textAlign: "center",
          },
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        }
      );
    } catch (err) {
      toast.error("Registration failed!", {
        duration: 6000,
        style: {
          borderRadius: "12px",
          background: "#1a202c",
          color: "#fff",
          padding: "16px 24px",
          minWidth: "450px",
          fontSize: "16px",
          textAlign: "center",
        },
        iconTheme: {
          primary: "#ef4444",
          secondary: "#fff",
        },
      });
    }
  };

  return (
    <div className="md:w-1/2 p-8 flex flex-col justify-center">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="flex items-center text-3xl font-bold text-gray-800 mb-5">
        <span className="flex-1 h-[2px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></span>
        <span className="mx-4">Create Your Account!</span>
        <span className="flex-1 h-[2px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <InputField
          label="Username"
          name="userName"
          placeholder="Enter your username"
          value={formData.userName}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          focused={focused.userName}
          validation={validateUserName(formData.userName)}
          validationLabels={[
            "Minimum 3 characters",
            "Only letters and numbers allowed",
          ]}
        />

        <InputField
          label="Email"
          name="userEmail"
          placeholder="example@email.com"
          value={formData.userEmail}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          focused={focused.userEmail}
          validation={validateEmail(formData.userEmail)}
          validationLabels={["Valid email format", "Gmail only allowed"]}
        />

        <PasswordField
          label="Password"
          name="userPassword"
          value={formData.userPassword}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          focused={focused.userPassword}
          validation={validatePassword(formData.userPassword)}
        />

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="terms"
            checked={formData.termsAgreed}
            onChange={(e) =>
              setFormData({ ...formData, termsAgreed: e.target.checked })
            }
            className="w-5 h-5 border-gray-300 rounded checked:bg-gray-100 checked:border-gray-500 focus:ring-gray-500"
            required
          />
          <label htmlFor="terms" className="ml-2 text-gray-500 text-sm">
            I agree to the{" "}
            <a href="#" className="text-black underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-black underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full mt-2 py-2 rounded-lg font-semibold transition ${
            isFormValid()
              ? "bg-black text-white cursor-pointer hover:bg-gray-900"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Create account
        </button>

        <SocialButtons />
      </form>
    </div>
  );
}
