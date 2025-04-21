import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookies() {
  return Object.entries(Cookies.get() ?? {})
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("; ");
}
