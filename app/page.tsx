"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Star,
  ChevronRight,
  Code,
  Bug,
  Users,
  CheckCircle,
  ArrowRight,
  Cloud,
  GraduationCap,
  Shield
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

// Company interface based on API response
interface Company {
  _id: string
  name: string
  website: string
  avgRating: number
  TotalReviews: number
  verified: boolean
}

// Highlights data
const highlights = [
  {
    id: "1",
    title: "🚀 Unlock Your Dream Job",
    description: "Our platform helps you discover the best job opportunities quickly and efficiently.",
    gradient: "from-yellow-400 to-orange-500",
    icon: "💼",
  },
  {
    id: "2",
    title: "🌟 Get Insider Insights",
    description: "Verified reviews reveal company culture, salaries, and real employee experiences.",
    gradient: "from-pink-500 to-red-500",
    icon: "🔍",
  },
  {
    id: "3",
    title: "⚡ Apply Instantly",
    description: "One-click applications make job hunting effortless and stress-free.",
    gradient: "from-green-400 to-teal-500",
    icon: "⚡",
  },
]

// Job categories for the showcase section
const jobCategories = [
  {
    name: "Software Development",
    icon: <Code className="h-6 w-6 text-teal-500" />,
    tags: ["Software Engineer", "Backend Developer", "Full Stack Developer"],
    link: "/jobs?category=software-development",
  },
  {
    name: "Quality Assurance",
    icon: <Bug className="h-6 w-6 text-red-500" />,
    tags: ["Software Tester", "QA Engineer", "Automation Tester"],
    link: "/jobs?category=quality-assurance",
  },
  {
    name: "Cloud & DevOps",
    icon: <Cloud className="h-6 w-6 text-blue-500" />,
    tags: ["DevOps Engineer", "Cloud Architect", "Site Reliability Engineer"],
    link: "/jobs?category=cloud-devops",
  },
]

