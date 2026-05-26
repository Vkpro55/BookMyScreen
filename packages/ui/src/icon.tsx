"use client";

import { IconType } from "react-icons";

interface IconProps {
    type?: "gray";
    size?: number;
    className?: string;
    Icon: IconType;
}

export const Icon = ({
    type = "gray",
    size = 18,
    className = "",
    Icon,
}: IconProps) => {
    const iconVariants = {
        gray: "text-gray-500",
    };

    return (
        <Icon
            size={size}
            className={`${iconVariants[type]} ${className}`}
        />
    );
};