"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6  text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Terms of Service</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center">
            Please read these terms carefully before using our platform
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

      <div className="max-w-full sm:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white shadow-xl rounded-2xl ">
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-10 italic">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">1. Introduction</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              Welcome to CareerOnDoor ("we," "our," "us"). By accessing or using our platform, including all content, services, and features available through our website (careerondoor.com), you agree to be bound by these Terms and Conditions ("Terms"). Please read them carefully to understand your rights and responsibilities.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">2. Service Description</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              CareerOnDoor provides a job search platform to connect users with job opportunities and company listings. We aim to simplify your job search by offering relevant information and resources. However, we do not guarantee the accuracy, completeness, or reliability of the information provided on our platform.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">3. User Responsibilities</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8 mb-4">By using our website, you agree to:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              <li>Provide accurate, current, and complete information when creating an account or interacting with the platform.</li>
              <li>Refrain from using the website for any illegal or unauthorized purposes.</li>
              <li>Avoid uploading, sharing, or distributing content that is offensive, harmful, or violates any applicable laws.</li>
            </ul>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">4. Information Disclaimer</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8 mb-4">While we strive to provide helpful and accurate information, we do not:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              <li>Guarantee the accuracy, completeness, or reliability of job postings, company information, or third-party content on the platform.</li>
              <li>Take responsibility for verifying job opportunities or company details; users must independently verify information before applying.</li>
            </ul>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">5. Use of Third-Party Services</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8 mb-4">Our website integrates third-party services, including:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              <li>Ad Networks: To display advertisements based on your browsing activity and interests.</li>
              <li>Google Analytics: To track user interactions and optimize website performance.</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8 mt-4">
              By using our website, you consent to the use of cookies and similar technologies for data collection, including data related to ad interactions.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">6. Account Security</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              You are responsible for maintaining the confidentiality of your account login information. Please notify us immediately at <a href="mailto:careerondoor@gmail.com" className="text-teal-600 hover:underline">careerondoor@gmail.com</a> if you suspect unauthorized use of your account or any security breach.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              We are not liable for any direct, indirect, incidental, or consequential damages resulting from your use of our platform, including damages from errors or omissions in job listings, third-party links, or service disruptions.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">8. Termination of Access</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              We reserve the right to suspend or terminate your access to the platform at our discretion, without notice, for violations of these Terms or any unlawful activities.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">9. Privacy and Data Protection</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              Our <Link href="/privacy-policy" className="text-teal-600 hover:underline">Privacy Policy</Link> details how we collect, use, and protect your personal information. By using our platform, you agree to the terms outlined in our Privacy Policy.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">10. Changes to Terms</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              We may update these Terms periodically. Changes will be posted on this page with an updated effective date. Please check this page regularly to stay informed of any updates.
            </p>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 border-l-4 border-teal-500 pl-3 sm:pl-4">11. Contact Us</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">For questions about these Terms, please contact us at:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 text-sm sm:text-base leading-7 sm:leading-8">
              <li>Email: <a href="mailto:careerondoor@gmail.com" className="text-teal-600 hover:underline">careerondoor@gmail.com</a></li>
            </ul>
          </section>

          <p className="text-gray-700 text-sm sm:text-base font-medium text-center mt-10 sm:mt-12">
            By using our website, you agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  )
}