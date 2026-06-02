"use client";

import type { IconType } from "react-icons";

interface IconProps {
  variant?: "muted" | "social" | "white";
  size?: number;
  className?: string;
  Icon: IconType;
}

export const Icon = ({
  variant = "muted",
  size = 18,
  className = "",
  Icon,
}: IconProps) => {
  const iconVariants = {
    muted: "text-gray-700",
    social:
      "w-8 h-8 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors",
    white: "text-white"
  };

  return (
    <Icon size={size} className={`${iconVariants[variant]} ${className}`} />
  );
};
