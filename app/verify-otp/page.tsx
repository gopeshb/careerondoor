"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { loginSuccess } from "@/redux/userSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, KeyRound, CheckCircle, RefreshCw, AlertCircle } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Link from "next/link"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Loading Spinner Component
function LoadingSpinner() {
  return <div className="w-5 h-5 border-4 border-t-teal-500 border-white/30 rounded-full animate-spin mx-auto"></div>
}

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const email = searchParams?.get("email")

  // Handle OTP input change - only allow numbers and limit to 6 digits
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
    setOtp(value)
    if (error) setError(null)
  }

  // Handle OTP verification submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Validate OTP
    if (!otp) {
      setError("OTP is required")
      return
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits")
      return
    }

    if (!email) {
      setError("Email is missing. Please go back to sign up.")
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed")
      }

      // Store user data in Redux after successful verification
      dispatch(loginSuccess(data.user))

      toast.success("Account verified successfully!")

      // Redirect after a short delay to allow the toast to be seen
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Verification failed. Please try again.")
      toast.error(error.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (resendLoading || resendTimer > 0) return

    if (!email) {
      setError("Email is missing. Please go back to sign up.")
      return
    }

    setResendLoading(true)
    setError(null)

    try {
      const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }

      toast.success("New OTP sent to your email!")
      setResendTimer(60) // Start 60 second countdown
    } catch (error: any) {
      setError(error.message || "Failed to resend OTP. Please try again.")
      toast.error(error.message || "Failed to resend OTP")
    } finally {
      setResendLoading(false)
    }
  }

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer <= 0) return

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [resendTimer])

  // Redirect if email is missing
  useEffect(() => {
    if (!email && typeof window !== "undefined") {
      toast.error("Email is missing. Redirecting to sign up...")
      setTimeout(() => {
        router.push("/signup")
      }, 2000)
    }
  }, [email, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Toaster position="top-center" />

      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-16 pb-20 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/signup" className="flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Sign Up</span>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Verify Your Account</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center">
            We've sent a verification code to your email. Please enter it below to complete your registration.
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

      {/* OTP Verification Form Section */}
      <div className="max-w-md mx-auto px-4 py-12 -mt-6 relative z-10">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="mx-auto bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <KeyRound className="h-8 w-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center">
              {email ? (
                <>
                  We've sent a 6-digit code to <span className="font-medium text-teal-600">{email}</span>
                </>
              ) : (
                "Please enter the verification code sent to your email"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={handleChange}
                  className={`text-center text-lg tracking-widest font-medium ${error ? "border-red-300 focus:ring-red-500" : ""}`}
                  required
                />

                {error && (
                  <div className="flex items-start mt-1.5 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-2 rounded-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed h-11"
              >
                {loading ? <LoadingSpinner /> : "Verify Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOTP}
                  disabled={resendLoading || resendTimer > 0}
                  className={`text-teal-600 font-medium hover:underline flex items-center justify-center mx-auto mt-1 ${resendLoading || resendTimer > 0 ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {resendLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Sending...
                    </>
                  ) : resendTimer > 0 ? (
                    `Resend in ${resendTimer}s`
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Resend Code
                    </>
                  )}
                </button>
              </p>
            </div>
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

