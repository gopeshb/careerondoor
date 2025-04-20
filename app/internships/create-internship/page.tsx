"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Loader2,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Link2,
  FileText,
  Plus,
  X,
  Info,
  AlertCircle,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"
import CompanySelector from "@/components/company-selector"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

interface InternshipFormData {
  role: string
  country: string
  cities: string[]
  remote: boolean
  companyId: string
  min_stipend: string
  max_stipend: string
  currency: string
  duration: string
  applylink: string
  last_date: string
  description: string
}

interface ValidationError {
  field: string
  message: string
}

// Separate skill input component for better performance
const SkillInput = ({
  skills,
  setSkills,
  hasError,
  errorMessage,
}: {
  skills: string[]
  setSkills: React.Dispatch<React.SetStateAction<string[]>>
  hasError?: boolean
  errorMessage?: string
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
      <Label className={`flex items-center ${hasError ? "text-red-500" : ""}`}>
        <FileText className={`h-4 w-4 mr-2 ${hasError ? "text-red-500" : "text-gray-500"}`} />
        Required Skills
      </Label>
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill and press Enter"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={handleSkillKeyDown}
          className={hasError ? "border-red-300 focus-visible:ring-red-300" : ""}
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
              className="flex items-center gap-1 bg-teal-50 text-teal-700 hover:bg-teal-100"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 rounded-full hover:bg-teal-200 p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {skill}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      {hasError && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
    </div>
  )
}

// City input component
const CityInput = ({
  cities,
  setCities,
}: {
  cities: string[]
  setCities: React.Dispatch<React.SetStateAction<string[]>>
}) => {
  const [currentCity, setCurrentCity] = useState("")

  const addCity = useCallback(() => {
    if (currentCity.trim() && !cities.includes(currentCity.trim())) {
      setCities((prev) => [...prev, currentCity.trim()])
      setCurrentCity("")
    }
  }, [currentCity, cities, setCities])

  const removeCity = useCallback(
    (cityToRemove: string) => {
      setCities((prev) => prev.filter((city) => city !== cityToRemove))
    },
    [setCities],
  )

  const handleCityKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addCity()
      }
    },
    [addCity],
  )

  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
        Cities
      </Label>
      <div className="flex gap-2">
        <Input
          placeholder="Add a city and press Enter"
          value={currentCity}
          onChange={(e) => setCurrentCity(e.target.value)}
          onKeyDown={handleCityKeyDown}
        />
        <Button type="button" variant="outline" onClick={addCity} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {cities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {cities.map((city, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              {city}
              <button
                type="button"
                onClick={() => removeCity(city)}
                className="ml-1 rounded-full hover:bg-blue-200 p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {city}</span>
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
  const [skills, setSkills] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [formSubmitted, setFormSubmitted] = useState(false)

  const [formData, setFormData] = useState<InternshipFormData>({
    role: "",
    country: "",
    cities: [],
    remote: false,
    companyId: "",
    min_stipend: "",
    max_stipend: "",
    currency: "INR",
    duration: "3",
    applylink: "",
    last_date: "",
    description: "",
  })

  // Currency options
  const currencyOptions = [
    { value: "INR", label: "Indian Rupee (₹)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
  ]

  // Duration options
  const durationOptions = [
    { value: "1", label: "1 Month" },
    { value: "2", label: "2 Months" },
    { value: "3", label: "3 Months" },
    { value: "4", label: "4 Months" },
    { value: "5", label: "5 Months" },
    { value: "6", label: "6 Months" },
    { value: "9", label: "9 Months" },
    { value: "12", label: "12 Months" },
  ]

  // Optimized form handlers with useCallback
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Clear validation errors for this field when user starts typing
      if (formSubmitted) {
        setValidationErrors((prev) => prev.filter((error) => error.field !== name))
      }
    },
    [formSubmitted],
  )

  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Clear validation errors for this field when user changes selection
      if (formSubmitted) {
        setValidationErrors((prev) => prev.filter((error) => error.field !== name))
      }
    },
    [formSubmitted],
  )

  const handleCheckboxChange = useCallback((name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }, [])

  // Form validation
  const validateForm = useCallback(() => {
    const errors: ValidationError[] = []

    // Required fields
    if (!formData.role) {
      errors.push({ field: "role", message: "Internship role is required" })
    }

    if (!formData.country) {
      errors.push({ field: "country", message: "Country is required" })
    }

    if (!formData.companyId) {
      errors.push({ field: "companyId", message: "Company is required" })
    }

    if (!formData.duration) {
      errors.push({ field: "duration", message: "Duration is required" })
    } else if (isNaN(Number(formData.duration)) || Number(formData.duration) < 1) {
      errors.push({ field: "duration", message: "Duration must be a positive number" })
    }

    if (!formData.applylink) {
      errors.push({ field: "applylink", message: "Application link is required" })
    } else {
      // URL validation
     const urlRegex =  /^https:\/\/[^\s/$.?#].[^\s]*$/;
      if (!urlRegex.test(formData.applylink)) {
        errors.push({ field: "applylink", message: "Must be a valid URL" })
      }
    }

    if (!formData.last_date) {
      errors.push({ field: "last_date", message: "Application deadline is required" })
    } else {
      // Date validation
      const deadline = new Date(formData.last_date)
      if (isNaN(deadline.getTime())) {
        errors.push({ field: "last_date", message: "Deadline must be a valid date" })
      } else if (deadline < new Date()) {
        errors.push({ field: "last_date", message: "Deadline must be a future date" })
      }
    }

    if (!formData.description) {
      errors.push({ field: "description", message: "Internship description is required" })
    } else if (formData.description.length > 250) {
      errors.push({ field: "description", message: "Internship description must not exceed 250 characters" })
    }

    // Stipend validation
    if (formData.min_stipend && Number(formData.min_stipend) < 0) {
      errors.push({ field: "min_stipend", message: "Minimum stipend cannot be negative" })
    }

    if (formData.max_stipend && Number(formData.max_stipend) < 0) {
      errors.push({ field: "max_stipend", message: "Maximum stipend cannot be negative" })
    }

    if (formData.min_stipend && formData.max_stipend && Number(formData.min_stipend) > Number(formData.max_stipend)) {
      errors.push({
        field: "stipend",
        message: "Minimum stipend must be less than or equal to maximum stipend",
      })
    }

    setValidationErrors(errors)
    return errors.length === 0
  }, [formData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setFormSubmitted(true)

      if (!validateForm()) {
        toast.error("Please fix the errors in the form", {
          duration: 4000,
          style: {
            background: "#f44336",
            color: "white",
            borderRadius: "8px",
            padding: "12px 24px",
          },
          icon: "⚠️",
        })
        return
      }

      setLoading(true)

      try {
        const internshipData = {
          role: formData.role.trim(),
          country: formData.country.trim(),
          cities: formData.cities,
          remote: formData.remote,
          companyId: formData.companyId,
          min_stipend: formData.min_stipend ? Number(formData.min_stipend) : undefined,
          max_stipend: formData.max_stipend ? Number(formData.max_stipend) : undefined,
          currency: formData.currency,
          duration: Number(formData.duration),
          applylink: formData.applylink.trim(),
          last_date: formData.last_date,
          description: formData.description.trim(),
          skills_required: skills,
        }

        const response = await fetch(`${BASE_URL}/api/internships`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for auth
          body: JSON.stringify(internshipData),
        })

        const data = await response.json()

        if (!response.ok) {
          if (data.errors && Array.isArray(data.errors)) {
            setValidationErrors(data.errors)
            throw new Error(data.message || "Validation failed")
          }
          throw new Error(data.message || "Server Error")
        }

        toast.success("Internship created successfully! It will be reviewed before being published.", {
          duration: 4000,
          style: {
            background: "#10b981",
            color: "white",
            borderRadius: "8px",
            padding: "12px 24px",
          },
          icon: "✅",
        })

        // Reset form
        setFormData({
          role: "",
          country: "",
          cities: [],
          remote: false,
          companyId: "",
          min_stipend: "",
          max_stipend: "",
          currency: "INR",
          duration: "3",
          applylink: "",
          last_date: "",
          description: "",
        })
        setSkills([])
        setFormSubmitted(false)
        setValidationErrors([])

      } catch (error: any) {
        toast.error(error.message || "Failed to create internship", {
          duration: 4000,
          style: {
            background: "#f44336",
            color: "white",
            borderRadius: "8px",
            padding: "12px 24px",
          },
          icon: "⚠️",
        })
      } finally {
        setLoading(false)
      }
    },
    [validateForm, router, formData, skills, BASE_URL],
  )

  // Format today's date for min attribute - memoized
  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  // Check if a field has an error
  const hasError = useCallback(
    (field: string) => {
      return validationErrors.some((error) => error.field === field)
    },
    [validationErrors],
  )

  // Get error message for a field
  const getErrorMessage = useCallback(
    (field: string) => {
      const error = validationErrors.find((error) => error.field === field)
      return error ? error.message : ""
    },
    [validationErrors],
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">

      {/* Hero Section with Wavy Background */}
      <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 pt-24 pb-16 px-6  text-white overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create New Internship</h1>
          <p className="text-lg opacity-90">Post a new internship opportunity for students and graduates</p>
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

      <div className="max-w-3xl mx-auto px-4 py-8 -mt-6 relative z-10">
        <Alert className="mb-8 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <div className="bg-amber-200 rounded-full p-2 self-start mb-4 sm:mb-0">
              <Info className="h-6 w-6 text-amber-700" />
            </div>
            <div className="flex-1">
              <AlertTitle className="text-lg font-semibold text-amber-900 mb-2">Verification Required</AlertTitle>

              <AlertDescription className="text-amber-800 text-sm leading-relaxed">
                All internship postings will be reviewed and verified by our team before being published on the
                platform.
              </AlertDescription>
            </div>
          </div>
        </Alert>
        {validationErrors.length > 0 && formSubmitted && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Please fix the following errors</AlertTitle>
            <AlertDescription className="text-red-700">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-md border-0">
          <CardContent className="p-6 pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Internship Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className={`flex items-center ${formSubmitted && hasError("role") ? "text-red-500" : ""}`}
                  >
                    <Briefcase
                      className={`h-4 w-4 mr-2 ${formSubmitted && hasError("role") ? "text-red-500" : "text-gray-500"}`}
                    />
                    Internship Title *
                  </Label>
                  <Input
                    id="role"
                    name="role"
                    placeholder="e.g. Marketing Intern"
                    value={formData.role}
                    onChange={handleChange}
                    className={formSubmitted && hasError("role") ? "border-red-300 focus-visible:ring-red-300" : ""}
                  />
                  {formSubmitted && hasError("role") && (
                    <p className="text-sm text-red-500">{getErrorMessage("role")}</p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className={`flex items-center ${formSubmitted && hasError("country") ? "text-red-500" : ""}`}
                  >
                    <MapPin
                      className={`h-4 w-4 mr-2 ${formSubmitted && hasError("country") ? "text-red-500" : "text-gray-500"}`}
                    />
                    Country *
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="e.g. India, USA"
                    value={formData.country}
                    onChange={handleChange}
                    className={formSubmitted && hasError("country") ? "border-red-300 focus-visible:ring-red-300" : ""}
                  />
                  {formSubmitted && hasError("country") && (
                    <p className="text-sm text-red-500">{getErrorMessage("country")}</p>
                  )}
                </div>

                {/* Cities */}
                <CityInput
                  cities={formData.cities}
                  setCities={(update) =>
                    setFormData((prev) => ({
                      ...prev,
                      cities: typeof update === "function" ? update(prev.cities) : update,
                    }))
                  }
                />

                {/* Remote Option */}
                <div className="space-y-2 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remote"
                      checked={formData.remote}
                      onCheckedChange={(checked) => handleCheckboxChange("remote", checked as boolean)}
                    />
                    <Label htmlFor="remote" className="cursor-pointer">
                      This is a remote internship
                    </Label>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className={`flex items-center ${formSubmitted && hasError("duration") ? "text-red-500" : ""}`}
                  >
                    <Clock
                      className={`h-4 w-4 mr-2 ${formSubmitted && hasError("duration") ? "text-red-500" : "text-gray-500"}`}
                    />
                    Duration (Months) *
                  </Label>
                  <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                    <SelectTrigger
                      id="duration"
                      className={
                        formSubmitted && hasError("duration") ? "border-red-300 focus-visible:ring-red-300" : ""
                      }
                    >
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
                  {formSubmitted && hasError("duration") && (
                    <p className="text-sm text-red-500">{getErrorMessage("duration")}</p>
                  )}
                </div>

                {/* Company Selector with Add Company functionality */}
                <CompanySelector
                  selectedCompanyId={formData.companyId}
                  onCompanySelect={(companyId) => {
                    setFormData((prev) => ({ ...prev, companyId }))
                    if (formSubmitted) {
                      setValidationErrors((prev) => prev.filter((error) => error.field !== "companyId"))
                    }
                  }}
                  hasError={formSubmitted && hasError("companyId")}
                  errorMessage={formSubmitted ? getErrorMessage("companyId") : ""}
                  baseUrl={BASE_URL}
                />

                {/* Currency */}
                <div className="space-y-2">
                  <Label htmlFor="currency" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                    Currency
                  </Label>
                  <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50">
                      {currencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Stipend */}
                <div className="space-y-2">
                  <Label
                    htmlFor="min_stipend"
                    className={`flex items-center ${formSubmitted && hasError("min_stipend") ? "text-red-500" : ""}`}
                  >
                    <DollarSign
                      className={`h-4 w-4 mr-2 ${formSubmitted && hasError("min_stipend") ? "text-red-500" : "text-gray-500"}`}
                    />
                    Minimum Stipend (Monthly)
                  </Label>
                  <Input
                    id="min_stipend"
                    name="min_stipend"
                    type="number"
                    placeholder="e.g. 10000"
                    value={formData.min_stipend}
                    onChange={handleChange}
                    className={
                      formSubmitted && hasError("min_stipend") ? "border-red-300 focus-visible:ring-red-300" : ""
                    }
                  />
                  {formSubmitted && hasError("min_stipend") && (
                    <p className="text-sm text-red-500">{getErrorMessage("min_stipend")}</p>
                  )}
                </div>

                {/* Max Stipend */}
                <div className="space-y-2">
                  <Label
                    htmlFor="max_stipend"
                    className={`flex items-center ${formSubmitted && hasError("max_stipend") ? "text-red-500" : ""}`}
                  >
                    <DollarSign
                      className={`h-4 w-4 mr-2 ${formSubmitted && hasError("max_stipend") ? "text-red-500" : "text-gray-500"}`}
                    />
                    Maximum Stipend (Monthly)
                  </Label>
                  <Input
                    id="max_stipend"
                    name="max_stipend"
                    type="number"
                    placeholder="e.g. 15000"
                    value={formData.max_stipend}
                    onChange={handleChange}
                    className={
                      formSubmitted && hasError("max_stipend") ? "border-red-300 focus-visible:ring-red-300" : ""
                    }
                  />
                  {formSubmitted && hasError("stipend") && (
                    <p className="text-sm text-red-500">{getErrorMessage("stipend")}</p>
                  )}
                </div>

                {/* Last Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="last_date"
                    className={`flex items-center ${formSubmitted && hasError("last_date") ? "text-red-500" : ""}`}
                  >
                    <Calendar
                      className={`h-4 w-4 mr-2 ${formSubmitted && hasError("last_date") ? "text-red-500" : "text-gray-500"}`}
                    />
                    Last Date to Apply *
                  </Label>
                  <Input
                    id="last_date"
                    name="last_date"
                    type="date"
                    min={today}
                    value={formData.last_date}
                    onChange={handleChange}
                    className={
                      formSubmitted && hasError("last_date") ? "border-red-300 focus-visible:ring-red-300" : ""
                    }
                  />
                  {formSubmitted && hasError("last_date") && (
                    <p className="text-sm text-red-500">{getErrorMessage("last_date")}</p>
                  )}
                </div>

                {/* Apply Link */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="applylink"
                    className={`flex items-center ${formSubmitted && hasError("applylink") ? "text-red-500" : ""}`}
                  >
                    <Link2
                      className={`h-4 w-4 mr-2 ${formSubmitted && hasError("applylink") ? "text-red-500" : "text-gray-500"}`}
                    />
                    Application URL *
                  </Label>
                  <Input
                    id="applylink"
                    name="applylink"
                    placeholder="https://company.com/careers/internship-id"
                    value={formData.applylink}
                    onChange={handleChange}
                    className={
                      formSubmitted && hasError("applylink") ? "border-red-300 focus-visible:ring-red-300" : ""
                    }
                  />
                  {formSubmitted && hasError("applylink") && (
                    <p className="text-sm text-red-500">{getErrorMessage("applylink")}</p>
                  )}
                </div>

                {/* Skills - Extracted to a separate component */}
                <SkillInput
                  skills={skills}
                  setSkills={(newSkills) => {
                    setSkills(newSkills)
                    if (formSubmitted) {
                      setValidationErrors((prev) => prev.filter((error) => error.field !== "skills_required"))
                    }
                  }}
                  hasError={formSubmitted && hasError("skills_required")}
                  errorMessage={formSubmitted ? getErrorMessage("skills_required") : ""}
                />

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="description"
                    className={`flex items-center ${formSubmitted && hasError("description") ? "text-red-500" : ""}`}
                  >
                    <FileText
                      className={`h-4 w-4 mr-2 ${formSubmitted && hasError("description") ? "text-red-500" : "text-gray-500"}`}
                    />
                    Internship Description * <span className="text-xs text-gray-500 ml-2">(Max 250 characters)</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the internship role and responsibilities"
                    value={formData.description}
                    onChange={handleChange}
                    className={`min-h-[100px] ${
                      formSubmitted && hasError("description") ? "border-red-300 focus-visible:ring-red-300" : ""
                    }`}
                    maxLength={250}
                  />
                  <div className="flex justify-between">
                    <p className={`text-xs ${formData.description.length > 250 ? "text-red-500" : "text-gray-500"}`}>
                      {formData.description.length}/250 characters
                    </p>
                    {formSubmitted && hasError("description") && (
                      <p className="text-sm text-red-500">{getErrorMessage("description")}</p>
                    )}
                  </div>
                </div>
              </div>

              <CardFooter className="flex justify-end gap-3 px-0 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Internship...
                    </>
                  ) : (
                    <>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Create Internship
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
