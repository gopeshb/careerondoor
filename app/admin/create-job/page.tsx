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
import { Loader2, Briefcase, Building2, MapPin, Calendar, DollarSign, Link2, FileText, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Company {
  _id: string
  name: string
}

interface JobFormData {
  role: string;
  experience: string;
  location: string;
  companyId: string;
  expected_salary: string;
  applylink: string;
  last_date: string;
  description: string;
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

export default function CreateJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [skills, setSkills] = useState<string[]>([])

  const [formData, setFormData] = useState<JobFormData>({
    role: "",
    experience: "",
    location: "",
    companyId: "",
    expected_salary: "",
    applylink: "",
    last_date: "",
    description: "",
  });
  

  // Fetch companies for dropdown - optimized with useCallback
  const fetchCompanies = useCallback(async () => {
    setLoadingCompanies(true)
    try {
      // In a real app, you'd want to filter for verified companies only
      const res = await fetch(`${BASE_URL}/api/companies/all`)
      if (!res.ok) throw new Error("Failed to fetch companies")
      const data = await res.json()
      setCompanies(data)
    } catch (error) {
      toast.error("Failed to load companies")
      console.error(error)
    } finally {
      setLoadingCompanies(false)
    }
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  // Optimized form handlers with useCallback
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  // Memoize experience options to prevent recreation on each render
  const experienceOptions = useMemo(
    () => [
      { value: "0", label: "Fresher (0 years)" },
      { value: "1", label: "1 Year" },
      { value: "2", label: "2 Years" },
      { value: "3", label: "3 Years" },
      { value: "4", label: "4 Years" },
      { value: "5", label: "5 Years" },
      { value: "6", label: "6+ Years" },
      { value: "8", label: "8+ Years" },
      { value: "10", label: "10+ Years" },
    ],
    [],
  )

  // Form validation
  const validateForm = useCallback(() => {
    if (
      !formData.role ||
      !formData.experience ||
      !formData.location ||
      !formData.companyId ||
      !formData.expected_salary ||
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
      e.preventDefault();
  
      if (!validateForm()) return;
  
      setLoading(true);
  
      try {
        const response = await fetch(`${BASE_URL}/api/jobs`, {
          method: "POST", // or "PUT" if updating
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: formData.role,
            experience: formData.experience,
            location: formData.location,
            companyId: formData.companyId,
            expected_salary: formData.expected_salary,
            applylink: formData.applylink,
            last_date: formData.last_date,
            description: formData.description,
            skills_required: skills, // Ensure this is an array
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Server Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        toast.success("Job created successfully!");
  
        setFormData({
          role: "",
          experience: "",
          location: "",
          companyId: "",
          expected_salary: "",
          applylink: "",
          last_date: "",
          description: "",
        });
        setSkills([]);
  
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      } catch (error: any) {
        toast.error(error.message || "Failed to create job");
      } finally {
        setLoading(false);
      }
    },
    [validateForm, router, formData, skills]
  );
  
  

  // Format today's date for min attribute - memoized
  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  return (
    <div className="max-w-3xl mx-auto">


      <Card className="shadow-md border-0 m-3 p-3">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-md">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Create New Job</CardTitle>
              <CardDescription>Post a new job opportunity for candidates</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                  Job Title
                </Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Experience (Years)
                </Label>
                <Select value={formData.experience} onValueChange={(value) => handleSelectChange("experience", value)}>
                  <SelectTrigger  id="experience">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className=" bg-gray-50" > 
                    {experienceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="companyId" className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                  Company
                </Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(value) => handleSelectChange("companyId", value)}
                  disabled={loadingCompanies}
                >
                  <SelectTrigger id="companyId">
                    <SelectValue placeholder={loadingCompanies ? "Loading companies..." : "Select company"} />
                  </SelectTrigger>
                  <SelectContent className=" bg-gray-50">
                    {companies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Expected Salary */}
              <div className="space-y-2">
                <Label htmlFor="expected_salary" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  Expected Salary
                </Label>
                <Input
                  id="expected_salary"
                  name="expected_salary"
                  placeholder="e.g. ₹15-20 LPA"
                  value={formData.expected_salary}
                  onChange={handleChange}
                  required
                />
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="applylink" className="flex items-center">
                  <Link2 className="h-4 w-4 mr-2 text-gray-500" />
                  Application URL
                </Label>
                <Input
                  id="applylink"
                  name="applylink"
                  placeholder="https://company.com/careers/job-id"
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
                  Job Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the job role and responsibilities"
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
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Job...
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Create Job
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


