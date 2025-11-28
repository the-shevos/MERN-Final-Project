import React, { useState, useRef } from "react";
import PasswordField from "./PasswordField";
import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onRegisterClick?: () => void;
}

export default function LoginForm({ onRegisterClick }: LoginFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    userPassword: "",
  });

  const [focused, setFocused] = useState({
    userName: false,
    userPassword: false,
  });

  const [passwordError, setPasswordError] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "userPassword" && passwordError)
      setPasswordError(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    setFocused({ ...focused, [e.target.name]: true });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    setFocused({ ...focused, [e.target.name]: false });

  const validateUsername = (username: string) => ({
    minLength: username.length >= 3,
    validChars: /^[A-Za-z0-9]+$/.test(username),
  });

  const validatePassword = (password: string) => ({
    minLength: password.length >= 8,
    alphanumeric: /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  });

  const isFormValid = () => {
    const username = validateUsername(formData.userName);
    const password = validatePassword(formData.userPassword);
    return (
      username.minLength &&
      username.validChars &&
      password.minLength &&
      password.alphanumeric &&
      password.specialChar
    );
  };

  const handleForgotPassword = async () => {
    if (!formData.userName) {
      toast.error("Please enter your username first!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/forgot-password",
        { userName: formData.userName }
      );
      toast.success(
        response.data.message || "Password reset link sent to your email!"
      );
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to send reset link!";
      toast.error(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        {
          userName: formData.userName,
          userPassword: formData.userPassword,
        },
        { withCredentials: true }
      );

      const user = response.data.user;
      const accessToken = response.data.accessToken;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);

      toast.success("Logged in successfully!");

      if (user.role === "admin") navigate("/dashboard");
      else navigate("/");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || "Login failed!";
      if (msg.toLowerCase().includes("password")) {
        setPasswordError(true);
        passwordRef.current?.focus();
      }
      toast.error(msg);
    }
  };

  return (
    <div className="md:w-1/2 p-8 flex flex-col justify-center relative">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontWeight: "700",
            color: "#fff",
            fontSize: "16px",
            textAlign: "center",
            borderRadius: "12px",
            padding: "12px 22px",
            minWidth: "350px",
          },
          success: {
            style: { background: "#1a202c" },
            iconTheme: { primary: "#fff", secondary: "#4ade80" },
          },
          error: {
            style: { background: "#f73156" },
            iconTheme: { primary: "#fff", secondary: "#f73156" },
          },
        }}
      />

      <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Good to see you again!
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Username"
          name="userName"
          placeholder="Enter your username"
          value={formData.userName}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          focused={focused.userName}
          validation={validateUsername(formData.userName)}
          validationLabels={[
            "Minimum 3 characters",
            "Only letters and numbers allowed",
          ]}
        />

        <div className="relative">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="absolute right-0 -top-1 text-md font-medium text-purple-500 hover:text-purple-600 hover:underline transition-all duration-200 cursor-pointer"
          >
            Forgot Password?
          </button>

          <PasswordField
            label="Password"
            name="userPassword"
            value={formData.userPassword}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            focused={focused.userPassword}
            validation={validatePassword(formData.userPassword)}
            error={passwordError}
            ref={passwordRef}
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full mt-3 py-2 rounded-lg font-semibold transition-colors ${
            isFormValid()
              ? "bg-gradient-to-l from-blue-500 to-purple-600 text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Step Inside
        </button>

        <SocialButtons />
      </form>

      <div className="flex items-center gap-4 mt-6">
        <hr className="flex-1 border-gray-200" />
        <button
          type="button"
          onClick={onRegisterClick}
          className="text-gray-600 text-[15px] flex items-center gap-1"
        >
          <span>Don't have an account?</span>
          <span className="text-purple-600 font-medium hover:underline cursor-pointer">
            Register
          </span>
        </button>
        <hr className="flex-1 border-gray-200" />
      </div>
    </div>
  );
}
