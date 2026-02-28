import React from 'react'

export enum InputVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

interface InputProps {
  variant: InputVariant;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  extendStyle?: string;
  fontStye?: "bold" | "medium" | "semibold" | "normal"
}


const Input = ({variant, type, placeholder, value, fontStye, onChange, extendStyle}:InputProps) => {
  return (
    <>
      {variant === InputVariant.PRIMARY && <input 
        type={type || "text"} 
        placeholder={placeholder || "Name"} 
        className={`w-full px-2 py-1 font-${fontStye?fontStye:"normal"} rounded-lg border border-primary-border focus:outline-none focus:ring-2 focus:ring-primary-blue ${extendStyle || ''}`} 
        value={value ?? ""}
        onChange={onChange}
      />}
    </>
  )
}

export default Input