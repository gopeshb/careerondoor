"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Star, StarHalf, MapPin, Briefcase, Calendar } from "lucide-react"

interface Company {
  _id: string
  name: string
  workEnv: number
  jobSec: number
  salary: number
  avgRating: number
  TotalReviews: number
}

interface JobProps {
  job: {
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
  }
}

// Render star rating with support for half stars
const renderStarRating = (rating: number) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        // For full stars
        if (i < Math.floor(rating)) {
          return <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
        }
        // For half stars
        else if (i < Math.floor(rating + 0.5)) {
          return <StarHalf key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
        }
        // For empty stars
        else {
          return <Star key={i} className="h-3.5 w-3.5 text-gray-300" />
        }
      })}
      <span className="ml-1 text-xs text-gray-600">({rating.toFixed(1)})</span>
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

export default function JobCard({ job }: JobProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <Link href={`/jobs/${job._id}`} className="hover:underline">
                <h3 className="text-xl font-semibold text-gray-900">{job.role}</h3>
              </Link>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span className="font-medium">{job.company.name}</span>
                </div>
                <span className="text-gray-400">•</span>
                {renderStarRating(job.company.avgRating)}
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <Badge className="bg-teal-100 text-teal-800 md:text-sm hover:bg-teal-100">
                {formatSalary(job.min_salary, job.max_salary, job.currency)}
              </Badge>
            </div>
          </div>

          <p className="text-gray-700 mt-4 line-clamp-2">
            {job.description?.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {job.skills_required.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100">
                {skill}
              </Badge>
            ))}
            {job.skills_required.length > 4 && (
              <Badge variant="outline" className="bg-gray-100">
                +{job.skills_required.length - 4} more
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{formatLocation(job.country, job.cities, job.remote)}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>{formatExperience(job.min_experience, job.max_experience)}</span>
            </div>
            
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-wrap sm:flex-row gap-1 md:gap-3 text-sm">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Environment: {job.company.workEnv}/5
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Salary: {job.company.salary}/5
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Job Security: {job.company.jobSec}/5
              </Badge>
            </div>

            <div className="flex gap-2">
              <Link href={`/jobs/${job._id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
              <Link href={job.applylink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

