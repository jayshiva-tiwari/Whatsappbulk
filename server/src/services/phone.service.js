import { DEFAULT_COUNTRY_CODE } from "../utils/constants.js";

const NON_DIGIT_REGEX = /[^\d+]/g;

const normalizeCountryCode = (countryCode = DEFAULT_COUNTRY_CODE) =>
  String(countryCode).replace(/\D/g, "") || DEFAULT_COUNTRY_CODE;

const stripToDigits = (value) => String(value ?? "").replace(/\D/g, "");

const ensureInternationalDigits = (digits, countryCode) => {
  const cleanCountryCode = normalizeCountryCode(countryCode);

  if (!digits) {
    return "";
  }

  if (digits.startsWith(cleanCountryCode)) {
    return digits;
  }

  if (cleanCountryCode === "91" && digits.length === 10) {
    return `${cleanCountryCode}${digits}`;
  }

  if (digits.length < 8) {
    return digits;
  }

  return `${cleanCountryCode}${digits}`;
};

export const normalizePhoneNumber = (rawValue, countryCode = DEFAULT_COUNTRY_CODE) => {
  const raw = String(rawValue ?? "").trim();
  const cleaned = raw.replace(NON_DIGIT_REGEX, "");
  const digits = stripToDigits(cleaned);
  const normalizedDigits = ensureInternationalDigits(digits, countryCode);
  const isValid = normalizedDigits.length >= 10 && normalizedDigits.length <= 15;

  return {
    raw,
    cleaned,
    digits: normalizedDigits,
    international: normalizedDigits ? `+${normalizedDigits}` : "",
    isValid
  };
};

export const buildWaLink = (digits) => `https://wa.me/${digits}`;

