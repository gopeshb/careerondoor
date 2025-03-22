"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2, User, Clock, ArrowRight, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user } = useSelector((state: any) => state.user)

  const adminFeatures = [
    {
      title: "Create Job Listings",
      description: "Post new job opportunities for companies in the system",
      icon: <Briefcase className="h-10 w-10 text-teal-500" />,
      link: "/admin/create-job",
      color: "bg-teal-50 border-teal-100",
      buttonColor: "text-teal-600 border-teal-200 hover:bg-teal-50",
    },
    {
      title: "Create Internships",
      description: "Post new internship opportunities for students",
      icon: <GraduationCap className="h-10 w-10 text-green-500" />,
      link: "/admin/create-internship",
      color: "bg-green-50 border-green-100",
      buttonColor: "text-green-600 border-green-200 hover:bg-green-50",
    },
    {
      title: "Manage Companies",
      description: "View, verify, and manage company profiles",
      icon: <Building2 className="h-10 w-10 text-blue-500" />,
      link: "/admin/companies",
      color: "bg-blue-50 border-blue-100",
      buttonColor: "text-blue-600 border-blue-200 hover:bg-blue-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card className="border-0 shadow-md bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Welcome, {user?.firstName || "Admin"}</CardTitle>
          <CardDescription>
            You have administrator access to CareerOnDoor. Manage jobs and companies from this dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <User className="h-8 w-8 text-indigo-500 mr-4" />
            <div>
              <p className="font-medium text-gray-900">Logged in as Admin</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <div className="ml-auto flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Clock className="mr-1 h-3 w-3" />
                Active
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminFeatures.map((feature, index) => (
          <Card key={index} className={`border ${feature.color}`}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-white shadow-sm border border-gray-100">{feature.icon}</div>
                <div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={feature.link}>
                <Button variant="outline" className={`w-full justify-between ${feature.buttonColor}`}>
                  Go to {feature.title.split(" ").pop()}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-teal-100 text-sm">Total Jobs</p>
                <p className="text-3xl font-bold">--</p>
              </div>
              <Briefcase className="h-8 w-8 text-teal-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-sm">Total Companies</p>
                <p className="text-3xl font-bold">--</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-purple-100 text-sm">Pending Verifications</p>
                <p className="text-3xl font-bold">--</p>
              </div>
              <Clock className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

