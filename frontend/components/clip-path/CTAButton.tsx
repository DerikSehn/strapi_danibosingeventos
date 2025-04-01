"use client";

import React from "react";

interface CTAButtonProps {
  text: string;
  href?: string;
  variant?: "primary" | "secondary" | "gradient";
  onClick?: () => void;
  className?: string;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  href,
  variant = "gradient",
  onClick,
  className = "",
}) => {
  const buttonContent = () => {
    switch (variant) {
      case "gradient":
        return (
          <div data-button className="relative group inline-block">
            <div className="relative w-64 h-14 opacity-90 overflow-hidden rounded-sm bg-black z-10">
              <div className="absolute z-10 -translate-x-44 group-hover:translate-x-[30rem] ease-in transition-all duration-700 h-full w-44 bg-gradient-to-r from-primary/30 to-white/20 opacity-30 -skew-x-12"></div>
              <div className="absolute flex items-center justify-center text-white z-[1] opacity-90 rounded-md inset-0.5 bg-black">
                <span className="font-semibold text-lg opacity-90 px-8 py-3">
                  {text}
                </span>
              </div>
              <div className="absolute duration-1000 group-hover:animate-pulse w-full h-[100px] bg-gradient-to-r from-primary to-primary-light blur-[30px]"></div>
            </div>
          </div>
        );

      case "secondary":
        return (
          <div data-button className="border hover:scale-95 duration-300 relative group cursor-pointer overflow-hidden h-14 w-64 rounded-md bg-white p-2 flex justify-center items-center font-bold text-gray-700">
            <div className="absolute right-32 -top-4 group-hover:top-1 group-hover:right-2 z-0 w-40 h-40 rounded-full group-hover:scale-150 duration-500 bg-primary/20"></div>
            <div className="absolute right-2 -top-4 group-hover:top-1 group-hover:right-2 z-0 w-32 h-32 rounded-full group-hover:scale-150 duration-500 bg-primary/30"></div>
            <div className="absolute -right-12 top-4 group-hover:top-1 group-hover:right-2 z-0 w-24 h-24 rounded-full group-hover:scale-150 duration-500 bg-primary/40"></div>
            <div className="absolute right-20 -top-4 group-hover:top-1 group-hover:right-2 z-0 w-16 h-16 rounded-full group-hover:scale-150 duration-500 bg-primary/50"></div>
            <span className="z-10">{text}</span>
          </div>
        );

      case "primary":
      default:
        return (
          <div data-button className="border border-primary hover:scale-95 duration-300 relative group cursor-pointer text-white overflow-hidden h-14 w-64 rounded-md bg-primary p-2 flex justify-center items-center font-bold">
            <div className="absolute right-32 -top-4 group-hover:top-1 group-hover:right-2 z-0 w-40 h-40 rounded-full group-hover:scale-150 duration-500 bg-primary"></div>
            <div className="absolute right-2 -top-4 group-hover:top-1 group-hover:right-2 z-0 w-32 h-32 rounded-full group-hover:scale-150 duration-500 bg-primary/90"></div>
            <div className="absolute -right-12 top-4 group-hover:top-1 group-hover:right-2 z-0 w-24 h-24 rounded-full group-hover:scale-150 duration-500 bg-primary/80"></div>
            <div className="absolute right-20 -top-4 group-hover:top-1 group-hover:right-2 z-0 w-16 h-16 rounded-full group-hover:scale-150 duration-500 bg-primary/70"></div>
            <span className="z-10">{text}</span>
          </div>
        );
    }
  };

  if (href) {
    return (
      <button className={`inline-block ${className}`} onClick={() => window.open(href, "_blank", "noopener,noreferrer")}>
        {buttonContent()}
      </button>
    );
  }

  return (
    <button className={`inline-block ${className}`} onClick={onClick}>
      {buttonContent()}
    </button>
  );
};

export default CTAButton;
