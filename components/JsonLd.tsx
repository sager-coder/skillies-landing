/**
 * JsonLd · server-rendered structured-data emitter.
 *
 * Rendered once at the root layout (Organization + WebSite) and
 * optionally on per-vertical pages (SoftwareApplication) so search
 * engines understand what Skillies is. Bumps eligibility for the
 * "by Skillies" / sitelinks treatments in Google results.
 *
 * Pure server component — no client JS shipped.
 */

type OrgWebsiteProps = {
  /** Variant for the root layout. Always emits Organization + WebSite. */
  variant: "site";
};

type ProductProps = {
  /** Variant for /for/<vertical> pages. Adds SoftwareApplication. */
  variant: "vertical";
  verticalLabel: string;
  description: string;
  url: string;
};

export type JsonLdProps = OrgWebsiteProps | ProductProps;

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Skillies.AI",
  url: "https://skillies.ai",
  logo: "https://skillies.ai/brand/skillies-icon-512.png",
  email: "ehsan@skillies.ai",
  description:
    "Skillies builds AI sales workers for Indian businesses — vertical-specific agents that close leads on WhatsApp and Instagram DMs in 5 Indian languages.",
  founder: {
    "@type": "Person",
    name: "Ehsan Asgar P",
  },
  sameAs: ["https://instagram.com/skillies.ai"],
};

const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Skillies.AI",
  url: "https://skillies.ai",
  publisher: {
    "@type": "Organization",
    name: "Skillies.AI",
  },
};

export default function JsonLd(props: JsonLdProps) {
  if (props.variant === "site") {
    return (
      <>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION),
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBSITE),
          }}
        />
      </>
    );
  }

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Skillies for ${props.verticalLabel}`,
    description: props.description,
    url: props.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, WhatsApp Business API",
    offers: {
      "@type": "Offer",
      url: "https://skillies.ai/pricing",
      priceCurrency: "INR",
      eligibleRegion: { "@type": "Country", name: "India" },
    },
    provider: {
      "@type": "Organization",
      name: "Skillies.AI",
      url: "https://skillies.ai",
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(softwareApp),
      }}
    />
  );
}
