"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import { Star, Building2, Shield, Banknote, ExternalLink, Edit, Trash2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { RootState } from "@/redux/store"
import { toast } from "react-hot-toast"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

interface Review {
  _id: string
  companyId: {
    _id: string
    name: string
    website: string
  }
  userId: string
  workEnv: number
  jobSec: number
  salary: number
  rating: number
  createdAt: string
  updatedAt: string
}
export default function UserReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter() // Initialize Next.js router

  const user = useSelector((state: RootState) => state.user.user)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      if (!user?.id) {
        setError("User ID is required to fetch reviews.")
        setLoading(false)
        return
      }

      const response = await fetch(`${BASE_URL}/api/reviews?userId=${user.id}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }))

        if (response.status === 401) {
          toast.error("Session expired. Please log in again.")
          router.push("/signin")
        } else {
          const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`
          setError(errorMessage)
          toast.error(errorMessage)
        }
        return
      }

      const data = await response.json()
      setReviews(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error("Error fetching reviews:", err)
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again later."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user, router])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleDeleteClick = useCallback((reviewId: string) => {
    setDeleteReviewId(reviewId)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteReviewId) return

    setIsDeleting(true)

    try {
      const response = await fetch(`${BASE_URL}/api/reviews/${deleteReviewId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      let data
      try {
        data = await response.json()
      } catch (e) {
        data = { message: "Could not parse response" }
      }

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(data.message || "Unauthorized! Please sign in.")
          router.push("/signin")
          return
        }
        toast.error(data.message || `Failed to delete review (${response.status})`)
        return
      }

      // Remove the deleted review from state
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== deleteReviewId))
      toast.success("Review deleted successfully!")
    } catch (err) {
      console.error("Error deleting review:", err)
      const errorMessage = err instanceof Error ? err.message : "Something went wrong!"
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeleteReviewId(null)
    }
  }, [deleteReviewId, router])
  const renderRatingStars = useCallback((rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }, [])

  const navigateTo = (path: string) => () => {
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Your Company Reviews</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center mb-8">
            Track and manage all the reviews you've submitted
          </p>

          <div className="flex justify-center">
            <Button
              className="bg-white text-teal-600 font-semibold hover:bg-white/90 px-6 py-3"
              onClick={navigateTo("/companies")}
              disabled={loading}
            >
              {loading ? "Loading..." : "Explore Companies"}
            </Button>
          </div>
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

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Submitted Reviews</h2>
          <p className="text-gray-600 mt-2">
            {user ? "All the company reviews you've shared with the community" : `Reviews submitted by`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden border border-gray-200">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error loading reviews</p>
              <p>{error}</p>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't submitted any company reviews yet. Share your experience to help others make informed
              decisions.
            </p>
            <Button
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white"
              onClick={navigateTo("/companies/post-review")}
            >
              Write Your First Review
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <Card
                key={review._id}
                className="overflow-hidden border border-gray-200 hover:border-teal-300 transition-all duration-300 hover:shadow-md"
              >
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-2 shadow-sm h-10 w-10 flex items-center justify-center mr-3">
                        <Building2 className="h-5 w-5 text-teal-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{review.companyId?.name}</h3>
                        <a
                          href={review.companyId?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-teal-600 hover:text-teal-700 flex items-center"
                        >
                          {review.companyId?.website.replace(/^https?:\/\/(www\.)?/, "")}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 border-0">
                        {review.rating.toFixed(1)} ★
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center">
                        <div className="mr-2">{renderRatingStars(review.rating)}</div>
                        <span className="text-sm font-medium text-gray-700">Overall Rating</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-purple-500" /> Work Environment
                        </span>
                        <div className="flex items-center">
                          {renderRatingStars(review.workEnv)}
                          <span className="ml-2 text-gray-700">{review.workEnv.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Shield className="h-4 w-4 text-blue-500" /> Job Security
                        </span>
                        <div className="flex items-center">
                          {renderRatingStars(review.jobSec)}
                          <span className="ml-2 text-gray-700">{review.jobSec.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Banknote className="h-4 w-4 text-green-500" /> Salary
                        </span>
                        <div className="flex items-center">
                          {renderRatingStars(review.salary)}
                          <span className="ml-2 text-gray-700">{review.salary.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {user && (
                      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={navigateTo(`/user-reviews/${review._id}`)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteClick(review._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-50">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your review and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

