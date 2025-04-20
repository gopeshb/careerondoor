"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Briefcase,
  CheckCircle,
  Trash2,
  AlertCircle,
  Search,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface Company {
  _id: string
  name: string
}

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  username: string
}

interface Internship {
  _id: string
  role: string
  description: string
  country: string
  cities: string[]
  remote: boolean
  skills_required: string[]
  company: Company
  user: User
  min_stipend?: number
  max_stipend?: number
  currency: string
  duration: string
  applylink: string
  last_date?: string
  createdAt: string
  updatedAt: string
  verified: boolean
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format stipend with currency
const formatStipend = (min?: number, max?: number, currency = "INR") => {
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AUD: "A$",
  }

  const symbol = currencySymbols[currency] || currency

  if (!min && !max) return "Not disclosed"
  if (min && !max) return `${symbol}${min}/month`
  if (!min && max) return `Up to ${symbol}${max}/month`
  return `${symbol}${min} - ${symbol}${max}/month`
}

// Format location
const formatLocation = (country: string, cities: string[], remote: boolean) => {
  if (remote && (!cities || cities.length === 0)) return "Remote"
  if (remote && cities && cities.length > 0) return `${cities.join(", ")} or Remote`
  if (cities && cities.length > 0) return cities.join(", ")
  return country
}

