"use client"

import type React from "react"

import { useMemo } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2, User, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

// Separate components for better performance
const StatCard = ({
  title,
  value,
  icon,
  gradient,
}: {
  title: string
  value: string
  icon: React.ReactNode
  gradient: string
}) => (
  <Card className={`bg-gradient-to-br ${gradient} text-white border-0`}>
    <CardContent className="pt-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-opacity-80 text-sm">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </CardContent>
  </Card>
)

// Feature card component
const FeatureCard = ({ feature }: { feature: any }) => (
  <Card className={`border ${feature.color}`}>
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
      <Link href={feature.link} prefetch={false}>
        <Button variant="outline" className={`w-full justify-between ${feature.buttonColor}`}>
          Go to {feature.title.split(" ").pop()}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  const { user } = useSelector((state: any) => state.user)

  // Memoize the admin features to prevent recreation on each render
  const adminFeatures = useMemo(
    () => [
      {
        title: "Create Job Listings",
        description: "Post new job opportunities for companies in the system",
        icon: <Briefcase className="h-10 w-10 text-teal-500" />,
        link: "/admin/create-job",
        color: "bg-teal-50 border-teal-100",
        buttonColor: "text-teal-600 border-teal-200 hover:bg-teal-50",
      },
      {
        title: "Manage Companies",
        description: "View, verify, and manage company profiles",
        icon: <Building2 className="h-10 w-10 text-blue-500" />,
        link: "/admin/companies",
        color: "bg-blue-50 border-blue-100",
        buttonColor: "text-blue-600 border-blue-200 hover:bg-blue-50",
      },
    ],
    [],
  )

  // Memoize the stats to prevent recreation on each render
  const stats = useMemo(
    () => [
      {
        title: "Total Jobs",
        value: "--",
        icon: <Briefcase className="h-8 w-8 text-teal-200" />,
        gradient: "from-teal-500 to-teal-600",
      },
      {
        title: "Total Companies",
        value: "--",
        icon: <Building2 className="h-8 w-8 text-blue-200" />,
        gradient: "from-blue-500 to-blue-600",
      },
      {
        title: "Pending Verifications",
        value: "--",
        icon: <Clock className="h-8 w-8 text-purple-200" />,
        gradient: "from-purple-500 to-purple-600",
      },
    ],
    [],
  )

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
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} gradient={stat.gradient} />
        ))}
      </div>
    </div>
  )
}

