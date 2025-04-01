"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Star,
  StarHalf,
  MapPin,
  Briefcase,
  Calendar,
  ArrowLeft,
  Share2,
  BookmarkPlus,
  ChevronRight,
} from "lucide-react"

interface Company {
  _id: string
  name: string
  workEnv: number
  jobSec: number
  salary: number
  avgRating: number
  TotalReviews: number
}

interface Job {
  _id: string
  role: string
  min_experience: number
  max_experience?: number
  description: string
  country: string
  cities: string[]
  remote: boolean
  skills_required: string[]
  company: Company
  min_salary?: number
  max_salary?: number
  currency: string
  applylink: string
  last_date?: string
  createdAt: string
  updatedAt: string
}

// Render star rating with support for half stars
const renderStarRating = (rating: number) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        // For full stars
        if (i < Math.floor(rating)) {
          return <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        }
        // For half stars
        else if (i < Math.floor(rating + 0.5)) {
          return <StarHalf key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        }
        // For empty stars
        else {
          return <Star key={i} className="h-4 w-4 text-gray-300" />
        }
      })}
      <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  )
}

// Format experience text
const formatExperience = (min: number, max?: number) => {
  if (min === 0 && !max) return "Fresher"
  if (min === 0 && max) return `Up to ${max} Years`
  if (min === max) return `${min} Years`
  if (min && max) return `${min}-${max} Years`
  return `${min}+ Years`
}

// Format salary with currency
const formatSalary = (min?: number, max?: number, currency = "INR") => {
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  }

  const symbol = currencySymbols[currency] || currency

  if (!min && !max) return "Not disclosed"
  if (min && !max) return `${symbol}${min} LPA`
  if (!min && max) return `Up to ${symbol}${max} LPA`
  return `${symbol}${min} - ${symbol}${max} LPA`
}

// Format location
const formatLocation = (country: string, cities: string[], remote: boolean) => {
  if (remote && (!cities || cities.length === 0)) return "Remote"
  if (remote && cities && cities.length > 0) return `${cities.join(", ")} or Remote`
  if (cities && cities.length > 0) return cities.join(", ")
  return country
}

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${BASE_API_URL}/api/jobs/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch job details")
        }
        const data = await response.json()
        setJob(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchJobDetails()
    }
  }, [params.id, BASE_API_URL])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-40 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Job</h2>
              <p className="text-gray-600 mb-6">{error || "Job not found"}</p>
              <Button onClick={() => router.push("/jobs")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section with Wavy Background */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" className="text-white hover:bg-white/20 p-2" onClick={() => router.push("/jobs")}>
              <ArrowLeft className="h-5 w-5 mr-1" /> Back to Jobs
            </Button>
            <div className="flex-1"></div>
            <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
              <BookmarkPlus className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{job.role}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span className="font-medium">{job.company.name}</span>
                </div>
                <span className="text-white/60">•</span>
                {renderStarRating(job.company.avgRating)}
                <span className="text-white/60">•</span>
                <span className="text-sm">{job.company.TotalReviews} reviews</span>
              </div>
            </div>

            <Badge className="bg-white text-teal-700 text-sm px-3 py-1">
              {formatSalary(job.min_salary, job.max_salary, job.currency)}
            </Badge>
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

      {/* Job Details Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Key Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Experience</span>
                    <div className="flex items-center mt-1">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{formatExperience(job.min_experience, job.max_experience)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Location</span>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{formatLocation(job.country, job.cities, job.remote)}</span>
                    </div>
                  </div>

                  {job.last_date && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Apply By</span>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">{formatDate(job.last_date)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Job Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                  <div className="prose max-w-none text-gray-700">
                    {job.description.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Skills Required */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100 px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Now Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Apply for this position</h3>
                <Link href={job.applylink} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                    Apply Now <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 mt-2">This will take you to the company's application page</p>
              </CardContent>
            </Card>

            {/* Company Ratings Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Company Ratings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Work Environment</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {job.company.workEnv}/5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Salary & Benefits</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {job.company.salary}/5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Job Security</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {job.company.jobSec}/5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Overall Rating</span>
                    <div>{renderStarRating(job.company.avgRating)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Posted Info */}
           
          </div>
        </div>
      </div>
    </div>
  )
}

