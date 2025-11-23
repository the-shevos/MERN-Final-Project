import React, { useState, useEffect } from "react";
import RegisterForm from "../component/RegisterForm";
import LoginForm from "../component/LoginForm";
import ImageSlider from "../component/ImageSlider";

interface MainPageProps {
  defaultModal?: "login" | "register";
}

export default function MainPage({ defaultModal }: MainPageProps) {
  const [modal, setModal] = useState<"login" | "register" | null>(null);

  useEffect(() => {
    if (defaultModal) setModal(defaultModal);
  }, [defaultModal]);

  const openRegister = () => setModal("register");
  const openLogin = () => setModal("login");
  const closeModal = () => setModal(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {!modal && (
        <div className="space-x-4">
          <button
            onClick={openLogin}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={openRegister}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors"
          >
            Register
          </button>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
          <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl relative flex flex-col md:flex-row">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center
              rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 
              hover:text-gray-900 transition-all duration-200 shadow-md
              text-2xl font-extrabold"
            >
              ×
            </button>

            <ImageSlider />

            <div className="hidden md:flex items-center justify-center">
              <div className="w-[2.5px] h-[400px] bg-purple-300/80"></div>
            </div>

            {modal === "register" && <RegisterForm onSignInClick={openLogin} />}
            {modal === "login" && <LoginForm onRegisterClick={openRegister} />}
          </div>
        </div>
      )}
    </div>
  );
}