// Internship categories
const internshipCategories = [
  {
    name: "Software Development",
    icon: <Code className="h-6 w-6 text-purple-500" />,
    tags: ["Web Development", "Mobile App Development", "Backend Development"],
    link: "/internships?category=software-development",
  },
  {
    name: "Data Science",
    icon: <GraduationCap className="h-6 w-6 text-green-500" />,
    tags: ["Data Analysis", "Machine Learning", "Data Visualization"],
    link: "/internships?category=data-science",
  },
  {
    name: "Cybersecurity",
    icon: <Shield className="h-6 w-6 text-red-500" />, // Use a security-related icon
    tags: ["Network Security", "Ethical Hacking", "Cryptography"],
    link: "/internships?category=cybersecurity",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [topCompanies, setTopCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Get BASE_URL from environment variables
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

  // Memoized fetch function to avoid recreating on each render
  const fetchTopCompanies = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/companies/top/rating`)
      if (!response.ok) throw new Error("Failed to fetch top companies")
      const data = await response.json()
      setTopCompanies(data)
    } catch (error) {
      console.error("Error fetching top companies:", error)
    } finally {
      setLoading(false)
    }
  }, [BASE_URL])

  // Fetch top companies from API
  useEffect(() => {
    fetchTopCompanies()
  }, [fetchTopCompanies])

  // Handle search form submission
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/jobs?keyword=${encodeURIComponent(searchQuery)}`)
      }
    },
    [searchQuery, router],
  )

  // Render star rating - memoized to avoid recreating on each render
  const renderStarRating = useCallback((rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1.5 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }, [])

  // Memoized Swiper settings for better performance
  const swiperSettings = useMemo(
    () => ({
      modules: [Pagination, Autoplay],
      spaceBetween: 10,
      slidesPerView: 1,
      pagination: { clickable: true },
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    }),
    [],
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-500 to-blue-600 pt-24 pb-32 px-6 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-white/20"></div>
          <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-white/20"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6">
              <Badge className="bg-white/20 text-white px-3 py-1 text-sm font-medium mb-2">
                Find Your Dream Career
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Top Companies & Exciting Opportunities
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-xl">
                Join thousands of professionals who use CareerOnDoor to find great jobs, internships, and companies with
                authentic employee reviews.
              </p>

              <form onSubmit={handleSearch} className="relative max-w-xl">
                <div className="flex gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                  <Input
                    type="text"
                    placeholder="Search jobs, internships, skills, or companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-white/80">Popular:</span>
                <Badge
                  className="bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                  onClick={() => router.push("/jobs?keyword=react")}
                >
                  React
                </Badge>
                <Badge
                  className="bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                  onClick={() => router.push("/jobs?keyword=node")}
                >
                  Node.js
                </Badge>
                <Badge
                  className="bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                  onClick={() => router.push("/internships?keyword=data")}
                >
                  Data Science
                </Badge>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-300 to-blue-300 rounded-lg blur opacity-50"></div>
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/real-estate-315ad.appspot.com/o/CareerOnDoor.webp?alt=media"
                  alt="Career illustration"
                  width={500}
                  height={400}
                  unoptimized={true}
                  onContextMenu={(e) => e.preventDefault()} // Disable right-click
                  onDragStart={(e) => e.preventDefault()} // Disable drag
                  style={{ pointerEvents: "none" }} // Disable interactions
                  className="relative rounded-lg shadow-2xl border border-white/20"
                />
              </div>
            </div>
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

      {/* Quick Links Section */}
      

      {/* Job Categories Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <Badge className="bg-teal-100 text-teal-700 mb-3">Explore Jobs</Badge>
          <h2 className="text-3xl font-bold text-gray-900">Find Jobs in Top Categories</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Browse thousands of job opportunities across various industries and skill levels
          </p>
        </div>

        <div className="w-full">
          {/* Mobile: Swiper Carousel (1 card at a time) */}
          <div className="block md:hidden">
            <Swiper {...swiperSettings} className="w-full">
              {jobCategories.map((category, index) => (
                <SwiperSlide key={index} className="flex justify-center">
                  <Card className="bg-white border-0 shadow-lg hover:shadow-xl mx-auto transition-shadow overflow-hidden group w-[90%]">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {category.icon}
                            <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                          </div>
                          
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {category.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-50">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-100">
                        <Link
                          href={category.link}
                          className="flex items-center justify-between text-teal-600 font-medium group-hover:text-teal-700 transition-colors"
                        >
                          <span>Browse {category.name} Jobs</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {jobCategories.map((category, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {category.icon}
                        <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                      </div>
                     
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-gray-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-100">
                    <Link
                      href={category.link}
                      className="flex items-center justify-between text-teal-600 font-medium group-hover:text-teal-700 transition-colors"
                    >
                      <span>Browse {category.name} Jobs</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-6 py-2 rounded-full">
            <Link href="/jobs">View All Job Categories</Link>
          </Button>
        </div>
      </div>

      {/* Internship Categories Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 mb-3">For Students & Graduates</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Explore Internship Opportunities</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Kickstart your career with internships from leading companies across various fields
            </p>
          </div>

          <div className="w-full">
            {/* Mobile: Swiper Carousel (1 card at a time) */}
            <div className="block md:hidden">
              <Swiper {...swiperSettings} className="w-full">
                {internshipCategories.map((category, index) => (
                  <SwiperSlide key={index} className="flex justify-center">
                    <Card className="bg-white border-0 shadow-lg hover:shadow-xl mx-auto transition-shadow overflow-hidden group w-[90%]">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {category.icon}
                              <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                            </div>
                            
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {category.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="bg-gray-50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-100">
                          <Link
                            href={category.link}
                            className="flex items-center justify-between text-purple-600 font-medium group-hover:text-purple-700 transition-colors"
                          >
                            <span>Browse {category.name} Internships</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
              {internshipCategories.map((category, index) => (
                <Card
                  key={index}
                  className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {category.icon}
                          <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                        </div>
                       
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {category.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-100">
                      <Link
                        href={category.link}
                        className="flex items-center justify-between text-purple-600 font-medium group-hover:text-purple-700 transition-colors"
                      >
                        <span>Browse {category.name} Internships</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-full">
              <Link href="/internships">View All Internship Categories</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Top Companies Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <Badge className="bg-teal-100 text-teal-700 mb-3">Top Rated</Badge>
              <h2 className="text-3xl font-bold text-gray-900">Highest Rated Companies</h2>
              <p className="text-gray-600 mt-2">Discover the best companies to work for based on employee reviews</p>
            </div>
            <Link
              href="/companies"
              className="mt-4 md:mt-0 text-teal-600 font-medium flex items-center hover:text-teal-700 transition-colors"
            >
              View all companies <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="bg-white border border-gray-100 shadow-md animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="ml-4 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="w-full">
              {/* Mobile: Swiper Carousel (1 card at a time) */}
              <div className="block sm:hidden">
                <Swiper {...swiperSettings} className="w-full">
                  {topCompanies.map((company) => (
                    <SwiperSlide key={company._id} className="flex justify-center">
                      <Link href={`/companies/${company._id}`}>
                        <Card className="bg-white border border-gray-200 mx-auto shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden w-full max-w-xs cursor-pointer">
                          <CardContent className="p-6">
                            {/* Company Logo / Initial */}
                            <div className="flex items-center mb-4">
                              <div className="relative">
                                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-600 overflow-hidden">
                                  {company.name.charAt(0).toUpperCase()}
                                </div>
                                {company.verified && (
                                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
                                  {company.name}
                                </h3>
                                <div className="flex items-center text-yellow-500">
                                  {renderStarRating(company.avgRating)}
                                </div>
                              </div>
                            </div>

                            {/* Reviews & Engagement */}
                            <div className="flex items-center justify-between text-gray-600 text-sm mt-4">
                              <div className="flex items-center">
                                <Users className="h-5 w-5 mr-1.5 text-gray-500" />
                                <span className="font-medium">
                                  {company.TotalReviews} {company.TotalReviews === 1 ? "Review" : "Reviews"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Desktop: Grid Layout */}
              <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topCompanies.map((company) => (
                  <Link key={company._id} href={`/companies/${company._id}`}>
                    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden w-full cursor-pointer">
                      <CardContent className="p-6">
                        {/* Company Logo / Initial */}
                        <div className="flex items-center mb-4">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-600 overflow-hidden">
                              {company.name.charAt(0).toUpperCase()}
                            </div>
                            {company.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
                              {company.name}
                            </h3>
                            <div className="flex items-center text-yellow-500">
                              {renderStarRating(company.avgRating)}
                            </div>
                          </div>
                        </div>

                        {/* Reviews & Engagement */}
                        <div className="flex items-center justify-between text-gray-600 text-sm mt-4">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 mr-1.5 text-gray-500" />
                            <span className="font-medium">
                              {company.TotalReviews} {company.TotalReviews === 1 ? "Review" : "Reviews"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 py-20 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-white/50 uppercase tracking-wider">Why CareerOnDoor?</p>
            <h2 className="text-4xl font-extrabold leading-tight">
              Your Career. Our Priority. <span className="text-yellow-300">No Limits.</span>
            </h2>
            <p className="text-white/80 mt-3 max-w-3xl mx-auto">
              Get access to powerful job tools, real company insights, and a seamless application process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl p-6 text-center shadow-lg bg-gradient-to-r ${item.gradient} transition-transform transform hover:scale-105`}
              >
                <span className="text-5xl">{item.icon}</span>
                <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
                <p className="text-white/90 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge className="bg-blue-100 text-blue-700 mb-3">Get Started Today</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Find Your Dream Opportunity?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
            Join thousands of professionals who have found their perfect career match on CareerOnDoor. Create your
            account today and start exploring jobs and internships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Link href="/signup" className="flex items-center">
                Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg rounded-xl"
            >
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

