"use client";

import { IconType } from "react-icons";

interface IconProps {
  variant?: "muted" | "social";
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
    muted: "text-gray-500",
    social:
      "w-8 h-8 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors",
  };

  return (
    <Icon
      size={size}
      className={`${iconVariants[variant]} ${className}`}
    />
  );
};