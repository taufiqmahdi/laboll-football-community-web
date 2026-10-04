// Indonesian mobile numbers, stored without the country code: "81234567890".

// Accepts "0812...", "62812...", "+62 812-..." or "812..." and keeps just the national digits.
export function normalizePhone(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("62")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 12);
}

// "81234567890" -> "812-3456-7890"
export function formatPhone(digits: string) {
  return [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7)].filter(Boolean).join("-");
}

export function isValidPhone(digits: string) {
  return /^8\d{8,11}$/.test(digits);
}
