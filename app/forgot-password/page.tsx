"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Enhanced email validation
    if (!email.trim()) {
      setError("Email is required")
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 400) {
          setError(data.message || "Invalid email format")
        } else if (response.status === 404) {
          // For security reasons, we might want to show a generic message even if the email doesn't exist
          setSuccess(true) // Still show success to prevent email enumeration
        } else if (response.status === 429) {
          setError("Too many requests. Please try again later.")
        } else {
          setError(data.message || "Failed to process request")
        }

        if (response.status !== 404) {
          // Only throw for non-404 errors
          throw new Error(data.message || "Failed to process request")
        }
      } else {
        setSuccess(true)
        toast.success("Password reset link sent to your email!")
      }
    } catch (error: any) {
      // Check if it's a network error
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        setError("Network error. Please check your connection and try again.")
        toast.error("Network error. Please check your connection.")
      } else if (!success) {
        // Don't show error toast if we're showing success UI (for 404)
        toast.error(error.message || "Failed to send reset link")
      }
      console.error("Forgot password error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6  text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/signin" className="flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Sign In</span>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Reset Your Password</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center">
            Enter your email address and we'll send you a link to reset your password.
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

      {/* Forgot Password Form Section */}
      <div className="max-w-md mx-auto px-4 py-12 -mt-6 relative z-10">
        <Card className="border-0 shadow-lg p-3">
          <CardHeader className="space-y-1">
            <div className="mx-auto bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Mail className="h-8 w-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              {success
                ? "Check your email for a reset link"
                : "Enter your email address to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-6">
                <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reset Link Sent!</h3>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <span className="font-medium text-teal-600">{email}</span>. Please
                  check your inbox and follow the instructions.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full border-teal-500 text-teal-600 hover:bg-teal-50"
                    onClick={() => setSuccess(false)}
                  >
                    Try a different email
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                    onClick={() => router.push("/signin")}
                  >
                    Return to Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={handleChange}
                      className={`pl-10 ${error ? "border-red-300 focus:ring-red-500" : ""}`}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    We'll send a password reset link to this email address
                  </div>

                  {error && (
                    <div className="flex items-start mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-2 rounded-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed h-11"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <div className="text-xs text-gray-500 mt-4">
                  <p>Didn't receive the email?</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email address</li>
                    <li>Allow a few minutes for the email to arrive</li>
                  </ul>
                </div>
              </form>
            )}

            {!success && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Remembered your password?{" "}
                  <Link href="/signin" className="text-teal-600 font-medium hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <CheckCircle className="h-4 w-4 text-teal-500 mr-2" />
            <span>We'll never share your email with anyone else</span>
          </div>
        </div>
      </div>
    </div>
  )
}
