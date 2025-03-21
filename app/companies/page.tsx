"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star, Building, Shield, Banknote } from "lucide-react"
import { CompanyCard } from "@/components/company-card"
import { CompanySkeleton } from "@/components/company-skeleton"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Define interfaces
interface Company {
  _id: string
  name: string
  website: string
  avgRating: number
  TotalReviews: number
  workEnv: number
  jobSec: number
  salary: number
}

interface CompanyCategory {
  id: string
  title: string
  endpoint: string
  icon: React.ReactNode
  description: string
}

const BASE_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/companies`

export default function Companies() {
  const [search, setSearch] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("rating")
  const [searchResults, setSearchResults] = useState<Company[]>([])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [companiesData, setCompaniesData] = useState<Record<string, Company[]>>({
    rating: [],
    salary: [],
    "job-security": [],
    "work-environment": [],
  })
  const [loading, setLoading] = useState<Record<string, boolean>>({
    rating: true,
    salary: true,
    "job-security": true,
    "work-environment": true,
  })
  const [error, setError] = useState<Record<string, string | null>>({
    rating: null,
    salary: null,
    "job-security": null,
    "work-environment": null,
  })
  const router = useRouter()

  const categories: CompanyCategory[] = [
    {
      id: "rating",
      title: "Top Rated",
      endpoint: "/top/rating",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      description: "Companies with the highest overall ratings",
    },
    {
      id: "salary",
      title: "Best Salary",
      endpoint: "/top/salary",
      icon: <Banknote className="h-5 w-5 text-green-500" />,
      description: "Companies offering the most competitive compensation",
    },
    {
      id: "job-security",
      title: "Job Security",
      endpoint: "/top/job-security",
      icon: <Shield className="h-5 w-5 text-blue-500" />,
      description: "Companies with the highest job security ratings",
    },
    {
      id: "work-environment",
      title: "Work Environment",
      endpoint: "/top/work-environment",
      icon: <Building className="h-5 w-5 text-purple-500" />,
      description: "Companies with the best workplace culture",
    },
  ]

  const fetchCompanies = async (category: string) => {
    setLoading((prev) => ({ ...prev, [category]: true }))
    try {
      const response = await fetch(`${BASE_API_URL}${categories.find((c) => c.id === category)?.endpoint}`)
      if (!response.ok) throw new Error(`Failed to fetch ${category} companies`)
      const data: Company[] = await response.json()
      setCompaniesData((prev) => ({ ...prev, [category]: data }))
      setError((prev) => ({ ...prev, [category]: null }))
    } catch (err) {
      setError((prev) => ({ ...prev, [category]: (err as Error).message }))
    } finally {
      setLoading((prev) => ({ ...prev, [category]: false }))
    }
  }

  // Search companies function
  const searchCompanies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    setSearchError(null)

    try {
      const response = await fetch(`${BASE_API_URL}?search=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search companies")
      const data: Company[] = await response.json()
      setSearchResults(data)
    } catch (err) {
      setSearchError((err as Error).message)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length >= 2) {
        searchCompanies(search)
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    // Fetch data for all categories on initial load
    categories.forEach((category) => {
      fetchCompanies(category.id)
    })
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // If we haven't loaded this category yet, fetch it
    if (companiesData[value].length === 0 && !loading[value]) {
      fetchCompanies(value)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim().length >= 2) {
      searchCompanies(search)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Find Your Ideal Company</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-center mb-8">
            Discover top-rated companies based on real employee reviews and find the perfect workplace for your career.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
              <Input
                type="text"
                placeholder="Search companies by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/90 border-0 placeholder:text-gray-500 text-gray-900 rounded-md"
              />
              <Button
                type="submit"
                className="bg-white font-semibold p-3 text-teal-600 hover:bg-white/90 flex items-center gap-2 px-4"
              >
                <Search size={18} /> Search
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="mb-3 text-white/90">Want to share your experience?</p>
            <Button
              className="bg-white text-teal-600 font-semibold hover:bg-white/90 px-6 py-3"
              onClick={() => router.push("/companies/post-review")}
            >
              Post a Company Review
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

      {/* Search Results Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {search.trim().length >= 2 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>

            {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <CompanySkeleton key={index} />
                ))}
              </div>
            ) : searchError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                Error: {searchError}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-lg">No companies found matching "{search}"</p>
                <p className="text-gray-400 mt-2">Try a different search term or browse our top companies below</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((company) => (
                  <CompanyCard key={company._id} company={company} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Top Companies Section */}
        <Tabs defaultValue="rating" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Top Companies</h2>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent mb-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
                >
                  {category.icon}
                  <span className="inline">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8 md:mt-4">
              <div className="mb-6">
                <h3 className="text-sx md:text-xl m-2 font-semibold text-gray-800 flex items-center gap-2">
                  {category.icon}
                  {category.title} Companies
                </h3>
                <p className="text-gray-600 text-sx md:text-lg">{category.description}</p>
              </div>

              {loading[category.id] ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <CompanySkeleton key={index} />
                  ))}
                </div>
              ) : error[category.id] ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  Error: {error[category.id]}
                </div>
              ) : companiesData[category.id].length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No companies found in this category.</p>
                </div>
              ) : (
                <div className="w-full">
                {/* Mobile: Swiper Carousel (1 card at a time) */}
                <div className="block sm:hidden">
                  <Swiper
                    modules={[Pagination]}
                    spaceBetween={10}
                    slidesPerView={1} // Only 1 card visible at a time
                    pagination={{ clickable: true }} // Shows dots below the slider
                    loop
                    className="w-full"
                  >
                    {companiesData[category.id].map((company) => (
                      <SwiperSlide key={company._id} className="flex justify-center">
                        <CompanyCard company={company} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
          
                {/* Desktop: Grid Layout */}
                <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {companiesData[category.id].map((company) => (
                    <CompanyCard key={company._id} company={company} />
                  ))}
                </div>
              </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

