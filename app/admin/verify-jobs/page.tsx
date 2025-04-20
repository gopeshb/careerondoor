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
  user: User
  min_salary?: number
  max_salary?: number
  currency: string
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

// Format salary with currency
const formatSalary = (min?: number, max?: number, currency = "INR") => {
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AUD: "A$",
  }

  const symbol = currencySymbols[currency] || currency

  if (!min && !max) return "Not disclosed"
  if (min && !max) return `${symbol}${min} LPA`
  if (!min && max) return `Up to ${symbol}${max} LPA`
  return `${symbol}${min} - ${symbol}${max} LPA`
}

// Format experience text
const formatExperience = (min: number, max?: number) => {
  if (min === 0 && !max) return "Fresher"
  if (min === 0 && max) return `Up to ${max} Years`
  if (min === max) return `${min} Years`
  if (min && max) return `${min}-${max} Years`
  return `${min}+ Years`
}

// Format location
const formatLocation = (country: string, cities: string[], remote: boolean) => {
  if (remote && (!cities || cities.length === 0)) return "Remote"
  if (remote && cities && cities.length > 0) return `${cities.join(", ")} or Remote`
  if (cities && cities.length > 0) return cities.join(", ")
  return country
}

export default function JobsVerifyPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [processingJob, setProcessingJob] = useState<string | null>(null)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const [jobToView, setJobToView] = useState<Job | null>(null)

  // Fetch jobs that are not verified
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/jobs/verify`, {
        credentials: "include", // Include cookies for auth
      })

      if (!response.ok) throw new Error("Failed to fetch jobs")

      const data = await response.json()
      // In frontend
      setJobs(data.jobs || [])
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast.error("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }, [BASE_URL])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Verify job
  const verifyJob = useCallback(
    async (jobId: string) => {
      setProcessingJob(jobId)
      try {
        const response = await fetch(`${BASE_URL}/api/jobs/${jobId}/verify`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) throw new Error("Failed to verify job")

        toast.success("Job verified successfully")
        // Remove the job from the list
        setJobs((prev) => prev.filter((job) => job._id !== jobId))
      } catch (error) {
        console.error("Error verifying job:", error)
        toast.error("Failed to verify job")
      } finally {
        setProcessingJob(null)
      }
    },
    [BASE_URL],
  )

  // Delete job
  const deleteJob = useCallback(
    async (jobId: string) => {
      setProcessingJob(jobId)
      try {
        const response = await fetch(`${BASE_URL}/api/jobs/${jobId}`, {
          method: "DELETE",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Failed to delete job")

        toast.success("Job deleted successfully")
        // Remove the job from the list
        setJobs((prev) => prev.filter((job) => job._id !== jobId))
        setJobToDelete(null)
      } catch (error) {
        console.error("Error deleting job:", error)
        toast.error("Failed to delete job")
      } finally {
        setProcessingJob(null)
      }
    },
    [BASE_URL],
  )

  // Filter jobs based on search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs

    const query = searchQuery.toLowerCase()
    return jobs.filter(
      (job) =>
        job.role.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.country.toLowerCase().includes(query) ||
        (job.cities && job.cities.some((city) => city.toLowerCase().includes(query))) ||
        (job.skills_required && job.skills_required.some((skill) => skill.toLowerCase().includes(query))),
    )
  }, [jobs, searchQuery])

  return (
    <div className="space-y-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { zIndex: 9999 },
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
        <DialogContent className="bg-white rounded-xl shadow-xl max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {jobToDelete && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-800">{jobToDelete.role}</p>
                <p className="text-sm text-gray-600 mt-1">Company: {jobToDelete.company.name}</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-4"
              onClick={() => setJobToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4"
              onClick={() => jobToDelete && deleteJob(jobToDelete._id)}
              disabled={processingJob === jobToDelete?._id}
            >
              {processingJob === jobToDelete?._id ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : null}
              Delete Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Details Dialog */}
      <Dialog open={!!jobToView} onOpenChange={(open) => !open && setJobToView(null)}>
        <DialogContent className="bg-white rounded-xl shadow-xl max-w-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Job Details</DialogTitle>
          </DialogHeader>
          {jobToView && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{jobToView.role}</h2>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Building2 className="h-5 w-5 mr-2 text-teal-600" />
                    <span className="text-gray-800">{jobToView.company.name}</span>
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
                      {formatLocation(jobToView.country, jobToView.cities, jobToView.remote)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="text-gray-800">
                      {formatExperience(jobToView.min_experience, jobToView.max_experience)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="text-gray-800">
                      {formatSalary(jobToView.min_salary, jobToView.max_salary, jobToView.currency)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Application Deadline</p>
                    <p className="text-gray-800">
                      {jobToView.last_date ? formatDate(jobToView.last_date) : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{jobToView.description}</p>
              </div>

              {jobToView.skills_required && jobToView.skills_required.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {jobToView.skills_required.map((skill, index) => (
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
                  href={jobToView.applylink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-800 hover:underline break-all"
                >
                  {jobToView.applylink}
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Posted By</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                      {jobToView.user.firstName.charAt(0)}
                      {jobToView.user.lastName.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">
                        {jobToView.user.firstName} {jobToView.user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">@{jobToView.user.username}</p>
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
                    {jobToView.user.email}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>Created: {formatDate(jobToView.createdAt)}</p>
                <p>Last Updated: {formatDate(jobToView.updatedAt)}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between mt-4">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-4"
              onClick={() => setJobToView(null)}
            >
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4"
                onClick={() => {
                  setJobToDelete(jobToView)
                  setJobToView(null)
                }}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4"
                onClick={() => {
                  if (jobToView) {
                    verifyJob(jobToView._id)
                    setJobToView(null)
                  }
                }}
                disabled={processingJob === jobToView?._id}
              >
                {processingJob === jobToView?._id ? (
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
              <CardTitle className="text-2xl">Verify Jobs</CardTitle>
              <CardDescription>Review and verify job postings before they go live</CardDescription>
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
                  placeholder="Search jobs by title, company, skills..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <AlertCircle className="mr-1 h-3.5 w-3.5" />
              {jobs.length} Pending Verification
            </Badge>
          </div>

          {/* Jobs table */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">No jobs found</h3>
              <p className="text-gray-600 mt-2">
                {searchQuery ? "Try a different search term" : "All jobs have been verified"}
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-auto">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Posted By</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Posted On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              className="p-0 h-auto font-medium text-left hover:text-teal-700"
                              onClick={() => setJobToView(job)}
                            >
                              {job.role}
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatSalary(job.min_salary, job.max_salary, job.currency)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                              <Building2 className="h-4 w-4 text-gray-500" />
                            </div>
                            <span>{job.company.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-semibold mr-2">
                              {job.user.firstName.charAt(0)}
                              {job.user.lastName.charAt(0)}
                            </div>
                            <div>
                              <span className="text-sm font-medium">
                                {job.user.firstName} {job.user.lastName}
                              </span>
                              <p className="text-xs text-gray-500">@{job.user.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                            <span
                              className="truncate max-w-[150px]"
                              title={formatLocation(job.country, job.cities, job.remote)}
                            >
                              {formatLocation(job.country, job.cities, job.remote)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatExperience(job.min_experience, job.max_experience)}</TableCell>
                        <TableCell>{formatDate(job.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                              onClick={() => verifyJob(job._id)}
                              disabled={processingJob === job._id}
                            >
                              {processingJob === job._id ? (
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
                              onClick={() => setJobToDelete(job)}
                              disabled={processingJob === job._id}
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
