import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import SnowBackground from "@/components/SnowBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "AIBUILDERS - Nigerian AI Builders Movement",
  description: "Join the NAB movement. Build AI solutions for Nigeria. Get trained, connected, and funded.",
  keywords: ["AI", "Nigeria", "Builders", "Artificial Intelligence", "Tech", "Startup"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full min-h-screen w-full max-w-full overflow-x-hidden`}>
      <body className={`${inter.className} h-full min-h-screen w-full max-w-full overflow-x-hidden`}>
        <SnowBackground />
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "hsl(224, 24%, 14%)",
                color: "hsl(210, 20%, 94%)",
                border: "1px solid rgba(29, 184, 122, 0.25)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
