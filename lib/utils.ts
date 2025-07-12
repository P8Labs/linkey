import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SHORTEN_DOMAIN = () => {
  const domain = process.env.NEXT_PUBLIC_SHORTEN_DOMAIN || "localhost:3000";
  let protocal;
  if (domain.includes("localhost")) {
    protocal = "http://";
  } else {
    protocal = "https://";
  }

  return `${protocal}${domain}`;
};
export const tags = [
  {
    value: "social",
    label: "Social",
    color: "bg-palette-blue text-palette-blue border-palette-blue",
  },
  {
    value: "projects",
    label: "Projects",
    color: "bg-palette-yellow text-palette-yellow border-palette-yellow",
  },
  {
    value: "marketing",
    label: "Marketing",
    color: "bg-palette-peach text-palette-peach border-palette-peach",
  },
  {
    value: "personal",
    label: "Personal",
    color: "bg-palette-pink text-palette-pink border-palette-pink",
  },
  {
    value: "custom",
    label: "Custom",
    color:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  },
];
