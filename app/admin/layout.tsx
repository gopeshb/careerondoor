"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AdminRoute from "@/components/ui/admin-route"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2, Home, Menu, X, ChevronRight, Shield, GraduationCap } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/admin",
    },
    {
      name: "Create Job",
      href: "/admin/create-job",
      icon: <Briefcase className="h-5 w-5" />,
      active: pathname === "/admin/create-job",
    },
    {
      name: "Create Internship",
      href: "/admin/create-internship",
      icon: <GraduationCap className="h-5 w-5" />,
      active: pathname === "/admin/create-internship",
    },
    {
      name: "Manage Companies",
      href: "/admin/companies",
      icon: <Building2 className="h-5 w-5" />,
      active: pathname === "/admin/companies",
    },
  ]

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
        {/* Hero Section with Wavy Curve */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 pt-16 pb-20 px-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Shield className="h-8 w-8 mr-3" />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/20"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            <div className="hidden md:flex items-center space-x-1 bg-white/10 backdrop-blur-sm p-1 rounded-lg">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={`flex items-center gap-2 ${
                      item.active ? "bg-white text-indigo-700" : "text-white hover:bg-white/20"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
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

        {/* Mobile Navigation Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Admin Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                      item.active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {item.active && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6 relative z-10">{children}</div>
      </div>
    </AdminRoute>
  )
}

