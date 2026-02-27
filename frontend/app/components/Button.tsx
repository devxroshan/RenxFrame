import React from "react";

export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SECONDARY_OUTLINE = "secondary_outline",
}

interface ButtonProps {
  variant: ButtonVariant;
  text: string;
  onLoadingText?: string;
  isLoading?: boolean;
  onLoadingStyle?: string;
  onClick?: () => void;
  extendStyle?: string;
  fontStyle?: 'medium' | 'bold' | 'semibold' | 'normal'
}

const Button = ({ variant, text, onClick, extendStyle, isLoading, onLoadingText, onLoadingStyle, fontStyle }: ButtonProps) => {
  return (
    <>
      {variant === ButtonVariant.PRIMARY && (
        <button
          className={`w-full bg-primary-blue text-white py-1 rounded-lg transition-all duration-300 ease-in-out outline-none font-${fontStyle?fontStyle:'normal'} ${extendStyle || ""} ${isLoading ? onLoadingStyle || "opacity-50 cursor-default" : "cursor-pointer hover:text-gray-200 active:scale-95 hover:bg-primary-blue-hover"}`}
          onClick={onClick}
          disabled={isLoading}
        >
          {isLoading ? onLoadingText || "Wait..." : text}
        </button>
      )}
      {variant === ButtonVariant.SECONDARY_OUTLINE && (
        <button className={`w-full bg-tertiary-bg border border-primary-border text-primary-text py-1 rounded-lg transition-all duration-300 ease-in-out outline-none font-semibold text-sm ${extendStyle || ""} ${isLoading ? onLoadingStyle || "opacity-50 cursor-default" : "cursor-pointer hover:bg-tertiary-bg-hover active:scale-95"}`} disabled={isLoading} onClick={onClick}>
          {isLoading ? onLoadingText || "Wait..." : text}
        </button>
      )}
    </>
  );
};

export default Button;
