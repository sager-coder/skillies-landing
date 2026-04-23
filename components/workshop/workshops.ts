/**
 * Kerala workshop tour — 4 Sundays · May → June 2026.
 *
 * Source of truth for every workshop date/city/id on the site. Both the
 * marketing surfaces (Hero, Pricing section, Payment details) and the
 * Razorpay `course` field derive from these entries, so a new city is
 * a one-line edit here instead of a grep-and-replace job.
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
    id: "workshop-malappuram-jun7",
    city: "Malappuram",
    cityShort: "Malappuram",
    dateLong: "Sunday · June 7, 2026",
    dateShort: "June 7",
    dayOfMonth: "07",
    monthShort: "Jun",
    tag: "Second run · Malappuram",
  },
  {
    id: "workshop-calicut-jun14",
    city: "Calicut",
    cityShort: "Calicut",
    dateLong: "Sunday · June 14, 2026",
    dateShort: "June 14",
    dayOfMonth: "14",
    monthShort: "Jun",
    tag: "First expansion · Calicut",
  },
  {
    id: "workshop-kochi-jun21",
    city: "Kochi · Ernakulam",
    cityShort: "Kochi",
    dateLong: "Sunday · June 21, 2026",
    dateShort: "June 21",
    dayOfMonth: "21",
    monthShort: "Jun",
    tag: "Kerala finale · Kochi",
  },
];

export const DEFAULT_WORKSHOP = WORKSHOPS[0];

export function findWorkshop(id: string): Workshop | undefined {
  return WORKSHOPS.find((w) => w.id === id);
}
