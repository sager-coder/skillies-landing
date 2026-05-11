/**
 * Curated list of dial codes for the Skillies login picker. Ordered
 * deliberately — India first (primary market), then Gulf states (large
 * NRI student population), then Western markets, then key APAC.
 *
 * Flag emojis use the Regional Indicator Symbol pair (renders natively
 * on macOS/iOS; on Windows, fallback to a small text monogram in the UI
 * if desired — but the dial code itself is the source of truth).
 *
 * Not exhaustive. Add countries here as they're requested.
 */

export type Country = {
  /** ISO 3166-1 alpha-2, used as a stable key. */
  code: string;
  /** Display name shown in the dropdown options. */
  name: string;
  /** Dial code with leading "+", used in the E.164 phone string. */
  dial: string;
  /** Flag emoji rendered alongside the dial code. */
  flag: string;
};

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India",                   dial: "+91",  flag: "🇮🇳" },
  { code: "AE", name: "United Arab Emirates",    dial: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia",            dial: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar",                   dial: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait",                  dial: "+965", flag: "🇰🇼" },
  { code: "OM", name: "Oman",                    dial: "+968", flag: "🇴🇲" },
  { code: "BH", name: "Bahrain",                 dial: "+973", flag: "🇧🇭" },
  { code: "US", name: "United States",           dial: "+1",   flag: "🇺🇸" },
  { code: "CA", name: "Canada",                  dial: "+1",   flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom",          dial: "+44",  flag: "🇬🇧" },
  { code: "AU", name: "Australia",               dial: "+61",  flag: "🇦🇺" },
  { code: "SG", name: "Singapore",               dial: "+65",  flag: "🇸🇬" },
  { code: "MY", name: "Malaysia",                dial: "+60",  flag: "🇲🇾" },
  { code: "ID", name: "Indonesia",               dial: "+62",  flag: "🇮🇩" },
  { code: "PH", name: "Philippines",             dial: "+63",  flag: "🇵🇭" },
  { code: "BD", name: "Bangladesh",              dial: "+880", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka",               dial: "+94",  flag: "🇱🇰" },
  { code: "PK", name: "Pakistan",                dial: "+92",  flag: "🇵🇰" },
  { code: "DE", name: "Germany",                 dial: "+49",  flag: "🇩🇪" },
  { code: "FR", name: "France",                  dial: "+33",  flag: "🇫🇷" },
  { code: "ES", name: "Spain",                   dial: "+34",  flag: "🇪🇸" },
  { code: "IT", name: "Italy",                   dial: "+39",  flag: "🇮🇹" },
  { code: "NL", name: "Netherlands",             dial: "+31",  flag: "🇳🇱" },
  { code: "IE", name: "Ireland",                 dial: "+353", flag: "🇮🇪" },
  { code: "NZ", name: "New Zealand",             dial: "+64",  flag: "🇳🇿" },
];

/** Default selection — Skillies is primarily an Indian product. */
export const DEFAULT_COUNTRY = COUNTRIES[0];
