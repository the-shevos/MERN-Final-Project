import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  focused: boolean;
  validation: Record<string, boolean>;
  validationLabels: string[];
}

export default function InputField({
  label,
  name,
  value,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  focused,
  validation,
  validationLabels,
}: InputFieldProps) {
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
        className={isValid ? "text-green-500" : "text-red-500"}
        size="sm"
      />
    </span>
  );

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        required
      />
      <ul className={validationClass(focused)}>
        {Object.keys(validation).map((key, idx) => (
          <li key={key} className="flex items-center">
            {renderValidationDot(validation[key])}
            {validationLabels[idx]}
          </li>
        ))}
      </ul>
    </div>
  );
}
