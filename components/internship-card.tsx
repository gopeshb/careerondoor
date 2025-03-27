"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Star, StarHalf, Clock, MapPin } from "lucide-react"

interface Company {
  _id: string
  name: string
  workEnv: number
  jobSec: number
  salary: number
  avgRating: number
  TotalReviews: number
}

interface InternshipProps {
  internship: {
    _id: string
    role: string
    description: string
    location: string
    skills_required: string[]
    companyId: Company
    stipend: string
    duration: number
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

// Format duration text
const formatDuration = (months: number) => {
  return `${months} ${months === 1 ? "Month" : "Months"}`
}

export default function InternshipCard({ internship }: InternshipProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{internship.role}</h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span className="font-medium">{internship.companyId.name}</span>
                </div>
                <span className="text-gray-400">•</span>
                {renderStarRating(internship.companyId.avgRating)}
              </div>
            </div>
            <div className="mt-2 sm:mt-0 flex flex-col sm:items-end gap-2">
              <Badge className="bg-purple-100 text-purple-800 md:text-sm hover:bg-purple-100">
                Stipend: {internship.stipend}
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-800 md:text-sm hover:bg-indigo-100">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {formatDuration(internship.duration)}
              </Badge>
            </div>
          </div>

          <p className="text-gray-700 mt-4 line-clamp-2">
            {internship.description.length > 100
              ? `${internship.description.substring(0, 100)}...`
              : internship.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {internship.skills_required.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{internship.location}</span>
            </div>
            
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-wrap sm:flex-row gap-1 md:gap-3 text-sm">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Environment: {internship.companyId.workEnv}/5
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Salary: {internship.companyId.salary}/5
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Job Security: {internship.companyId.jobSec}/5
              </Badge>
            </div>

            <Link href={internship.applylink} target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

