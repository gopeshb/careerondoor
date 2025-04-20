"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6 py-4  text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center p-2">Privacy Policy</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center p-3">
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
      <div className="max-w-full sm:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white shadow-xl rounded-2xl ">
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-10 italic">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">1. Introduction</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              Welcome to CareerOnDoor ("we," "our," "us"). Your privacy is our priority. This Privacy Policy outlines
              how we collect, use, and safeguard your personal information when you use our website.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">2. Information We Collect</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8 mb-4">
              We collect information to enhance your experience and improve our services. This includes:
            </p>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-5 sm:mt-6 mb-2 sm:mb-3">Personal Information</h3>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              Information you voluntarily provide, such as your name, email address, or contact details.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-5 sm:mt-6 mb-2 sm:mb-3">Usage Data</h3>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              Non-personal data like browser type, IP address, pages visited, and time spent on our site.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-5 sm:mt-6 mb-2 sm:mb-3">Cookies and Tracking Technologies</h3>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              We use cookies and similar technologies to improve user experience and analyze website traffic.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">3. Use of Information</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8 mb-4">We use collected data to:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              <li>Provide and enhance our job search platform.</li>
              <li>Personalize content and improve user experience.</li>
              <li>Analyze and optimize website performance.</li>
              <li>Deliver relevant advertisements.</li>
              <li>Track user behavior via Google Analytics for service improvements.</li>
            </ul>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">4. Third-Party Services</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8 mb-4">
              Our website integrates third-party services, including:
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              <strong>Ad Networks:</strong> For displaying ads based on user interests and browsing activity.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              <strong>Google Analytics:</strong> To track website traffic and user interactions.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              These services may use cookies and other tracking technologies. You can manage or disable cookies via
              your browser settings.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">5. Disclaimer and Limitation of Liability</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              We strive to provide accurate information but do not guarantee the completeness or reliability of content
              on our platform.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              We are not liable for misinformation, job postings, or third-party content displayed on our website.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              Users are encouraged to verify job listings and company details independently before applying.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">6. Data Security</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              We implement industry-standard security measures to protect your data. However, no online platform can
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">7. Your Choices & Rights</h2>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              <li>Manage cookie preferences through your browser settings.</li>
              <li>Opt out of Google Analytics tracking using Google's opt-out tools.</li>
              <li>Contact us at <a href="mailto:careerondoor@gmail.com" className="text-teal-600 hover:underline">careerondoor@gmail.com</a> to delete or modify your personal data.</li>
            </ul>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">8. Changes to This Policy</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated
              effective date. Please check this page regularly for updates.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">9. Contact Us</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">For questions or concerns about this Privacy Policy, contact us at:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              <li>CareerOnDoor</li>
              <li>Email: <a href="mailto:careerondoor@gmail.com" className="text-teal-600 hover:underline">careerondoor@gmail.com</a></li>
            </ul>
          </section>

          <p className="text-gray-700 text-sm sm:text-base font-medium text-center mt-10 sm:mt-12">
            By using our website, you agree to this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}