import React from "react";

export default function SocialButtons() {
  return (
    <>
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
    </>
  );
}
