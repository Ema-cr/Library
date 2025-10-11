import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 font-semibold">{label}</label>}
   <input
  {...props}
  className={`border border-[#CBB89D] rounded-md p-2 text-sm 
  placeholder-[#A67C52] text-[#5C4033]
  focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition ${props.className || ""}`}
/>
    </div>
  );
};

export default Input;
