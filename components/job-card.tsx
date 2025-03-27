"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Star, StarHalf, MapPin, Briefcase } from "lucide-react"

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
    experience: number
    description: string
    location: string
    skills_required: string[]
    companyId: Company
    expected_salary: string
    applylink: string
    last_date?: string
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
const formatExperience = (experience: number) => {
  return experience === 0 ? "Fresher" : experience === 1 ? "1 Year" : `${experience} Years`
}

export default function JobCard({ job }: JobProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
              <Badge className="bg-teal-100 text-teal-800 md:text-sm hover:bg-teal-100">{job.expected_salary}</Badge>
            </div>
          </div>

          <p className="text-gray-700 mt-4 line-clamp-2">
            {job.description?.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
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
              <span>{formatExperience(job.experience)}</span>
            </div>
            {job.last_date && (
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>Apply by: {new Date(job.last_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-wrap sm:flex-row gap-1 md:gap-3 text-sm">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Environment: {job.companyId.workEnv}/5
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Salary: {job.companyId.salary}/5
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Job Security: {job.companyId.jobSec}/5
              </Badge>
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
  )
}

