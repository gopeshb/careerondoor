"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import {
  Loader2,
  Search,
  Building2,
  Globe,
  Star,
  StarHalf,
  Briefcase,
  Shield,
  DollarSign,
  AlertCircle,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Company {
  _id: string
  name: string
  website?: string
}

interface Review {
  workEnv: number
  jobSec: number
  salary: number
  rating: number
  companyId?: string
  companyName?: string
  companyWebsite?: string
}
export default function ReviewForm() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState("")
  const [showOthers, setShowOthers] = useState(false)
  const [manualCompany, setManualCompany] = useState({ name: "", website: "" })
  const [websiteError, setWebsiteError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("company")

  const [review, setReview] = useState<Review>({
    workEnv: 3,
    jobSec: 3,
    salary: 3,
    rating: 3,
  })

  useEffect(() => {
    if (searchTerm.length < 3) return
    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${BASE_URL}/api/companies?search=${searchTerm}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setCompanies([...data, { _id: "others", name: "Others" }])
      } catch {
        toast.error("Error fetching companies")
        setCompanies([{ _id: "others", name: "Others" }])
      } finally {
        setLoading(false)
      }
    }
    const handler = setTimeout(fetchCompanies, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const validateWebsiteUrl = (url: string): boolean => {
    // Check if URL starts with http:// or https://
    if (!url.match(/^https?:\/\//i)) {
      setWebsiteError("URL must start with https://")
      return false
    }

    // Check for valid domain extension
    if (!url.match(/\.[a-z]{2,}$/i)) {
      setWebsiteError("URL must have a valid domain extension (e.g., .com, .org)")
      return false
    }

    // URL is valid
    setWebsiteError(null)
    return true
  }

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setManualCompany({ ...manualCompany, website: url })

    if (url.trim()) {
      validateWebsiteUrl(url)
    } else {
      setWebsiteError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCompany && !showOthers) return toast.error("Please select a company")
    if (showOthers && (!manualCompany.name.trim() || !manualCompany.website.trim())) {
      return toast.error("Company Name and Website are required")
    }

    if (showOthers && !validateWebsiteUrl(manualCompany.website)) {
      return // Error is already shown by validateWebsiteUrl
    }

    const selectedCompanyData = companies.find((c) => c._id === selectedCompany)
    const payload: Review = {
      ...review,
      companyId: showOthers ? undefined : selectedCompanyData?._id,
      companyName: showOthers ? manualCompany.name : selectedCompanyData?.name,
      companyWebsite: showOthers ? manualCompany.website : selectedCompanyData?.website,
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData?.message || "Something went wrong")
      }

      toast.success("Review submitted successfully!")
      setReview({ workEnv: 3, jobSec: 3, salary: 3, rating: 3 })
      setSelectedCompany("")
      setShowOthers(false)
      setManualCompany({ name: "", website: "" })
      setSearchTerm("")
      setActiveTab("company")
    } catch (error: any) {
      toast.error(error.message || "Error submitting review")
    } finally {
      setSubmitting(false)
    }
  }

  const handleRatingChange = (field: keyof Review, value: number[]) => {
    setReview({ ...review, [field]: value[0] })
  }

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

  const getNextStep = () => {
    if (activeTab === "company") {
      if (!selectedCompany && !showOthers) {
        return toast.error("Please select a company")
      }
      if (showOthers && (!manualCompany.name.trim() || !manualCompany.website.trim())) {
        return toast.error("Company Name and Website are required")
      }
      if (showOthers && !validateWebsiteUrl(manualCompany.website)) {
        return // Error is already shown by validateWebsiteUrl
      }
      setActiveTab("ratings")
    } else if (activeTab === "ratings") {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }
  }

  const getPrevStep = () => {
    if (activeTab === "ratings") {
      setActiveTab("company")
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">

      {/* Hero Section with Wavy Curve */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6  text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Share Your Experience</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center">
            Help others make informed career decisions with your honest feedback
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

      {/* Form Section */}
      <div className="max-w-xl mx-auto px-4 py-12 -mt-6 relative z-10">
        <Card className="shadow-xl border border-gray-200 rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-6">
            <CardTitle className="text-2xl font-bold text-center">Company Review</CardTitle>
            <CardDescription className="text-teal-50 text-center mt-2">
              Your feedback helps build a better workplace for everyone
            </CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="company"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white py-2.5"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Company
                </TabsTrigger>
                <TabsTrigger
                  value="ratings"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white py-2.5"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Ratings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="company" className="space-y-6 p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for a company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 bg-gray-50 border-gray-200 text-base"
                />
                {searchTerm.length > 0 && searchTerm.length < 3 && (
                  <p className="text-sm text-gray-500 mt-1 ml-1">Type at least 3 characters to search</p>
                )}
              </div>

              {loading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                </div>
              )}

              {searchTerm.length >= 3 && companies.length > 0 && !loading && (
                <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2 px-2">Select a company or choose "Others" to add manually</p>
                  {companies.map((company) => (
                    <div
                      key={company._id}
                      className={`p-3 rounded-md cursor-pointer flex items-center gap-2 mb-1.5 hover:bg-teal-50 transition-colors ${
                        selectedCompany === company._id ? "bg-teal-100 border border-teal-200" : ""
                      }`}
                      onClick={() => {
                        setSelectedCompany(company._id)
                        setShowOthers(company._id === "others")
                      }}
                    >
                      <Building2
                        className={`h-5 w-5 ${company._id === "others" ? "text-blue-500" : "text-teal-500"}`}
                      />
                      <span className="font-medium">{company.name}</span>
                      {selectedCompany === company._id && (
                        <Badge variant="outline" className="ml-auto bg-teal-500 text-white border-none">
                          Selected
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {showOthers && (
                <div className="space-y-5 bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-sm font-medium flex items-center">
                      <Building2 className="h-4 w-4 inline mr-2 text-teal-500" />
                      Company Name
                    </Label>
                    <Input
                      id="company-name"
                      type="text"
                      placeholder="Enter company name"
                      value={manualCompany.name}
                      onChange={(e) => setManualCompany({ ...manualCompany, name: e.target.value })}
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-website" className="text-sm font-medium flex items-center">
                      <Globe className="h-4 w-4 inline mr-2 text-teal-500" />
                      Company Website
                    </Label>
                    <Input
                      id="company-website"
                      type="text"
                      placeholder="https://example.com"
                      value={manualCompany.website}
                      onChange={handleWebsiteChange}
                      className={`bg-white border-gray-200 ${websiteError ? "border-red-300 focus:ring-red-500" : ""}`}
                    />
                    {websiteError && (
                      <div className="flex items-start mt-1.5 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>{websiteError}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Example: https://example.com</p>
                  </div>
                </div>
              )}

              {!loading && searchTerm.length >= 3 && companies.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No companies found. Please select "Others" to add manually.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ratings" className="space-y-6 p-6">
              <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-teal-800 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-teal-600" />
                  {showOthers ? manualCompany.name : companies.find((c) => c._id === selectedCompany)?.name}
                </h3>
                {showOthers && (
                  <p className="text-sm text-teal-600 mt-1 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    {manualCompany.website}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-teal-500" />
                      Work Environment
                    </Label>
                    <span className="text-sm font-medium text-teal-600">
                      {getRatingLabel(review.workEnv, "workEnv")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[review.workEnv]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleRatingChange("workEnv", value)}
                      className="flex-1"
                    />
                    <div className="flex">{renderStars(review.workEnv)}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-blue-500" />
                      Job Security
                    </Label>
                    <span className="text-sm font-medium text-blue-600">{getRatingLabel(review.jobSec, "jobSec")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[review.jobSec]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleRatingChange("jobSec", value)}
                      className="flex-1"
                    />
                    <div className="flex">{renderStars(review.jobSec)}</div>
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
                      {getRatingLabel(review.salary, "salary")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[review.salary]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleRatingChange("salary", value)}
                      className="flex-1"
                    />
                    <div className="flex">{renderStars(review.salary)}</div>
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
                      {getRatingLabel(review.rating, "rating")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[review.rating]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleRatingChange("rating", value)}
                      className="flex-1"
                    />
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <CardFooter className="flex justify-between p-6 bg-gray-50 border-t">
            {activeTab === "ratings" && (
              <Button
                variant="outline"
                onClick={getPrevStep}
                className="px-6 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              >
                Back
              </Button>
            )}

            <Button
              className={`${activeTab === "company" ? "ml-auto" : ""} bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 px-6`}
              onClick={getNextStep}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : activeTab === "company" ? (
                "Next"
              ) : (
                "Submit Review"
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your review helps others make informed decisions about their careers.</p>
          <p>All reviews are anonymous and will be moderated before publishing.</p>
        </div>
      </div>
    </div>
  )
}

