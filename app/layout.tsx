"use client"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { MsalProvider } from "@azure/msal-react";
import { loginRequest, msalInstance } from "./auth/msal";
import AuthLayout from "./auth/AuthLayout";


const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <MsalProvider instance={msalInstance}>

          <ThemeProvider>
            <AuthLayout>
              {children}
            </AuthLayout>
          </ThemeProvider>
        </MsalProvider>
      </body>
    </html >
  )
}
