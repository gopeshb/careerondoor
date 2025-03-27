"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster, toast } from "react-hot-toast"
import {
  Loader2,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Link2,
  FileText,
  Plus,
  X,
  GraduationCap,
  Clock,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

interface Company {
  _id: string
  name: string
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  pages: number
}

interface CompanyResponse {
  companies: Company[]
  pagination: PaginationInfo
}

interface InternshipFormData {
  role: string
  location: string
  companyId: string
  stipend: string
  duration: string
  applylink: string
  last_date: string
  description: string
}

// Separate skill input component for better performance
const SkillInput = ({
  skills,
  setSkills,
}: {
  skills: string[]
  setSkills: React.Dispatch<React.SetStateAction<string[]>>
}) => {
  const [currentSkill, setCurrentSkill] = useState("")

  const addSkill = useCallback(() => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills((prev) => [...prev, currentSkill.trim()])
      setCurrentSkill("")
    }
  }, [currentSkill, skills, setSkills])

  const removeSkill = useCallback(
    (skillToRemove: string) => {
      setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
    },
    [setSkills],
  )

  const handleSkillKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addSkill()
      }
    },
    [addSkill],
  )

  return (
    <div className="space-y-2 md:col-span-2">
      <Label className="flex items-center">
        <FileText className="h-4 w-4 mr-2 text-gray-500" />
        Required Skills
      </Label>
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill and press Enter"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={handleSkillKeyDown}
        />
        <Button type="button" variant="outline" onClick={addSkill} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 rounded-full hover:bg-indigo-200 p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {skill}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CreateInternshipPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [companySearchOpen, setCompanySearchOpen] = useState(false)
  const [companySearch, setCompanySearch] = useState("")
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null)
  const [searchDebounceTimeout, setSearchDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

  const [formData, setFormData] = useState<InternshipFormData>({
    role: "",
    location: "",
    companyId: "",
    stipend: "",
    duration: "3", // Default to 3 months
    applylink: "",
    last_date: "",
    description: "",
  })

  // Duration options
  const durationOptions = [
    { value: "1", label: "1 Month" },
    { value: "2", label: "2 Months" },
    { value: "3", label: "3 Months" },
    { value: "4", label: "4 Months" },
    { value: "5", label: "5 Months" },
    { value: "6", label: "6 Months" },
  ]

  // Fetch companies with search query
  const fetchCompanies = useCallback(
    async (searchTerm = "", page = 1) => {
      setLoadingCompanies(true)
      try {
        const queryParams = new URLSearchParams({
          search: searchTerm,
          page: page.toString(),
          limit: "100",
        }).toString()

        const res = await fetch(`${BASE_URL}/api/companies/names-and-ids?${queryParams}`)
        if (!res.ok) throw new Error("Failed to fetch companies")

        const data: CompanyResponse = await res.json()

        if (page > 1) {
          // Append companies for pagination
          setCompanies((prev) => [...prev, ...data.companies])
        } else {
          setCompanies(data.companies)
        }

        setPaginationInfo(data.pagination)
      } catch (error) {
        toast.error("Failed to load companies")
        console.error(error)
      } finally {
        setLoadingCompanies(false)
      }
    },
    [BASE_URL],
  )

  // Initial fetch
  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  // Handle search with debounce
  useEffect(() => {
    // Clear previous timeout
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout)
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      fetchCompanies(companySearch)
    }, 300) // 300ms debounce

    setSearchDebounceTimeout(timeout)

    // Cleanup
    return () => {
      if (searchDebounceTimeout) {
        clearTimeout(searchDebounceTimeout)
      }
    }
  }, [companySearch, fetchCompanies])

  // Optimized form handlers with useCallback
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleCompanySelect = useCallback((companyId: string) => {
    setFormData((prev) => ({ ...prev, companyId }))
    setCompanySearchOpen(false)
  }, [])

  // Get selected company name
  const selectedCompanyName = useMemo(() => {
    const company = companies.find((c) => c._id === formData.companyId)
    return company ? company.name : ""
  }, [companies, formData.companyId])

  // Form validation
  const validateForm = useCallback(() => {
    if (
      !formData.role ||
      !formData.location ||
      !formData.companyId ||
      !formData.stipend ||
      !formData.duration ||
      !formData.applylink ||
      !formData.last_date ||
      !formData.description ||
      skills.length === 0
    ) {
      toast.error("All fields are required")
      return false
    }

    // Validate URL
    if (!formData.applylink.startsWith("http")) {
      toast.error("Apply link must be a valid URL starting with http:// or https://")
      return false
    }

    // Validate date
    const selectedDate = new Date(formData.last_date)
    const today = new Date()
    if (selectedDate <= today) {
      toast.error("Last date must be in the future")
      return false
    }

    return true
  }, [formData, skills])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) return

      setLoading(true)

      try {
        const response = await fetch(`${BASE_URL}/api/internships`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for auth
          body: JSON.stringify({
            role: formData.role,
            location: formData.location,
            companyId: formData.companyId,
            stipend: formData.stipend,
            duration: Number.parseInt(formData.duration),
            applylink: formData.applylink,
            last_date: formData.last_date,
            description: formData.description,
            skills_required: skills, // Ensure this is an array
          }),
        })

        if (!response.ok) {
          throw new Error(`Server Error: ${response.statusText}`)
        }

        const data = await response.json()
        toast.success("Internship created successfully!")

        setFormData({
          role: "",
          location: "",
          companyId: "",
          stipend: "",
          duration: "3",
          applylink: "",
          last_date: "",
          description: "",
        })
        setSkills([])

        setTimeout(() => {
          router.push("/admin")
        }, 1500)
      } catch (error: any) {
        toast.error(error.message || "Failed to create internship")
      } finally {
        setLoading(false)
      }
    },
    [validateForm, router, formData, skills, BASE_URL],
  )

  // Format today's date for min attribute - memoized
  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  // Load more companies
  const handleLoadMore = useCallback(() => {
    if (paginationInfo && paginationInfo.page < paginationInfo.pages) {
      fetchCompanies(companySearch, paginationInfo.page + 1)
    }
  }, [fetchCompanies, companySearch, paginationInfo])

  return (
    <div className="max-w-3xl mx-auto">
      <Toaster position="top-center" />

      <Card className="shadow-md border-0 p-3 m-3">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-md">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Create New Internship</CardTitle>
              <CardDescription>Post a new internship opportunity for students</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Internship Title */}
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                  Internship Title
                </Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="e.g. Web Development Intern"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Bangalore, Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Company - Enhanced with searchable dropdown */}
              <div className="space-y-2">
                <Label htmlFor="companyId" className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                  Company
                </Label>
                <Popover open={companySearchOpen} onOpenChange={setCompanySearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={companySearchOpen}
                      className="w-full justify-between font-normal bg-white"
                      disabled={loadingCompanies}
                    >
                      {formData.companyId ? (
                        <span className="truncate">{selectedCompanyName}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          {loadingCompanies ? "Loading companies..." : "Select company"}
                        </span>
                      )}
                      <Building2 className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-white" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search company..."
                        value={companySearch}
                        onValueChange={setCompanySearch}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          {loadingCompanies ? (
                            <div className="flex items-center justify-center py-6">
                              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                          ) : (
                            <div className="py-6 text-center text-sm">No company found</div>
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {companies.map((company) => (
                            <CommandItem
                              key={company._id}
                              value={company.name} // Use name for matching
                              onSelect={() => handleCompanySelect(company._id)}
                              className="flex items-center"
                            >
                              <div className="mr-2 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                {company.name.charAt(0).toUpperCase()}
                              </div>
                              <span>{company.name}</span>
                              {company._id === formData.companyId && (
                                <Check className="ml-auto h-4 w-4 text-green-600" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        {paginationInfo && paginationInfo.page < paginationInfo.pages && (
                          <div className="py-2 px-2 text-center border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleLoadMore}
                              disabled={loadingCompanies}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              {loadingCompanies ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
                              Load more results
                            </Button>
                          </div>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Stipend */}
              <div className="space-y-2">
                <Label htmlFor="stipend" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  Stipend
                </Label>
                <Input
                  id="stipend"
                  name="stipend"
                  placeholder="e.g. ₹10,000/month"
                  value={formData.stipend}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  Duration
                </Label>
                <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                  <SelectTrigger id="duration" >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50">
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Last Date */}
              <div className="space-y-2">
                <Label htmlFor="last_date" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Last Date to Apply
                </Label>
                <Input
                  id="last_date"
                  name="last_date"
                  type="date"
                  min={today}
                  value={formData.last_date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Apply Link */}
              <div className="space-y-2">
                <Label htmlFor="applylink" className="flex items-center">
                  <Link2 className="h-4 w-4 mr-2 text-gray-500" />
                  Application URL
                </Label>
                <Input
                  id="applylink"
                  name="applylink"
                  placeholder="https://company.com/careers/internship-id"
                  value={formData.applylink}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Skills - Extracted to a separate component */}
              <SkillInput skills={skills} setSkills={setSkills} />

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Internship Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the internship role and responsibilities"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-gray-500">{formData.description.length}/100 characters (max)</p>
              </div>
            </div>

            <CardFooter className="flex justify-end gap-3 px-0 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Internship...
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Create Internship
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

