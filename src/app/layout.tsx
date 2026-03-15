import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "AIBUILDERS.NG - Nigerian AI Builders Movement",
  description: "Join the NAB movement. Build AI solutions for Nigeria. Get trained, connected, and funded.",
  keywords: ["AI", "Nigeria", "Builders", "Artificial Intelligence", "Tech", "Startup"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1F3B",
                color: "#B3B8C5",
                border: "1px solid #00FFA6",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
