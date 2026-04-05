import React from "react";
import { Helmet } from "react-helmet-async";

export function SEO({ title, description, url, jsonLd }) {
  return (
    <Helmet>
      <title>{title || "Bulk WhatsApp Contact Generator"}</title>
      <meta
        name="description"
        content={
          description ||
          "Convert spreadsheet phone numbers into clean VCF contacts and WhatsApp-ready contact batches for easy WhatsApp group bulk invites."
        }
      />
      <link rel="canonical" href={url || "https://whatsappbulk-lvvt.onrender.com/"} />
      
      <meta property="og:title" content={title || "Bulk WhatsApp Contact Generator"} />
      <meta
        property="og:description"
        content={
          description ||
          "Convert spreadsheet phone numbers into clean VCF contacts and WhatsApp-ready contact batches for easy WhatsApp group bulk invites."
        }
      />
      <meta property="og:url" content={url || "https://whatsappbulk-lvvt.onrender.com/"} />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || "Bulk WhatsApp Contact Generator"} />
      <meta
        name="twitter:description"
        content={
          description ||
          "Convert spreadsheet phone numbers into clean VCF contacts and WhatsApp-ready contact batches for easy WhatsApp group bulk invites."
        }
      />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
