"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  Building2,
  Star,
  StarHalf,
  MapPin,
  Briefcase,
  ArrowLeft,
  Share2,

  CheckCircle2,
  AlertCircle,
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Mail,
  ExternalLink,
  Info,
  FileText,
  DollarSign,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "react-hot-toast"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

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
  posted_date?: string
  deadline_date?: string
}

// Render star rating with support for half stars
const renderStarRating = (rating: number, size: "sm" | "md" = "sm") => {
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        // For full stars
        if (i < Math.floor(rating)) {
          return <Star key={i} className={`${starSize} text-amber-400 fill-amber-400`} />
        }
        // For half stars
        else if (i < Math.floor(rating + 0.5)) {
          return <StarHalf key={i} className={`${starSize} text-amber-400 fill-amber-400`} />
        }
        // For empty stars
        else {
          return <Star key={i} className={`${starSize} text-gray-300`} />
        }
      })}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
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
    AUD: "A$",
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



export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [showVerificationAlert, setShowVerificationAlert] = useState(true)
  const [applyClicked, setApplyClicked] = useState(false)
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL 
  const jobUrlRef = useRef<string>("")

  useEffect(() => {
    // Set the job URL for sharing
    if (typeof window !== "undefined") {
      jobUrlRef.current = window.location.href
    }

    const fetchJobDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${BASE_API_URL}/api/jobs/${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Job not found")
          }
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

  const handleShare = (platform: string) => {
    const url = jobUrlRef.current
    const title = job ? `${job.role} at ${job.company.name}` : "Job Opportunity"

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this job opportunity: ${url}`)}`
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
        setShareOpen(false)
        return
      default:
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
      setShareOpen(false)
    }
  }

  const handleApplyClick = () => {
    setApplyClicked(true)
    // You could track this event for analytics
  }


  if (loading) {
    return (
      <LoadingSpinner message="Loading job details..." subMessage="Please wait while we fetch the information" />
     
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="border-red-100 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r p-3 from-red-50 to-red-100 border-b border-red-100">
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Error Loading Job
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 text-center">
              <div className="bg-red-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <p className="text-gray-700 mb-8 text-lg">{error || "Job not found"}</p>
              <Button
                onClick={() => router.push("/jobs")}
                className="bg-gradient-to-r from-teal-600  to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-medium px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Hero Section with Glassmorphism */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6  text-white overflow-hidden">
       

        {/* Animated circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-500 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500 opacity-20 blur-3xl animate-blob animation-delay-4000"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center mb-8 gap-2">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300"
              onClick={() => router.push("/jobs")}
              aria-label="Back to jobs"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Back to Jobs</span>
            </Button>
            <div className="flex-1"></div>

            

            <Popover open={shareOpen} onOpenChange={setShareOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="ghost"
      className="text-white hover:bg-white/10 p-2 rounded-full transition-all duration-300 hover:scale-105"
      aria-label="Share job"
    >
      <Share2 className="h-5 w-5 mr-1" />
      <span className="hidden sm:inline">Share</span>
    </Button>
  </PopoverTrigger>
  <PopoverContent
    className="w-80 p-5 rounded-2xl border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-xl transition-all duration-300"
    align="end"
  >
    <h3 className="font-semibold mb-4 text-gray-900 text-base">Share this job</h3>
    <div className="grid grid-cols-4 gap-4 mb-5">
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full bg-blue-50 text-blue-600 hover:scale-110 hover:bg-blue-100 border-none shadow-md transition-all duration-300"
        onClick={() => handleShare("facebook")}
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full bg-sky-50 text-sky-500 hover:scale-110 hover:bg-sky-100 border-none shadow-md transition-all duration-300"
        onClick={() => handleShare("twitter")}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full bg-blue-100 text-blue-700 hover:scale-110 hover:bg-blue-200 border-none shadow-md transition-all duration-300"
        onClick={() => handleShare("linkedin")}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full bg-yellow-50 text-yellow-600 hover:scale-110 hover:bg-yellow-100 border-none shadow-md transition-all duration-300"
        onClick={() => handleShare("email")}
        aria-label="Share via Email"
      >
        <Mail className="h-5 w-5" />
      </Button>
    </div>
    <div className="flex items-center space-x-3">
      <Input
        value={jobUrlRef.current}
        readOnly
        className="text-xs h-9 rounded-lg bg-gray-100 border border-gray-200 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <Button
        variant="outline"
        size="sm"
        className="h-9 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 border-none shadow-sm transition-all duration-300"
        onClick={() => handleShare("copy")}
        aria-label="Copy link"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  </PopoverContent>
</Popover>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{job.role}</h1>
              <div className="flex flex-wrap items-center gap-3 text-white/90">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span className="font-medium">{job.company.name}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="font-medium">{formatLocation(job.country, job.cities, job.remote)}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="font-medium">{formatExperience(job.min_experience, job.max_experience)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <Badge className="bg-white text-teal-700 text-base px-4 py-1.5 font-semibold rounded-full shadow-sm">
                {formatSalary(job.min_salary, job.max_salary, job.currency)}
              </Badge>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {renderStarRating(job.company.avgRating)}
                <span className="text-sm ml-1">({job.company.TotalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-full text-slate-50 fill-current"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z"></path>
          </svg>
        </div>
      </div>

      {/* Job Details Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-6 relative z-20">
        {/* Verification Alert */}
        {showVerificationAlert && (
          <Alert className="mb-8 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6">
  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
    <div className="bg-amber-200 rounded-full p-2 self-start mb-4 sm:mb-0">
      <Info className="h-6 w-6 text-amber-700" />
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-amber-900 mb-2">
        Verify Job Details Before Applying
      </h3>
      <AlertDescription className="text-amber-800 text-sm leading-relaxed">
        Ensure this job aligns with your skills and career goals. Review the description, required skills,
        location, and application deadline carefully before proceeding to the employer's application page.
      </AlertDescription>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 bg-amber-50 text-amber-900 border-amber-400 hover:bg-amber-200 hover:text-amber-950 transition-colors duration-300"
        onClick={() => setShowVerificationAlert(false)}
      >
        Got It
      </Button>
    </div>
  </div>
</Alert>

        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Details Card */}
            <Card className="shadow-xl border-none rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-0">
                {/* Key Details */}
                <div className="grid grid-cols-2 sm:grid-cols-2 divide-x divide-y sm:divide-y-0 divide-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col p-8">
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Experience</span>
                    <div className="flex items-center">
                      <div className="bg-teal-100 rounded-full p-2 mr-3">
                        <Briefcase className="h-5 w-5 text-teal-600" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatExperience(job.min_experience, job.max_experience)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col p-8">
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Salary</span>
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatSalary(job.min_salary, job.max_salary, job.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="shadow-xl border-none rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-8">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="bg-teal-100 rounded-full p-2 mr-4">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {job.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card className="shadow-xl border-none rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-8">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  Required Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-3">
                  {job.skills_required.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-teal-50 to-blue-50 text-teal-800 border border-teal-200 
                      px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 
                      hover:shadow-md hover:from-teal-100 hover:to-blue-100 hover:border-teal-300"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Apply Now Card */}
            <Card className="shadow-xl border-none rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-teal-100 to-blue-100 p-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Apply for This Job</CardTitle>
                <CardDescription className="text-gray-700 mt-2 text-base">
                  Start your next career adventure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <Link href={job.applylink} target="_blank" rel="noopener noreferrer" onClick={handleApplyClick}>
                  <Button
                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 
                  text-white font-semibold py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                  >
                    Apply Now <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    Redirects to the employer's application page
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Company Ratings Card */}
            <Card className="shadow-xl border-none rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-teal-100 to-blue-100 p-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Company Ratings</CardTitle>
                <CardDescription className="text-gray-700 mt-2 text-base">
                  Based on {job.company.TotalReviews} employee reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base font-medium text-gray-700">Work Environment</span>
                      <div className="flex items-center gap-1">
                        <div className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium">
                          {job.company.workEnv}/5
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${job.company.workEnv * 20}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base font-medium text-gray-700">Salary & Benefits</span>
                      <div className="flex items-center gap-1">
                        <div className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
                          {job.company.salary}/5
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${job.company.salary * 20}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base font-medium text-gray-700">Job Security</span>
                      <div className="flex items-center gap-1">
                        <div className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-medium">
                          {job.company.jobSec}/5
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${job.company.jobSec * 20}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Overall Rating</span>
                      <div className="flex items-center">{renderStarRating(job.company.avgRating, "md")}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
