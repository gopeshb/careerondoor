"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, HelpCircle, MapPin } from "lucide-react"
import Link from "next/link"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6  text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">404</h1>
          <p className="text-lg md:text-2xl opacity-90 max-w-2xl mx-auto text-center">Oops! Page not found</p>
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

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 -mt-6 relative z-10">
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            {/* Illustration */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-30 h-30 rounded-full bg-blue-100/50 animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-40 h-40 rounded-full bg-teal-100/50 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-blue-500/80" />
                </div>
                <div className="absolute top-12 right-12">
                  <Search className="h-10 w-10 text-teal-500/80 animate-bounce" style={{ animationDuration: "2s" }} />
                </div>
                <div className="absolute bottom-12 left-12">
                  <HelpCircle
                    className="h-8 w-8 text-blue-400/80 animate-bounce"
                    style={{ animationDuration: "2.5s", animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">We've lost this page</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Sorry, the page you're looking for doesn't exist or has been moved to another location.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>

                <Link href="/">
                  <Button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 w-full sm:w-auto">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-gray-50 p-6 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">You might want to check out</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/" className="block">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-center">
                    <Home className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Home</span>
                  </div>
                </Link>
                <Link href="/jobs" className="block">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-center">
                    <Search className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Jobs</span>
                  </div>
                </Link>
                <Link href="/signin" className="block">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-center">
                    <HelpCircle className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Sign In</span>
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

