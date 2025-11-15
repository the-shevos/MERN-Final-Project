import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
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

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    setFocused({ ...focused, [e.target.name]: true });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    setFocused({ ...focused, [e.target.name]: false });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        {
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPassword: formData.userPassword,
          role: formData.role,
        }
      );
      toast.success(
        <div className="text-center">
          <p className="font-semibold">User created successfully!</p>
          <p>Verify your email : {formData.userEmail}</p>
        </div>,
        {
          duration: 6000,
          style: {
            borderRadius: "12px",
            background: "#1a202c",
            color: "#fff",
            padding: "16px 24px",
            minWidth: "450px",
            fontSize: "16px",
            textAlign: "center",
            whiteSpace: "pre-line",
          },
        }
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // setError(err.response.data.error);
      } else {
        // setError("Server error");
      }
    }
  };

  const validationClass = (isFocused: boolean) =>
    `text-xs text-gray-500 mt-2 list-disc list-inside transition-[max-height,opacity,transform] duration-700 ease-in-out overflow-hidden transform ${
      isFocused
        ? "opacity-100 translate-y-0 max-h-40"
        : "opacity-0 -translate-y-2 max-h-0"
    }`;

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

  const renderValidationDot = (isValid: boolean) => (
    <span className="inline-flex items-center w-4 h-4 mr-2">
      {isValid ? (
        <svg
          className="w-4 h-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </span>
  );

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

  const images = [
    "https://images.unsplash.com/photo-1550703712-7c448196fea6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1670623042512-1a5ecebc3f42?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA5fHxqYWNrZXR8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1614031679232-0dae776a72ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGphY2tldHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1674086631216-8aa6f3c6eaa1?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsSliding(false);
      }, 700);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
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
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <div className="border-2 border-gray-400/40 flex flex-col md:flex-row bg-white shadow-md rounded-3xl overflow-hidden w-full max-w-5xl relative">
        <div className="md:w-1/2 relative flex items-center justify-center p-6 bg-white">
          <div className="w-full h-80 md:h-[570px] relative rounded-3xl overflow-hidden shadow-lg border-3 border-zinc-700/90">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-700 ease-in-out ${
                    idx === currentIndex
                      ? "bg-white w-24 h-1.5"
                      : "bg-gray-400 w-20 h-1.5"
                  }`}
                ></div>
              ))}
            </div>
            {images.map((img, index) => {
              let position = "translate-x-full";
              if (index === currentIndex)
                position = isSliding ? "-translate-x-full" : "translate-x-0";
              if (index === (currentIndex + 1) % images.length)
                position = isSliding ? "translate-x-0" : "translate-x-full";
              return (
                <img
                  key={index}
                  src={img}
                  alt={`slide-${index}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-in-out ${position}`}
                />
              );
            })}
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-semibold text-sm md:text-base max-w-[320px]">
                At Jacketze, we’re all about jackets stylish, durable, and made
                to keep you comfortable in every season. Find your perfect look
                and wear your confidence.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="w-[2.5px] h-[380px] bg-gray-500/60"></div>
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="flex items-center text-3xl font-bold text-gray-800 mb-5">
            <span className="flex-1 h-[2px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></span>
            <span className="mx-4">Create Your Account!</span>
            <span className="flex-1 h-[2px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="userName"
                placeholder="Enter your username"
                value={formData.userName}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <ul className={validationClass(focused.userName)}>
                <li className="flex items-center">
                  {renderValidationDot(
                    validateUserName(formData.userName).minLength
                  )}
                  Minimum 3 characters
                </li>

                <li className="flex items-center">
                  {renderValidationDot(
                    validateUserName(formData.userName).validCharacters
                  )}
                  Only letters and numbers allowed
                </li>
              </ul>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="userEmail"
                placeholder="example@email.com"
                value={formData.userEmail}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <ul className={validationClass(focused.userEmail)}>
                <li className="flex items-center">
                  {renderValidationDot(
                    validateEmail(formData.userEmail).format
                  )}
                  Valid email format
                </li>
                <li className="flex items-center">
                  {renderValidationDot(
                    validateEmail(formData.userEmail).gmailOnly
                  )}
                  Gmail only allowed
                </li>
              </ul>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="userPassword"
                  placeholder="Type your password"
                  value={formData.userPassword}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <ul className={validationClass(focused.userPassword)}>
                <li className="flex items-center">
                  {renderValidationDot(
                    validatePassword(formData.userPassword).minLength
                  )}
                  Minimum 8 characters
                </li>
                <li className="flex items-center">
                  {renderValidationDot(
                    validatePassword(formData.userPassword).alphanumeric
                  )}
                  Must have letters & numbers
                </li>
                <li className="flex items-center">
                  {renderValidationDot(
                    validatePassword(formData.userPassword).specialChar
                  )}
                  Must include special character (!@#$%^&*)
                </li>
              </ul>
            </div>
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
              className={`w-full mt-2 py-2 rounded-lg font-semibold transition 
    ${
      isFormValid()
        ? "bg-black text-white cursor-pointer hover:bg-gray-900"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
            >
              Create account
            </button>
            <div className="flex items-center gap-2 mt-2">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-400 text-sm">or sign up with</span>
              <hr className="flex-1 border-gray-300" />
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                className="flex-1 border border-gray-400 py-2 rounded-lg flex items-center justify-center cursor-pointer gap-2 hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Google
              </button>
              <button
                type="button"
                className="flex-1 border border-gray-400 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                  alt="Apple"
                  className="w-5 h-5"
                />
                Apple ID
              </button>
            </div>
            <p className="text-center text-[15px] text-gray-500 mt-4">
              Already have an account?{" "}
              <a href="#" className="text-black font-medium hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
