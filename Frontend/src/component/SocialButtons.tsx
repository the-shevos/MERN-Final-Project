import React, { useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function SocialButtons() {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          const token = session?.access_token;

          if (token) {
            document.cookie = `sb-token=${token}; path=/; max-age=86400;`;
            console.log("Token saved:", token);
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Google sign-in error:", error.message);
  };

  const handleAppleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
    });
    if (error) console.error("Apple sign-in error:", error.message);
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm">or start here</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <div className="flex gap-3 mt-4 w-full">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex-1 border border-gray-400 py-2 rounded-lg flex items-center justify-center mt-1 cursor-pointer gap-2 hover:bg-gray-200/60"
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
          onClick={handleAppleSignIn}
          className="flex-1 border border-gray-400 py-2 rounded-lg flex items-center justify-center gap-2 mt-1 cursor-pointer hover:bg-gray-200/60"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="Apple"
            className="w-5 h-5"
          />
          Apple ID
        </button>
      </div>
    </>
  );
}
