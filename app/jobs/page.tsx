"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Briefcase } from "lucide-react"
import JobCard from "@/components/job-card"

// Define interfaces based on the actual API response
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
}

interface SearchParams {
  keyword: string
  experience: string
  country: string
  city: string
  remote: string
  page: number
}

export default function Jobs() {
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for search and filters
  const [searchParams_, setSearchParams] = useState<SearchParams>({
    keyword: searchParams?.get("keyword") || "",
    experience: searchParams?.get("experience") || "",
    country: searchParams?.get("country") || "",
    city: searchParams?.get("city") || "",
    remote: searchParams?.get("remote") || "",
    page: Number(searchParams?.get("page")) || 1,
  })

  // State for jobs data
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // State for location data
  const [countries, setCountries] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true)

  // Experience options
  const experienceOptions = [
    { value: "fresher", label: "Fresher (0 years)" },
    { value: "0-2", label: "0-2 Years" },
    { value: "2-5", label: "2-5 Years" },
    { value: "5+", label: "5+ Years" },
  ]

  // Fetch locations for filters
  const fetchLocations = useCallback(async () => {
    setLoadingLocations(true)
    try {
      const response = await fetch(`${BASE_API_URL}/api/jobs/locations`)
      if (!response.ok) {
        throw new Error("Failed to fetch locations")
      }
      const data = await response.json()
      setCountries(data.countries)
      setCities(data.cities)
    } catch (err) {
      console.error("Error fetching locations:", err)
    } finally {
      setLoadingLocations(false)
    }
  }, [BASE_API_URL])

  // Fetch jobs based on search params
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()

      if (searchParams_.keyword) {
        queryParams.append("keyword", searchParams_.keyword)
      }

      if (searchParams_.experience && searchParams_.experience !== "all") {
        queryParams.append("experience", searchParams_.experience)
      }

      if (searchParams_.country && searchParams_.country !== "all") {
        queryParams.append("country", searchParams_.country)
      }

      if (searchParams_.city && searchParams_.city !== "all") {
        queryParams.append("city", searchParams_.city)
      }

      if (searchParams_.remote === "true") {
        queryParams.append("remote", "true")
      }

      queryParams.append("page", searchParams_.page.toString())
      queryParams.append("limit", "10") // 10 jobs per page

      const response = await fetch(`${BASE_API_URL}/api/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`)

      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }

      const data = await response.json()
      setJobs(data.jobs)
      setTotalJobs(data.totalJobs)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError((err as Error).message)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [BASE_API_URL, searchParams_])

  // Update URL with search params
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()

    if (searchParams_.keyword) {
      params.append("keyword", searchParams_.keyword)
    }

    if (searchParams_.experience) {
      params.append("experience", searchParams_.experience)
    }

    if (searchParams_.country) {
      params.append("country", searchParams_.country)
    }

    if (searchParams_.city) {
      params.append("city", searchParams_.city)
    }

    if (searchParams_.remote === "true") {
      params.append("remote", "true")
    }

    if (searchParams_.page > 1) {
      params.append("page", searchParams_.page.toString())
    }

    const newUrl = `/jobs${params.toString() ? `?${params.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [router, searchParams_])

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams((prev) => ({ ...prev, page: 1 })) // Reset to page 1 on new search
  }

  // Handle experience filter change
  const handleExperienceChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, experience: value, page: 1 }))
  }

  // Handle country filter change
  const handleCountryChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, country: value, city: "", page: 1 }))
  }

  // Handle city filter change
  const handleCityChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, city: value, page: 1 }))
  }

  // Handle remote filter change
  const handleRemoteChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, remote: value, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({
      keyword: "",
      experience: "",
      country: "",
      city: "",
      remote: "",
      page: 1,
    })
  }

  // Update URL when search params change
  useEffect(() => {
    updateUrl()
  }, [searchParams_, updateUrl])

  // Fetch jobs when URL params change
  useEffect(() => {
    fetchJobs()
  }, [searchParams_, fetchJobs])

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6  text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Find Your Dream Job</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center mb-8">
            Discover top job opportunities from leading companies and take the next step in your career.
          </p>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative">
            <div className="flex flex-col md:flex-row gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
              <Input
                type="text"
                placeholder="Search by role, skills, or company..."
                value={searchParams_.keyword}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, keyword: e.target.value }))}
                className="w-full bg-white/90 border-0 placeholder:text-gray-500 text-gray-900 rounded-md"
              />

              <Select value={searchParams_.experience} onValueChange={handleExperienceChange}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/90 border-0 text-gray-900">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent className="bg-white/90">
                  <SelectItem value="all">All Experience</SelectItem>
                  {experienceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="submit"
                className="bg-white font-semibold p-3 text-teal-600 hover:bg-white/90 flex items-center gap-2 px-4"
              >
                <Search size={18} /> Search
              </Button>
            </div>
          </form>
            <div className="mt-8 text-center my-1 py-1">
            <p className="mb-4 text-lg font-medium text-white/80">
              Have an opportunity to share?
            </p>
            <Button
              className="bg-white text-teal-600 font-semibold hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 px-8 py-3 rounded-full shadow-md"
              onClick={() => router.push("/jobs/create-job")}
            >
              Submit a Job
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

      {/* Jobs Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
            {!loading && (
              <p className="text-gray-600 mt-1">
                {totalJobs} {totalJobs === 1 ? "job" : "jobs"} found
                {searchParams_.keyword && ` matching "${searchParams_.keyword}"`}
              </p>
            )}
          </div>

          {/* Additional filters */}
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            <Select value={searchParams_.country} onValueChange={handleCountryChange} disabled={loadingLocations}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={searchParams_.city}
              onValueChange={handleCityChange}
              disabled={loadingLocations || !searchParams_.country}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities
                  .filter(
                    (city) =>
                      !searchParams_.country ||
                      jobs.some((job) => job.country === searchParams_.country && job.cities.includes(city)),
                  )
                  .map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={searchParams_.remote} onValueChange={handleRemoteChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Work Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="true">Remote Only</SelectItem>
              </SelectContent>
            </Select>

            {(searchParams_.keyword ||
              searchParams_.experience ||
              searchParams_.country ||
              searchParams_.city ||
              searchParams_.remote) && (
              <Button variant="ghost" onClick={clearFilters} className="text-gray-500">
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">Error: {error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 text-lg mt-4">No jobs found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
            <Button className="mt-4 bg-teal-500 hover:bg-teal-600" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, searchParams_.page - 1))}
                    className={searchParams_.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber: number

                  // Logic to show relevant page numbers
                  if (totalPages <= 5) {
                    pageNumber = i + 1
                  } else if (searchParams_.page <= 3) {
                    pageNumber = i + 1
                  } else if (searchParams_.page >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i
                  } else {
                    pageNumber = searchParams_.page - 2 + i
                  }

                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={pageNumber === searchParams_.page}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {totalPages > 5 && searchParams_.page < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, searchParams_.page + 1))}
                    className={searchParams_.page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

