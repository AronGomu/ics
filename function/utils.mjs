import { ICSEvent } from "../class/ICSEvent.mjs";

/**
 * Returns today's date formatted as YYYY-MM-DD.
 * 
 * Uses the browser's local time and pads month/day with leading zeros
 * to ensure proper ISO-like formatting.
 *
 * @returns {string} Today's date formatted as "YYYY-MM-DD"
 *
 * @example
 * const today = getTodayDate();
 * console.log(today); // "2026-03-08"
 */
export function getTodayDateAsYYYYMMDD() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


