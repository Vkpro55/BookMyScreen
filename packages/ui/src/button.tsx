"use client";

import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: string;
}

export const Button = ({ children, type = "primary" }: ButtonProps) => {
  const buttonVariants: Record<string, string> = {
    primary:
      "bg-[#F84464] text-white cursor-pointer px-4 py-1 rounded text-sm font-medium font-inter",
  };

  return <button className={buttonVariants[type]}>{children}</button>;
};