export default function InternshipsVerifyPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [processingInternship, setProcessingInternship] = useState<string | null>(null)
  const [internshipToDelete, setInternshipToDelete] = useState<Internship | null>(null)
  const [internshipToView, setInternshipToView] = useState<Internship | null>(null)

  // Fetch internships that are not verified
  const fetchInternships = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/internships/verify`, {
        credentials: "include", // Include cookies for auth
      })

      if (!response.ok) throw new Error("Failed to fetch internships")

      const data = await response.json()
      setInternships(data.internships || [])
    } catch (error) {
      console.error("Error fetching internships:", error)
      toast.error("Failed to load internships")
    } finally {
      setLoading(false)
    }
  }, [BASE_URL])

  useEffect(() => {
    fetchInternships()
  }, [fetchInternships])

  // Verify internship
  const verifyInternship = useCallback(
    async (internshipId: string) => {
      setProcessingInternship(internshipId)
      try {
        const response = await fetch(`${BASE_URL}/api/internships/${internshipId}/verify`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) throw new Error("Failed to verify internship")

        toast.success("Internship verified successfully")
        // Remove the internship from the list
        setInternships((prev) => prev.filter((internship) => internship._id !== internshipId))
      } catch (error) {
        console.error("Error verifying internship:", error)
        toast.error("Failed to verify internship")
      } finally {
        setProcessingInternship(null)
      }
    },
    [BASE_URL],
  )

  // Delete internship
  const deleteInternship = useCallback(
    async (internshipId: string) => {
      setProcessingInternship(internshipId)
      try {
        const response = await fetch(`${BASE_URL}/api/internships/${internshipId}`, {
          method: "DELETE",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Failed to delete internship")

        toast.success("Internship deleted successfully")
        // Remove the internship from the list
        setInternships((prev) => prev.filter((internship) => internship._id !== internshipId))
        setInternshipToDelete(null)
      } catch (error) {
        console.error("Error deleting internship:", error)
        toast.error("Failed to delete internship")
      } finally {
        setProcessingInternship(null)
      }
    },
    [BASE_URL],
  )

  // Filter internships based on search query
  const filteredInternships = useMemo(() => {
    if (!searchQuery.trim()) return internships

    const query = searchQuery.toLowerCase()
    return internships.filter(
      (internship) =>
        internship.role.toLowerCase().includes(query) ||
        internship.company.name.toLowerCase().includes(query) ||
        internship.description.toLowerCase().includes(query) ||
        internship.country.toLowerCase().includes(query) ||
        (internship.cities && internship.cities.some((city) => city.toLowerCase().includes(query))) ||
        (internship.skills_required && internship.skills_required.some((skill) => skill.toLowerCase().includes(query))),
    )
  }, [internships, searchQuery])

  return (
    <div className="space-y-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { zIndex: 9999 },
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!internshipToDelete} onOpenChange={(open) => !open && setInternshipToDelete(null)}>
        <DialogContent className="bg-white rounded-xl shadow-xl max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Are you sure you want to delete this internship posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {internshipToDelete && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-800">{internshipToDelete.role}</p>
                <p className="text-sm text-gray-600 mt-1">Company: {internshipToDelete.company.name}</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-4"
              onClick={() => setInternshipToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4"
              onClick={() => internshipToDelete && deleteInternship(internshipToDelete._id)}
              disabled={processingInternship === internshipToDelete?._id}
            >
              {processingInternship === internshipToDelete?._id ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : null}
              Delete Internship
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Internship Details Dialog */}
      <Dialog open={!!internshipToView} onOpenChange={(open) => !open && setInternshipToView(null)}>
        <DialogContent className="bg-white rounded-xl shadow-xl max-w-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Internship Details</DialogTitle>
          </DialogHeader>
          {internshipToView && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{internshipToView.role}</h2>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Building2 className="h-5 w-5 mr-2 text-teal-600" />
                    <span className="text-gray-800">{internshipToView.company.name}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-300 px-3 py-1 rounded-full"
                >
                  Unverified
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-gray-800">
                      {formatLocation(internshipToView.country, internshipToView.cities, internshipToView.remote)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-gray-800">{internshipToView.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Stipend</p>
                    <p className="text-gray-800">
                      {formatStipend(
                        internshipToView.min_stipend,
                        internshipToView.max_stipend,
                        internshipToView.currency,
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Application Deadline</p>
                    <p className="text-gray-800">
                      {internshipToView.last_date ? formatDate(internshipToView.last_date) : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{internshipToView.description}</p>
              </div>

              {internshipToView.skills_required && internshipToView.skills_required.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {internshipToView.skills_required.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-teal-50 text-teal-700 border-teal-200 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Application Link</h3>
                <a
                  href={internshipToView.applylink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-800 hover:underline break-all"
                >
                  {internshipToView.applylink}
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Posted By</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                      {internshipToView.user.firstName.charAt(0)}
                      {internshipToView.user.lastName.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">
                        {internshipToView.user.firstName} {internshipToView.user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">@{internshipToView.user.username}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {internshipToView.user.email}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>Created: {formatDate(internshipToView.createdAt)}</p>
                <p>Last Updated: {formatDate(internshipToView.updatedAt)}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between mt-4">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-4"
              onClick={() => setInternshipToView(null)}
            >
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4"
                onClick={() => {
                  setInternshipToDelete(internshipToView)
                  setInternshipToView(null)
                }}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4"
                onClick={() => {
                  if (internshipToView) {
                    verifyInternship(internshipToView._id)
                    setInternshipToView(null)
                  }
                }}
                disabled={processingInternship === internshipToView?._id}
              >
                {processingInternship === internshipToView?._id ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                Verify
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-teal-50 to-teal-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <Briefcase className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Verify Internships</CardTitle>
              <CardDescription>Review and verify internship postings before they go live</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search internships by title, company, skills..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <AlertCircle className="mr-1 h-3.5 w-3.5" />
              {internships.length} Pending Verification
            </Badge>
          </div>

          {/* Internships table */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredInternships.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">No internships found</h3>
              <p className="text-gray-600 mt-2">
                {searchQuery ? "Try a different search term" : "All internships have been verified"}
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-auto">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Internship Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Posted By</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Posted On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInternships.map((internship) => (
                      <TableRow key={internship._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              className="p-0 h-auto font-medium text-left hover:text-teal-700"
                              onClick={() => setInternshipToView(internship)}
                            >
                              {internship.role}
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatStipend(internship.min_stipend, internship.max_stipend, internship.currency)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                              <Building2 className="h-4 w-4 text-gray-500" />
                            </div>
                            <span>{internship.company.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-semibold mr-2">
                              {internship.user.firstName.charAt(0)}
                              {internship.user.lastName.charAt(0)}
                            </div>
                            <div>
                              <span className="text-sm font-medium">
                                {internship.user.firstName} {internship.user.lastName}
                              </span>
                              <p className="text-xs text-gray-500">@{internship.user.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                            <span
                              className="truncate max-w-[150px]"
                              title={formatLocation(internship.country, internship.cities, internship.remote)}
                            >
                              {formatLocation(internship.country, internship.cities, internship.remote)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <span>{internship.duration}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(internship.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                              onClick={() => verifyInternship(internship._id)}
                              disabled={processingInternship === internship._id}
                            >
                              {processingInternship === internship._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Verify
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              onClick={() => setInternshipToDelete(internship)}
                              disabled={processingInternship === internship._id}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
