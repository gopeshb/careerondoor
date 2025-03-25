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
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9075132581085185"
     crossOrigin="anonymous"></Script>
      <meta name="google-adsense-account" content="ca-pub-9075132581085185">
      </meta>
      </head>
      <body data-new-gr-c-s-check-loaded="14.1096.0"
                         data-gr-ext-installed="">
         <StoreProvider> 
         <Toaster position="top-center" toastOptions={{ style: { zIndex: 9999 } }} />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
        <GoogleAnalytics gaId="G-CLNL55WT89" />
    </html>
  );
}
