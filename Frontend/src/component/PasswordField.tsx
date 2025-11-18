import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  focused: boolean;
  validation: Record<string, boolean>;
}

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  focused,
  validation,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const validationClass = (isFocused: boolean) =>
    `text-xs text-gray-500 mt-2 list-disc list-inside transition-[max-height,opacity,transform] duration-700 ease-in-out overflow-hidden transform ${
      isFocused
        ? "opacity-100 translate-y-0 max-h-40"
        : "opacity-0 -translate-y-2 max-h-0"
    }`;

  const renderValidationDot = (isValid: boolean) => (
    <span className="inline-flex items-center w-4 h-4 mr-2">
      <FontAwesomeIcon
        icon={isValid ? faCheck : faXmark}
        className={`font-bold ${
          isValid ? "text-green-500" : "text-red-500"
        } text-[13px]`}
      />
    </span>
  );

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder="Type your password"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full mt-1 border border-purple-300 focus:ring-purple-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2  pr-10"
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
      <ul className={validationClass(focused)}>
        <li className="flex items-center px-2 py-1 mb-1 rounded text-gray-900 font-medium bg-zinc-200/80">
          {renderValidationDot(validation.minLength)}
          Minimum 8 characters
        </li>
        <li className="flex items-center px-2 py-1 mb-1 rounded text-gray-900 font-medium bg-zinc-200/80">
          {renderValidationDot(validation.alphanumeric)}
          Must have letters & numbers
        </li>
        <li className="flex items-center px-2 py-1 mb-1 rounded text-gray-900 font-medium bg-zinc-200/80">
          {renderValidationDot(validation.specialChar)}
          Must include special character (!@#$%^&*)
        </li>
      </ul>
    </div>
  );
}
