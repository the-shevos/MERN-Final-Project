import React, { useState, useEffect, useRef } from "react";
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

  const [uniqueValidation, setUniqueValidation] = useState({
    userName: true,
    userEmail: true,
  });

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    setFocused({ ...focused, [e.target.name]: true });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFocused({ ...focused, [name]: false });
  };

  useEffect(() => {
    if (formData.userName.trim().length < 3) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/user/check-username?userName=${formData.userName}`
        );
        setUniqueValidation((prev) => ({
          ...prev,
          userName: res.data.available,
        }));
      } catch {
        setUniqueValidation((prev) => ({ ...prev, userName: false }));
      }
    }, 500);
  }, [formData.userName]);

  useEffect(() => {
    if (!formData.userEmail.trim()) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/user/check-email?userEmail=${formData.userEmail}`
        );
        setUniqueValidation((prev) => ({
          ...prev,
          userEmail: res.data.available,
        }));
      } catch {
        setUniqueValidation((prev) => ({ ...prev, userEmail: false }));
      }
    }, 500);
  }, [formData.userEmail]);

  const validateUserName = (name: string) => {
    const minLength = name.length >= 3;
    const validCharacters = /^[A-Za-z0-9]+$/.test(name);
    const unique =
      minLength && validCharacters ? uniqueValidation.userName : false;

    return { minLength, validCharacters, unique };
  };

  const validateEmail = (email: string) => ({
    format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    gmailOnly: /@gmail\.com$/.test(email),
    unique: uniqueValidation.userEmail,
  });

  const validatePassword = (password: string) => ({
    minLength: password.length >= 8,
    alphanumeric: /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  });

  const isFormValid = () => {
    const userNameValid =
      validateUserName(formData.userName).minLength &&
      validateUserName(formData.userName).validCharacters &&
      validateUserName(formData.userName).unique;

    const emailValid =
      validateEmail(formData.userEmail).format &&
      validateEmail(formData.userEmail).gmailOnly &&
      validateEmail(formData.userEmail).unique;

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
          iconTheme: { primary: "#22c55e", secondary: "#fff" },
        }
      );
    } catch {
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
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
    }
  };

  return (
    <div className="md:w-1/2 p-8 flex flex-col justify-center">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="flex items-center text-3xl font-extrabold mb-5 justify-center">
        <span className="flex-1 relative h-8 flex items-center">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 10 Q 25 5, 50 10 T 100 10"
              stroke="url(#leftGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="leftGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </span>

        <span className="mx-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg font-sans">
          Create Your Account!
        </span>

        <span className="flex-1 relative h-8 flex items-center">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 10 Q 25 15, 50 10 T 100 10"
              stroke="url(#rightGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="rightGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </svg>
        </span>
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
          validation={validateUserName(formData.userName)}
          validationLabels={[
            "Minimum 3 characters",
            "Only letters and numbers allowed",
            "Username must be unique",
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
          validationLabels={[
            "Valid email format",
            "Gmail only allowed",
            "Email must be unique",
          ]}
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

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.termsAgreed}
            onChange={(e) =>
              setFormData({ ...formData, termsAgreed: e.target.checked })
            }
            className="w-5 h-5 rounded accent-purple-600 focus:ring-purple-400"
            required
          />
          <label htmlFor="terms" className="ml-2 text-gray-600 text-sm">
            I agree to the{" "}
            <a href="#" className="text-purple-600 underline font-semibold">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 underline font-semibold">
              Privacy Policy
            </a>
            .
          </label>
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
          Create account
        </button>

        <SocialButtons />
      </form>
    </div>
  );
}
