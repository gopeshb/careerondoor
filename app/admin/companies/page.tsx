"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Building2, CheckCircle, Trash2, AlertCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Company {
  _id: string
  name: string
  website: string
  avgRating: number
  TotalReviews: number
  verified: boolean
  createdAt: string
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [processingCompany, setProcessingCompany] = useState<string | null>(null)

  // Fetch companies that are not verified
  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      // We'll fetch all companies and filter on the client side
      // In a real app, you'd want to add a server endpoint to filter by verified status
      const response = await fetch(`${BASE_URL}/api/companies/verify`)
      if (!response.ok) throw new Error("Failed to fetch companies")

      const data = await response.json()
      // Filter to only show unverified companies
      const unverifiedCompanies = data.filter((company: Company) => !company.verified)
      setCompanies(unverifiedCompanies)
    } catch (error) {
      console.error("Error fetching companies:", error)
      toast.error("Failed to load companies")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  // Verify company
  const verifyCompany = useCallback(async (companyId: string) => {
    setProcessingCompany(companyId);
    try {
      const response = await fetch(`${BASE_URL}/api/companies/verify/${companyId}`, {
        method: "PUT", // Ensure it matches the backend
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!response.ok) throw new Error("Failed to verify company");
  
      toast.success("Company verified successfully");
      // Remove the company from the list
      setCompanies((prev) => prev.filter((company) => company._id !== companyId));
    } catch (error) {
      console.error("Error verifying company:", error);
      toast.error("Failed to verify company");
    } finally {
      setProcessingCompany(null);
    }
  }, []);
  

  // Delete company
  const deleteCompany = useCallback(async (companyId: string) => {
    if (!window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return
    }

    setProcessingCompany(companyId)
    try {
      const response = await fetch(`${BASE_URL}/api/companies/${companyId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Failed to delete company")

      toast.success("Company deleted successfully")
      // Remove the company from the list
      setCompanies((prev) => prev.filter((company) => company._id !== companyId))
    } catch (error) {
      console.error("Error deleting company:", error)
      toast.error("Failed to delete company")
    } finally {
      setProcessingCompany(null)
    }
  }, [])

  // Filter companies based on search query
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies

    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.website && company.website.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }, [companies, searchQuery])

  return (
    <div className="space-y-6">
      <Toaster position="top-center" toastOptions={{
    style: { zIndex: 9999 },
  }}/>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Manage Companies</CardTitle>
              <CardDescription>Verify or delete company profiles</CardDescription>
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
                  placeholder="Search companies..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <AlertCircle className="mr-1 h-3.5 w-3.5" />
              {companies.length} Pending Verification
            </Badge>
          </div>

          {/* Companies table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-lg text-gray-600">Loading companies...</span>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No companies found</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery ? "Try a different search term" : "All companies have been verified"}
              </p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-center">Reviews</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company._id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>
                        {company.website ? (
                          <a
                            href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            {company.website.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <span className="text-gray-500 italic">Not provided</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{company.TotalReviews || 0}</TableCell>
                      <TableCell className="text-center">
                        {company.avgRating ? company.avgRating.toFixed(1) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            onClick={() => verifyCompany(company._id)}
                            disabled={processingCompany === company._id}
                          >
                            {processingCompany === company._id ? (
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
                            onClick={() => deleteCompany(company._id)}
                            disabled={processingCompany === company._id}
                          >
                            {processingCompany === company._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

