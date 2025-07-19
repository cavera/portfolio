import { siteColorScheme } from "@/data/consts"
import { Viewport } from "next"

export const viewport: Viewport = {
  themeColor: siteColorScheme,
  colorScheme: siteColorScheme,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}
