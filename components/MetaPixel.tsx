"use client";

import Script from "next/script";

/**
 * MetaPixel — renders the Facebook/Meta Pixel base code if the env var
 * NEXT_PUBLIC_META_PIXEL_ID is set. Missing env → zero output (so we can
 * ship this to production while Ehsan is still getting the Pixel ID from
 * Business Manager).
 *
 * Purchase + InitiateCheckout events are emitted from the Razorpay flow,
 * not here. This component only boots the base Pixel script.
 */
export default function MetaPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!id) return null;

  const init = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');
`;

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: init }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
