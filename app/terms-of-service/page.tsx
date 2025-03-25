"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
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

      {/* Terms of Service Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 bg-white shadow-md rounded-lg relative z-10">
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-500 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
            <p>
              Welcome to CareerOnDoor ("we," "our," "us"). By accessing or using our platform, including all the
              content, services, and features available through our website (careerondoor.com), you agree to be bound by
              the following terms and conditions ("Terms"). Please read them carefully.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Service Description</h2>
            <p>
              Our platform provides a job search service to help users find job opportunities and company listings. We
              aim to ease your job search process by offering relevant information, resources, and connections. However,
              we do not guarantee the accuracy or reliability of the information available on our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Responsibilities</h2>
            <p>By using our website, you agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Provide accurate, current, and complete information when creating an account or interacting with the
                platform.
              </li>
              <li>Not use the website for any illegal or unauthorized purpose.</li>
              <li>Not upload, share, or distribute content that is offensive, harmful, or violates any laws.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Information Disclaimer</h2>
            <p>While we strive to provide helpful and accurate information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                We do not guarantee the accuracy, completeness, or reliability of any job postings, company information,
                or third-party content on the platform.
              </li>
              <li>
                Users are responsible for verifying any job opportunities, company details, or other information before
                taking any action, such as applying for jobs.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Use of Third-Party Services</h2>
            <p>Our website may feature third-party services, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Google AdSense:</strong> To display ads based on your browsing activity and interests.
              </li>
              <li>
                <strong>Google Analytics:</strong> To track user interactions and website performance.
              </li>
            </ul>
            <p>
              By using our website, you consent to the use of cookies and similar technologies to collect data,
              including data related to your interactions with ads.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Account Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account login information. You agree to
              notify us immediately of any unauthorized use of your account or any other security breach.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Limitation of Liability</h2>
            <p>
              We are not responsible for any direct, indirect, incidental, or consequential damages resulting from the
              use of our platform. This includes, but is not limited to, damages caused by errors or omissions in job
              listings and other services, third-party links, or any disruption in service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Termination of Access</h2>
            <p>
              We reserve the right to suspend or terminate your access to the platform at our discretion, without
              notice, for violations of these Terms or any unlawful activities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Privacy and Data Protection</h2>
            <p>
              Our{" "}
              <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>{" "}
              outlines how we collect, use, and protect your personal information. By using our platform, you agree to
              our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Changes to Terms</h2>
            <p>
              We may update these Terms and Conditions from time to time. Any changes will be posted on this page with
              an updated effective date. It is your responsibility to check this page periodically for any updates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>By email: careerondoor@gmail.com</li>
            </ul>
          </section>

          <p className="text-gray-700 font-medium">
            By using our website, you agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  )
}

