"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Briefcase, MapPin, Building2, Star } from 'lucide-react'
import Link from "next/link"

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
  experience: number
  description: string
  location: string
  skills_required: string[]
  companyId: Company
  expected_salary: string
  applylink: string
  last_date?: string
}

interface SearchParams {
  keyword: string
  experience: string
  page: number
}

const BASE_API_URL = "http://localhost:5000/api/jobs"

export default function Jobs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for search and filters
  const [searchParams_, setSearchParams] = useState<SearchParams>({
    keyword: searchParams?.get("keyword") || "",
    experience: searchParams?.get("experience") || "",
    page: Number(searchParams?.get("page")) || 1
  })
  
  // State for jobs data
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Experience options
  const experienceOptions = [
    { value: "fresher", label: "Fresher" },
    { value: "0-2", label: "0-2 Years" },
    { value: "2+", label: "2+ Years" }
  ]

  // Fetch jobs based on search params
  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      
      if (searchParams_.keyword) {
        queryParams.append("keyword", searchParams_.keyword)
      }
      
      if (searchParams_.experience) {
        queryParams.append("experience", searchParams_.experience)
      }
      
      queryParams.append("page", searchParams_.page.toString())
      queryParams.append("limit", "10") // 10 jobs per page
      
      const response = await fetch(`${BASE_API_URL}?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }
      
      const data = await response.json()
      setJobs(data.jobs)
      setTotalJobs(data.totalJobs)
      setTotalPages(Math.ceil(data.totalJobs / 10))
    } catch (err) {
      setError((err as Error).message)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  // Update URL with search params
  const updateUrl = () => {
    const params = new URLSearchParams()
    
    if (searchParams_.keyword) {
      params.append("keyword", searchParams_.keyword)
    }
    
    if (searchParams_.experience) {
      params.append("experience", searchParams_.experience)
    }
    
    if (searchParams_.page > 1) {
      params.append("page", searchParams_.page.toString())
    }
    
    const newUrl = `/jobs${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl, { scroll: false })
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(prev => ({ ...prev, page: 1 })) // Reset to page 1 on new search
  }

  // Handle experience filter change
  const handleExperienceChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, experience: value, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }))
  }


  // Update URL when search params change
  useEffect(() => {
    updateUrl()
  }, [searchParams_])

  // Fetch jobs when URL params change
  useEffect(() => {
    fetchJobs()
  }, [searchParams_])

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Find Your Dream Job</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center mb-8">
            Discover top job opportunities from leading companies and take the next step in your career.
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <div className="flex flex-col md:flex-row gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
              <Input
                type="text"
                placeholder="Search by role, skills, or company..."
                value={searchParams_.keyword}
                onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
                className="w-full bg-white/90 border-0 placeholder:text-gray-500 text-gray-900 rounded-md"
              />
              
              <Select 
                value={searchParams_.experience} 
                onValueChange={handleExperienceChange}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-white/90 border-0 text-gray-900">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent className="bg-gray-50">
                  <SelectItem value="all">All Experience</SelectItem>
                  {experienceOptions.map(option => (
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

      {/* Jobs Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
            {!loading && (
              <p className="text-gray-600 mt-1">
                {totalJobs} {totalJobs === 1 ? 'job' : 'jobs'} found
                {searchParams_.keyword && ` matching "${searchParams_.keyword}"`}
                {searchParams_.experience && ` for ${experienceOptions.find(o => o.value === searchParams_.experience)?.label}`}
              </p>
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error: {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 text-lg mt-4">No jobs found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
            <Button 
              className="mt-4 bg-teal-500 hover:bg-teal-600"
              onClick={() => setSearchParams({ keyword: "", experience: "", page: 1 })}
            >
              Clear filters
            </Button>
          </div>
        ) : (
            <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
              <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                <h3 className="text-xl font-semibold text-gray-900">{job.role}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                <span className="font-medium">{job.companyId.name}</span>
                </div>
                <span className="text-gray-400">•</span>
                {renderStarRating(job.companyId.avgRating)}
                </div>
                </div>
                <div className="mt-2 sm:mt-0">
                <Badge className="bg-teal-100 text-teal-800 md:text-sm hover:bg-teal-100">
                Expected Salary: {job.expected_salary}
                </Badge>
                </div>
              </div>
              
              <p className="text-gray-700 mt-4 line-clamp-2">
                {job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {job.skills_required.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100">
                {skill}
                </Badge>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>
                {job.experience === 0 
                ? "Fresher" 
                : job.experience === 1 
                  ? "1 Year" 
                  : `${job.experience} Years`}
                </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex sm:flex-row gap-3 text-sm">
                <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Environment: {job.companyId.workEnv}/5
                </Badge>
                </div>
                <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Salary: {job.companyId.salary}/5
                </Badge>
                </div>
                <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Job Security: {job.companyId.jobSec}/5
                </Badge>
                </div>
                </div>
                
                <Link href={job.applylink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                Apply Now
                </Button>
                </Link>
              </div>
              </div>
              </CardContent>
              </Card>
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
