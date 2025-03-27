"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InternshipCard from "@/components/internship-card"

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

interface Internship {
  _id: string
  role: string
  description: string
  location: string
  skills_required: string[]
  companyId: Company
  stipend: string
  duration: number // Duration in months
  applylink: string
  last_date?: string
}

interface SearchParams {
  keyword: string
  duration: string
  page: number
}

export default function Internships() {
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for search and filters
  const [searchParams_, setSearchParams] = useState<SearchParams>({
    keyword: searchParams?.get("keyword") || "",
    duration: searchParams?.get("duration") || "",
    page: Number(searchParams?.get("page")) || 1,
  })

  // State for internships data
  const [internships, setInternships] = useState<Internship[]>([])
  const [totalInternships, setTotalInternships] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Duration options for filter
  const durationOptions = [
    { value: "all", label: "All Durations" },
    { value: "1", label: "1 Month" },
    { value: "2", label: "2 Months" },
    { value: "3", label: "3 Months" },
    { value: "4", label: "4 Months" },
    { value: "5", label: "5 Months" },
    { value: "6", label: "6 Months" },
  ]

  // Fetch internships based on search params
  const fetchInternships = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()

      if (searchParams_.keyword) {
        queryParams.append("keyword", searchParams_.keyword)
      }

      if (searchParams_.duration) {
        queryParams.append("duration", searchParams_.duration)
      }

      queryParams.append("page", searchParams_.page.toString())
      queryParams.append("limit", "10") // 10 internships per page

      const response = await fetch(`${BASE_API_URL}/api/internships?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch internships")
      }

      const data = await response.json()
      setInternships(data.internships)
      setTotalInternships(data.totalInternships)
      setTotalPages(Math.ceil(data.totalInternships / 10))
    } catch (err) {
      setError((err as Error).message)
      setInternships([])
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

    if (searchParams_.duration) {
      params.append("duration", searchParams_.duration)
    }

    if (searchParams_.page > 1) {
      params.append("page", searchParams_.page.toString())
    }

    const newUrl = `/internships${params.toString() ? `?${params.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [router, searchParams_])

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams((prev) => ({ ...prev, page: 1 })) // Reset to page 1 on new search
  }

  // Handle duration filter change
  const handleDurationChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, duration: value, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }))
  }

  // Update URL when search params change
  useEffect(() => {
    updateUrl()
  }, [searchParams_, updateUrl])

  // Fetch internships when URL params change
  useEffect(() => {
    fetchInternships()
  }, [searchParams_, fetchInternships])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Find Your Dream Internship</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center mb-8">
            Discover top internship opportunities from leading companies and kickstart your career.
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <div className="flex flex-col md:flex-row gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
              <Input
                type="text"
                placeholder="Search by role, skills, or company..."
                value={searchParams_.keyword}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, keyword: e.target.value }))}
                className="w-full bg-white/90 border-0 placeholder:text-gray-500 text-gray-900 rounded-md"
              />

              <Select value={searchParams_.duration} onValueChange={handleDurationChange}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/90 border-0 text-gray-900">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent className="bg-white/90">
                  {durationOptions.map((option) => (
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

      {/* Internships Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Internships</h2>
            {!loading && (
              <p className="text-gray-600 mt-1">
                {totalInternships} {totalInternships === 1 ? "internship" : "internships"} found
                {searchParams_.keyword && ` matching "${searchParams_.keyword}"`}
                {searchParams_.duration &&
                  ` for ${durationOptions.find((o) => o.value === searchParams_.duration)?.label.toLowerCase()}`}
              </p>
            )}
          </div>
        </div>

        {/* Internships List */}
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
        ) : internships.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 text-lg mt-4">No internships found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
            <Button
              className="mt-4 bg-purple-500 hover:bg-purple-600"
              onClick={() => setSearchParams({ keyword: "", duration: "", page: 1 })}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {internships.map((internship) => (
              <InternshipCard key={internship._id} internship={internship} />
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

