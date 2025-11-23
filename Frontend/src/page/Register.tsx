import React from "react";
import RegisterForm from "../component/RegisterForm";
import ImageSlider from "../component/ImageSlider";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 ">
      <div className="border-2 border-gray-400/40 flex flex-col md:flex-row bg-white shadow-md rounded-3xl w-full max-w-5xl relative">
        <ImageSlider />
        <div className="hidden md:flex items-center justify-center">
          <div className="w-[2.5px] h-[400px] bg-purple-300/80"></div>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
