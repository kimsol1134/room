import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalize phone number to digits-only local format (e.g., 01012341234).
 * - Removes non-digits
 * - Converts leading 82 (KR country code) to 0 for mobile numbers
 */
export function normalizePhone(input: string): string {
  const digits = (input ?? "").replace(/\D/g, "");
  if (digits.startsWith("82") && digits.length >= 10) {
    return "0" + digits.slice(2);
  }
  return digits;
}

