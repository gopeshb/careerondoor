"use client"

import type React from "react"

import { useState, useEffect, useCallback, memo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import { logout, loginSuccess } from "@/redux/userSlice"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster, toast } from "react-hot-toast"
import { LogOut, Edit, Save, Loader2, ShieldCheck, Star, AlertCircle, X } from "lucide-react"
import Link from "next/link"

type User = {
  id?: string // Allows id to be optional
  firstName: string
  lastName: string
  username: string
  email?: string
  avatar?: string
  admin?: boolean
}

interface FormData {
  firstName: string
  lastName: string
  username: string
}

const ProfilePage = () => {
  // Error boundary fallback
  const [hasFatalError, setHasFatalError] = useState(false)

  // Add this to catch unhandled errors
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Unhandled error:", error)
      setHasFatalError(true)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  // Render error fallback if fatal error occurs
  if (hasFatalError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">We're sorry, but there was an error loading your profile.</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const user = useSelector((state: RootState) => state.user.user) as User | null

  const dispatch = useDispatch()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
  })

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      })
    } else {
      router.push("/signin") // User ko signin page pe bhejna
    }
  }, [user])

  const handleLogout = async () => {
    setLoading(true)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Logout failed with status: ${response.status}`)
      }

      dispatch(logout())
      toast.success("Logged out successfully")
      router.push("/signin")
    } catch (error: any) {
      console.error("Logout error:", error)

      if (error.name === "AbortError") {
        toast.error("Logout request timed out. Please try again.")
      } else {
        toast.error(error.message || "Failed to logout")
      }

      // Still logout on the client side even if the server request fails
      dispatch(logout())
      router.push("/signin")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Enhanced validation
    if (!formData.firstName.trim()) {
      setError("First name is required")
      setLoading(false)
      return
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required")
      setLoading(false)
      return
    }

    if (!formData.username.trim()) {
      setError("Username is required")
      setLoading(false)
      return
    }

    // Username format validation (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(formData.username)) {
      setError("Username can only contain letters, numbers, and underscores")
      setLoading(false)
      return
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${BASE_URL}/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || `Failed to update profile: ${response.status}`)
      }

      // Update Redux store with new user data
      dispatch(loginSuccess(data.user))

      toast.success("Profile updated successfully")
      setIsEditing(false)
    } catch (error: any) {
      if (error.name === "AbortError") {
        setError("Request timed out. Please try again.")
        toast.error("Request timed out. Please try again.")
      } else {
        setError(error.message || "Failed to update profile")
        toast.error(error.message || "Failed to update profile")
      }
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      })
    }
    setIsEditing(false)
    setError(null)
  }

  useEffect(() => {
    // Create an AbortController for cleanup
    const controller = new AbortController()

    // Return cleanup function
    return () => {
      controller.abort() // This will abort any fetch requests using this controller
    }
  }, [])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Please sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Toaster position="top-center" />

      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-16 pb-20 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">My Profile</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center">Manage your account information</p>
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

      {/* Profile Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 -mt-6 relative z-10">
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.currentTarget.style.display = "none"
                        e.currentTarget.parentElement!.innerText = user.firstName?.charAt(0).toUpperCase() || ""
                      }}
                    />
                  ) : (
                    user.firstName?.charAt(0).toUpperCase()
                  )}
                </div>
                {user.admin && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span>@{user.username}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{user.email}</span>
                  {user.admin && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-yellow-600 font-medium flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-1" />
                        Administrator
                      </span>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Your first name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Your username"
                    required
                  />
                  <p className="text-xs text-gray-500">Username must be unique</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    className="order-2 sm:order-1"
                    disabled={loading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 order-1 sm:order-2 sm:flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">{user.firstName}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">{user.lastName}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Username</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">@{user.username}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.admin ? (
                    <>
                      <Link href="/admin" className="sm:order-2">
                        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      </Link>

                      <Link href="/user-reviews" className="sm:order-1">
                        <Button variant="outline" className="w-full border-teal-200 text-teal-600 hover:bg-teal-50">
                          <Star className="mr-2 h-4 w-4" />
                          My Reviews
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/user-reviews" className="sm:col-span-2">
                      <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600">
                        <Star className="mr-2 h-4 w-4" />
                        My Reviews
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging Out...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default memo(ProfilePage)

