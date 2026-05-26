"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: string;
}

export const Button = ({
  children,
  type = "primary",
}: ButtonProps) => {
  const buttonVariants: Record<string, string> = {
    primary:
      "bg-[#F84464] text-white px-5 py-2 rounded-md hover:opacity-90",
  };

  return (
    <button className={buttonVariants[type]}>
      {children}
    </button>
  );
};