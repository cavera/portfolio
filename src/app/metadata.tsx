import type { Metadata } from "next"
import { CAVERA, siteType, siteKeywords } from "@/data/consts"
import type { Lang } from "@/i18n/strings"

const ogLocale: Record<Lang, string> = { en: "en_US", es: "es_ES" }

export function getMetadata(lang: Lang): Metadata {
  return {
    title: CAVERA.portfolio.name,
    description: CAVERA.portfolio.description,
    metadataBase: new URL(CAVERA.portfolio.url),
    generator: "Next.js",
    applicationName: CAVERA.portfolio.name,
    referrer: "origin-when-cross-origin",
    keywords: siteKeywords,
    authors: [{ name: CAVERA.name, url: CAVERA.portfolio.url }],
    creator: CAVERA.name,
    publisher: CAVERA.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: CAVERA.portfolio.name,
      description: CAVERA.portfolio.description,
      url: CAVERA.portfolio.url,
      siteName: CAVERA.portfolio.name,
      images: [
        {
          url: "og.jpg",
        },
      ],
      locale: ogLocale[lang],
      type: siteType,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32" },
        { url: "/favicon-16x16.png", sizes: "16x16" },
      ],
      shortcut: "/icon.png",
      apple: "/apple-touch-icon.png",
      other: {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: CAVERA.portfolio.name,
      description: CAVERA.portfolio.description,
      creator: CAVERA.twitter,
      images: ["og.jpg"],
    },
  }
}
