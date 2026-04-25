/**
 * Skillies Workshop · single in-person selection day.
 *
 * The workshop is the funnel entry into the 25-student Skillies Batch.
 * One event at a time, Malappuram only. 70 seats: ₹1,999 first 25
 * (Early Bird) and ₹2,499 next 45 (Regular). No refunds.
 *
 * Add a future workshop by appending to this array; the picker on the
 * page will surface it. For now, May 17, 2026 is the only one open.
 */
export type Workshop = {
  id: string;
  city: string;
  cityShort: string;
  dateLong: string;
  dateShort: string;
  dayOfMonth: string;
  monthShort: string;
  tag: string;
};

export const WORKSHOPS: Workshop[] = [
  {
    id: "workshop-malappuram-may17-2026",
    city: "Malappuram",
    cityShort: "Malappuram",
    dateLong: "Sunday · May 17, 2026",
    dateShort: "May 17",
    dayOfMonth: "17",
    monthShort: "May",
    tag: "Batch Selection · Malappuram Expo",
  },
];

export const DEFAULT_WORKSHOP = WORKSHOPS[0];

export function findWorkshop(id: string): Workshop | undefined {
  return WORKSHOPS.find((w) => w.id === id);
}
