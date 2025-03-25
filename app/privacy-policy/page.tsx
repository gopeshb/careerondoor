"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-16 pb-20 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Privacy Policy</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center">
            How we collect, use, and protect your information
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-full text-white fill-current"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z"></path>
          </svg>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 bg-white shadow-md rounded-lg  relative z-10 ">
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-500 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
            <p>
              Welcome to CareerOnDoor ("we," "our," "us"). Your privacy is important to us. This Privacy Policy explains
              how we collect, use, and protect your personal information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
            <p>We collect information to improve your experience and optimize our services. This may include:</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Personal Information</h3>
            <p>If you voluntarily provide details such as name, email, contact information or other. </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Usage Data</h3>
            <p>
              We collect non-personal data, including browser type, IP address, pages visited, and time spent on our
              site.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Cookies and Tracking Technologies</h3>
            <p>We use cookies and similar technologies to enhance user experience and analyze website traffic.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Use of Information</h2>
            <p>We use collected data for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and improve our job search platform.</li>
              <li>To enhance user experience and personalize content.</li>
              <li>To analyze and optimize website performance.</li>
              <li>To serve relevant advertisements through Google AdSense.</li>
              <li>To track user behavior via Google Analytics for better service improvements.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Third-Party Services</h2>
            <p>Our website uses third-party services, including but not limited to:</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Google AdSense</h3>
            <p>For displaying ads based on user interests and browsing activity.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Google Analytics</h3>
            <p>To track website traffic and user interactions.</p>

            <p>
              These services may collect cookies and other tracking information. You can manage or disable cookies via
              your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Disclaimer and Limitation of Liability</h2>
            <p>
              We do not guarantee the accuracy, reliability, or completeness of any information available on our
              platform.
            </p>
            <p>
              We are not liable for any misinformation, job postings, or third-party content displayed on our website.
            </p>
            <p>Users should verify job listings and company details independently before applying.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data Security</h2>
            <p>
              We take reasonable security measures to protect your data. However, no online platform is completely
              secure, and we cannot guarantee absolute data protection.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Your Choices & Rights</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>You can manage cookie settings through your browser.</li>
              <li>You can opt out of Google Analytics tracking using Google's opt-out tools.</li>
              <li>If you wish to delete or modify your personal data, contact us at careerondoor@gmail.com</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time.  Any changes will be posted on this page with
              an updated effective date. It is your responsibility to check this page periodically for any updates.index
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Contact Us</h2>
            <p>For any questions or concerns regarding this Privacy Policy, please contact us at:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>CareerOnDoor</li>
              <li>Email: careerondoor@gmail.com</li>
            </ul>
          </section>

          <p className="text-gray-700 font-medium">By using our website, you agree to this Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}

