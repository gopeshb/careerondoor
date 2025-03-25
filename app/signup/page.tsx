"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import toast, { Toaster } from "react-hot-toast"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"


// 🔹 Public image URLs for avatars
const avatarOptions = [
  "https://firebasestorage.googleapis.com/v0/b/real-estate-315ad.appspot.com/o/avatar1.png?alt=media&token=6eb17688-bfa5-472c-8356-65c3e5296a44",
  "https://firebasestorage.googleapis.com/v0/b/real-estate-315ad.appspot.com/o/avatar2.png?alt=media&token=cbe4077d-6818-461c-ae3f-46472512079e",
  "https://firebasestorage.googleapis.com/v0/b/real-estate-315ad.appspot.com/o/avatar3.png?alt=media&token=f3ebfa01-e4c0-4348-bb06-3456eb0cabfe",
  "https://firebasestorage.googleapis.com/v0/b/real-estate-315ad.appspot.com/o/avatar4.png?alt=media&token=ac54666d-1c46-4043-9dba-05eae19b8199",
  "https://firebasestorage.googleapis.com/v0/b/real-estate-315ad.appspot.com/o/avatar5.png?alt=media&token=f032ff54-685b-49d8-8176-0ef6a99be218",
  "https://firebasestorage.googleapis.com/v0/b/real-estate-315ad.appspot.com/o/avatar6.png?alt=media&token=c71d45b3-0e76-48bf-b143-9a9cd1e261ce",
]

// 🔹 Loading spinner component
function LoadingSpinner() {
  return <div className="w-5 h-5 border-4 border-t-teal-500 border-white/30 rounded-full animate-spin mx-auto"></div>
}

export default function SignUpPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    avatar: avatarOptions[0], // Default avatar
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAvatarSelect = (avatar: string) => {
    setFormData({ ...formData, avatar })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required!")
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Registration failed!")
        setLoading(false)
        return
      }

      toast.success("OTP sent to your email!")
      router.push(`/verify-otp?email=${formData.email}`)
    } catch (error) {
      toast.error("Server error! Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Toaster />

      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-16 pb-20 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Create Your Account</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center">
            Join our community to access personalized job recommendations and connect with top employers.
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

      {/* Sign Up Form Section */}
      <div className="max-w-md mx-auto px-4 py-12 -mt-6 relative z-10">
        <Card className="border-0 shadow-lg p-2 py-3">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" type="text" name="lastName" placeholder="Doe" required onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Avatar Selection */}
              <div className="space-y-3">
                <Label>Select Avatar</Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {avatarOptions.map((avatar) => (
                    <div
                      key={avatar}
                      className={`relative rounded-full cursor-pointer transition-all duration-200 ${
                        formData.avatar === avatar ? "ring-2 ring-offset-2 ring-teal-500" : "hover:opacity-80"
                      }`}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      <img 
  src={avatar || "/placeholder.svg"} 
  alt="Avatar" 
  className="w-full h-auto rounded-full" 
  onContextMenu={(e) => e.preventDefault()} 
/>

                      {formData.avatar === avatar && (
                        <div className="absolute -top-1 -right-1 bg-teal-500 rounded-full p-0.5">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-2 rounded-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed h-11"
              >
                {loading ? <LoadingSpinner /> : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="text-teal-600 font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

