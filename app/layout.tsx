import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script";

export const metadata: Metadata = {
  title: "CareerOnDoor - Your Gateway to Career Success",
  description:
    "CareerOnDoor connects job seekers with top companies. Explore job opportunities, career advice, and hiring trends. Start your journey today!",
    keywords:
    "jobs, career, hiring, job search, career opportunities, recruitment, employment, CareerOnDoor",
  authors: [{ name: "CareerOnDoor Team", url: "https://careerondoor.tech" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name='impact-site-verification' value='bd3e6a98-117e-438b-a7ad-11f0aaa2d358'></meta>

      <meta name="google-site-verification" content="KEEzMzycN6LOuzLZTQ6dPnuOKG5_xzDBWlB8DMmQhsU" />
      </head>
      <body data-new-gr-c-s-check-loaded="14.1096.0"
                         data-gr-ext-installed="">
        <StoreProvider> 
        <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            color: "#334155",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            borderRadius: "0.75rem",
            padding: "1rem",
            fontSize: "0.875rem",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9075132581085185"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <GoogleAnalytics gaId="G-CLNL55WT89" />
      </body>
    </html>
  );
}
