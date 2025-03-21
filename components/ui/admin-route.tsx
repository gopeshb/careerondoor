"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Loader2 } from 'lucide-react'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useSelector((state: any) => state.user)
  const router = useRouter()

  useEffect(() => {
    // If user data is loaded and user is not an admin, redirect to home
    if (!isLoading && user && !user.admin) {
      router.push("/")
    }
    
    // If no user is logged in, redirect to login
    if (!isLoading && !user) {
      router.push("/signin?redirect=/admin")
    }
  }, [user, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-lg">Verifying access...</span>
      </div>
    )
  }

  // If user is not an admin, don't render children (this is a fallback in case the redirect hasn't happened yet)
  if (!user.admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You don't have permission to access this area.</p>
      </div>
    )
  }

  // User is an admin, render the children
  return <>{children}</>
}
