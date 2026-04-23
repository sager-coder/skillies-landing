/**
 * Kerala workshop tour — 3 Sundays · May 2026.
 *
 * Schedule: May 10 Malappuram (launch) → May 17 Calicut → May 31 Kochi.
 * May 24 is skipped because Bakrid / Eid-al-Adha falls that week
 * (May 27), and that district (Malappuram especially) is 70%+ Muslim;
 * running a paid workshop into Eid prep is a dead ad week.
 *
 * Source of truth for every workshop date/city/id on the site. Both the
 * marketing surfaces (Hero, Pricing, Payment details) and the Razorpay
 * `course` field derive from these entries, so adding a city is a
 * one-line edit here instead of a grep-and-replace job.
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
    id: "workshop-malappuram-may10",
    city: "Malappuram",
    cityShort: "Malappuram",
    dateLong: "Sunday · May 10, 2026",
    dateShort: "May 10",
    dayOfMonth: "10",
    monthShort: "May",
    tag: "Launch · Malappuram",
  },
  {
    id: "workshop-calicut-may17",
    city: "Calicut",
    cityShort: "Calicut",
    dateLong: "Sunday · May 17, 2026",
    dateShort: "May 17",
    dayOfMonth: "17",
    monthShort: "May",
    tag: "Calicut expansion",
  },
  {
    id: "workshop-kochi-may31",
    city: "Kochi · Ernakulam",
    cityShort: "Kochi",
    dateLong: "Sunday · May 31, 2026",
    dateShort: "May 31",
    dayOfMonth: "31",
    monthShort: "May",
    tag: "Kerala finale · Kochi",
  },
];

export const DEFAULT_WORKSHOP = WORKSHOPS[0];

export function findWorkshop(id: string): Workshop | undefined {
  return WORKSHOPS.find((w) => w.id === id);
}
