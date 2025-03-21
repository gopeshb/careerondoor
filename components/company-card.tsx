import { Card, CardContent } from "@/components/ui/card"
import { Building, Shield, Banknote, ExternalLink } from "lucide-react"
import Image from "next/image"

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

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  // Function to get rating color based on score
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 3.5) return "text-blue-600"
    if (rating >= 2.5) return "text-yellow-600"
    return "text-red-600"
  }

  // Function to render rating stars
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < fullStars ? "text-yellow-400" : i === fullStars && hasHalfStar ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-teal-500/20 group h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-center items-center h-24 relative">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-teal-500"
              title="Visit website"
            >
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="bg-white rounded-full p-3 shadow-md h-16 w-16 flex items-center justify-center">
            <Image
              src={`https://logo.clearbit.com/${company.website?.replace("https://", "").replace("www.", "")}`}
              alt={company.name}
              width={40}
              height={40}
              className="object-contain"
              unoptimized
              onError={(e) => {
                // Fallback for when logo doesn't load
                ;(e.target as HTMLImageElement).src = `/placeholder.svg?height=40&width=40`
              }}
            />
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 text-center mb-2 line-clamp-1">{company.name}</h3>
          <div className="flex justify-center mb-4">{renderRatingStars(company.avgRating)}</div>
          <p className="text-sm text-gray-500 text-center mb-4">
            {company.TotalReviews} {company.TotalReviews === 1 ? "Review" : "Reviews"}
          </p>

          <div className="space-y-3 text-sm flex-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1">
                <Building size={16} className="text-purple-500" /> Work Environment
              </span>
              <span className={getRatingColor(company.workEnv)}>{company.workEnv.toFixed(1)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1">
                <Shield size={16} className="text-blue-500" /> Job Security
              </span>
              <span className={getRatingColor(company.jobSec)}>{company.jobSec.toFixed(1)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1">
                <Banknote size={16} className="text-green-500" /> Salary
              </span>
              <span className={getRatingColor(company.salary)}>{company.salary.toFixed(1)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-teal-500 hover:text-teal-600 font-medium text-sm transition-colors"
            >
              Visit Website
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

