"use client"

import type React from "react"
import { use } from "react";
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Toaster, toast } from "react-hot-toast"
import { ArrowLeft, Star, StarHalf, Briefcase, Shield, DollarSign, Building2, Loader2 } from "lucide-react"
import Link from "next/link"

interface Review {
  _id: string
  companyId: {
    _id: string
    name: string
  }
  workEnv: number
  jobSec: number
  salary: number
  rating: number
}
interface Params {
  id: string;
}
export default function EditReviewPage({ params }: { params:Promise<Params> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [review, setReview] = useState<Review | null>(null)
  const [ratings, setRatings] = useState({
    workEnv: 3,
    jobSec: 3,
    salary: 3,
    rating: 3,
  })
  const { id } = use(params); 
  // Fetch the review data
  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
          credentials: "include", // Include cookies for auth
        })

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Please sign in to edit this review")
            router.push("/signin?redirect=/user-reviews")
            return
          }
          if (response.status === 404) {
            toast.error("Review not found")
            router.push("/user-reviews")
            return
          }
          throw new Error("Failed to fetch review")
        }

        const data = await response.json()
        setReview(data)
        setRatings({
          workEnv: data.workEnv,
          jobSec: data.jobSec,
          salary: data.salary,
          rating: data.rating,
        })
      } catch (error) {
        console.error("Error fetching review:", error)
        toast.error("Failed to load review data")
        router.push("/user-reviews")
      } finally {
        setLoading(false)
      }
    }

    fetchReview()
  }, [])

  const handleRatingChange = (field: keyof typeof ratings, value: number[]) => {
    setRatings((prev) => ({ ...prev, [field]: value[0] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for auth
        body: JSON.stringify(ratings),
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please sign in to update this review")
          router.push("/signin?redirect=/user-reviews")
          return
        }
        throw new Error("Failed to update review")
      }

      toast.success("Review updated successfully!")

      // Redirect back to user reviews after a short delay
      setTimeout(() => {
        router.push("/user-reviews")
      }, 1500)
    } catch (error) {
      console.error("Error updating review:", error)
      toast.error("Failed to update review")
    } finally {
      setSubmitting(false)
    }
  }

  // Function to get label text based on rating value
  const getRatingLabel = (value: number, category: string) => {
    const labels: Record<string, string[]> = {
      workEnv: ["Poor", "Below Average", "Average", "Good", "Excellent"],
      jobSec: ["Very Low", "Low", "Moderate", "High", "Very High"],
      salary: ["Very Low", "Below Market", "Market Rate", "Above Market", "Excellent"],
      rating: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
    }

    return labels[category][value - 1] || ""
  }

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />)
      }
    }
    return stars
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">

      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-16 pb-20 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/user-reviews" className="flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to My Reviews</span>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Edit Your Review</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center">
            Update your ratings to reflect your current experience
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

      {/* Edit Form Section */}
      <div className="max-w-xl mx-auto px-4 py-12 -mt-6 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-lg">
            <Loader2 className="h-12 w-12 animate-spin text-teal-500 mb-4" />
            <p className="text-gray-600">Loading review data...</p>
          </div>
        ) : !review ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600">Review not found or you don't have permission to edit it.</p>
            <Button
              className="mt-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white"
              onClick={() => router.push("/user-reviews")}
            >
              Return to My Reviews
            </Button>
          </div>
        ) : (
          <Card className="shadow-xl border-0 rounded-xl overflow-hidden bg-white">
            <CardHeader className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-teal-100 p-2 rounded-full">
                  <Building2 className="h-5 w-5 text-teal-600" />
                </div>
                <CardTitle className="text-xl font-bold">{review.companyId.name}</CardTitle>
              </div>
              <CardDescription>
                Update your ratings below. All ratings must be whole numbers from 1 to 5.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-teal-500" />
                      Work Environment
                    </Label>
                    <span className="text-sm font-medium text-teal-600">
                      {getRatingLabel(ratings.workEnv, "workEnv")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[ratings.workEnv]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleRatingChange("workEnv", value)}
                      className="flex-1"
                    />
                    <div className="flex">{renderStars(ratings.workEnv)}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-blue-500" />
                      Job Security
                    </Label>
                    <span className="text-sm font-medium text-blue-600">
                      {getRatingLabel(ratings.jobSec, "jobSec")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[ratings.jobSec]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleRatingChange("jobSec", value)}
                      className="flex-1"
                    />
                    <div className="flex">{renderStars(ratings.jobSec)}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      Salary & Benefits
                    </Label>
                    <span className="text-sm font-medium text-green-600">
                      {getRatingLabel(ratings.salary, "salary")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[ratings.salary]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleRatingChange("salary", value)}
                      className="flex-1"
                    />
                    <div className="flex">{renderStars(ratings.salary)}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      Overall Rating
                    </Label>
                    <span className="text-sm font-medium text-yellow-600">
                      {getRatingLabel(ratings.rating, "rating")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[ratings.rating]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleRatingChange("rating", value)}
                      className="flex-1"
                    />
                    <div className="flex">{renderStars(ratings.rating)}</div>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-between p-6 bg-gray-50 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => router.push("/user-reviews")}
                className="px-6 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 px-6"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Review"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Star className="h-4 w-4 text-teal-500 mr-2" />
            <span>Your reviews help others make informed career decisions</span>
          </div>
        </div>
      </div>
    </div>
  )
}

