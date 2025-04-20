"use client"

import { useState, type ChangeEvent, type FormEvent, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get("token")
  const email = searchParams?.get("email")

  // Validate token on page load
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setTokenValid(false)
        setValidating(false)
        setError("Missing reset token or email. Please request a new password reset link.")
        return
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/validate-reset-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        })

        const data = await response.json()

        if (response.ok) {
          setTokenValid(true)
        } else {
          setTokenValid(false)
          // Set more specific error messages based on the response
          if (response.status === 404) {
            setError("User not found. Please check your email address.")
          } else if (response.status === 410) {
            setError("This reset link has expired. Please request a new one.")
          } else {
            setError(data.message || "Invalid or expired reset link. Please request a new one.")
          }
        }
      } catch (error) {
        setTokenValid(false)
        setError("Network error. Please check your connection and try again.")
        console.error("Token validation error:", error)
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token, email])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const validatePassword = (password: string): boolean => {
    // Password must be at least 6 characters
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number")
      return false
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      setError("Password must contain at least one letter")
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const { password, confirmPassword } = formData

    // Validate passwords
    if (!password || !confirmPassword) {
      setError("Both fields are required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!validatePassword(password)) {
      return
    }

    if (!token || !email) {
      setError("Missing reset token or email")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 400) {
          setError(data.message || "Invalid request. Please check your information.")
        } else if (response.status === 401) {
          setError("Invalid or expired token. Please request a new password reset link.")
        } else if (response.status === 404) {
          setError("User not found. Please check your email address.")
        } else if (response.status === 429) {
          setError("Too many attempts. Please try again later.")
        } else {
          setError(data.message || "Failed to reset password. Please try again.")
        }
        throw new Error(data.message || "Failed to reset password")
      }

      setSuccess(true)
      toast.success("Password reset successfully!")
    } catch (error: any) {
      // Check if it's a network error
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        setError("Network error. Please check your connection and try again.")
        toast.error("Network error. Please check your connection.")
      } else {
        // Use the error message already set above for API errors
        toast.error(error.message || "Failed to reset password")
      }
      console.error("Reset password error:", error)
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
            Create a new password for your account
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

      {/* Reset Password Form Section */}
      <div className="max-w-md mx-auto px-4 py-12 -mt-6 relative z-10">
        <Card className="border-0 shadow-lg p-3 ">
          <CardHeader className="space-y-1">
            <div className="mx-auto bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Lock className="h-8 w-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {success ? "Your password has been reset successfully" : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {validating ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
                <p className="text-gray-600">Validating your reset link...</p>
              </div>
            ) : !tokenValid && !success ? (
              <div className="text-center py-6">
                <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid or Expired Link</h3>
                <p className="text-gray-600 mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                  onClick={() => router.push("/forgot-password")}
                >
                  Request New Link
                </Button>
              </div>
            ) : success ? (
              <div className="text-center py-6">
                <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Password Reset Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                  onClick={() => router.push("/signin")}
                >
                  Sign In
                </Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 ${error ? "border-red-300 focus:ring-red-500" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-xs flex justify-between mb-1">
                    <span>Password strength:</span>
                    <span
                      className={`font-medium ${
                        !formData.password
                          ? "text-gray-400"
                          : formData.password.length < 6
                            ? "text-red-500"
                            : formData.password.length < 8
                              ? "text-orange-500"
                              : "text-green-500"
                      }`}
                    >
                      {!formData.password
                        ? "None"
                        : formData.password.length < 6
                          ? "Weak"
                          : formData.password.length < 8
                            ? "Medium"
                            : "Strong"}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        !formData.password
                          ? "w-0"
                          : formData.password.length < 6
                            ? "w-1/4 bg-red-500"
                            : formData.password.length < 8
                              ? "w-1/2 bg-orange-500"
                              : "w-full bg-green-500"
                      } transition-all duration-300`}
                    ></div>
                  </div>
                  <ul className="text-xs text-gray-500 mt-1 space-y-1 list-disc pl-4">
                    <li className={formData.password.length >= 6 ? "text-green-500" : ""}>At least 6 characters</li>
                    <li className={/\d/.test(formData.password) ? "text-green-500" : ""}>At least one number</li>
                    <li className={/[a-zA-Z]/.test(formData.password) ? "text-green-500" : ""}>At least one letter</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 ${error ? "border-red-300 focus:ring-red-500" : ""}`}
                      required
                    />
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
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-2 rounded-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed h-11 my-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <CheckCircle className="h-4 w-4 text-teal-500 mr-2" />
            <span>Your information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
