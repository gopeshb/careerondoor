import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "CareerOnDoor - Your Gateway to Career Success",
  description:
    "CareerOnDoor connects job seekers with top companies. Explore job opportunities, career advice, and hiring trends. Start your journey today!",
    keywords:
    "jobs, career, hiring, job search, career opportunities, recruitment, employment, CareerOnDoor",
  authors: [{ name: "CareerOnDoor Team", url: "https://careerondoor.vercel.app" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body data-new-gr-c-s-check-loaded="14.1096.0"
                         data-gr-ext-installed="">
         <StoreProvider> 
         <Toaster position="top-center" toastOptions={{ style: { zIndex: 9999 } }} />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
