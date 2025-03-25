"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { logout } from "@/redux/userSlice"
import { useDispatch } from "react-redux"
import Link from "next/link"
import { Menu, X, LogIn, Building, Briefcase, ChevronDown, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { RootState } from "@/redux/store"
import { cn } from "@/lib/utils"

// Add this utility function at the top of your component (before the Navbar function)
const throttle = (func: Function, delay: number) => {
  let lastCall = 0
  return (...args: any[]) => {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return func(...args)
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  // Get user from Redux store
  const user = useSelector((state: RootState) => state.user.user)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }, 100) // Throttle to run at most once every 100ms

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when navigating
  const handleNavigation = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Get user initials for avatar fallback
  const getUserInitials = useCallback(() => {
    if (!user) return "U"
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`
  }, [user])
  // logout function
  const handleLogout = useCallback(() => {
    dispatch(logout())
    router.push("/signin") // Redirect to Sign In after logout
  }, [dispatch, router])

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white shadow-md" : "bg-gradient-to-r from-teal-400/10 to-blue-500/10 backdrop-blur-sm",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent"
          >
            COD
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
          <NavLink href="/internships" onClick={handleNavigation}>
              <GraduationCap className="w-4 h-4 mr-1.5" />
              Internships
            </NavLink>
            <NavLink href="/jobs" onClick={handleNavigation}>
              <Briefcase className="w-4 h-4 mr-1.5" />
              Jobs
            </NavLink>
            <NavLink href="/companies" onClick={handleNavigation}>
              <Building className="w-4 h-4 mr-1.5" />
              Companies
            </NavLink>
          </div>

          {/* Sign In Button or Avatar */}
          <div className="hidden md:flex items-center ">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                    <Avatar className="h-9 w-9 border-2 border-teal-100 transition-all hover:border-teal-300">
                      <AvatarImage src={user.avatar || undefined} alt={user.firstName || "User"} 
                        className="select-none pointer-events-none"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}/>
                      <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white text-gray-900 shadow-lg border border-gray-200 "
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/user-reviews")}>Reviews</DropdownMenuItem>
                  {user.admin && (
    <DropdownMenuItem onClick={() => router.push("/admin")}>
      Admin Dashboard
    </DropdownMenuItem>
  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white border-0 hover:from-teal-600 hover:to-blue-600"
                onClick={() => router.push("/signin")}
              >
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-white border-t overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-64 border-gray-200" : "max-h-0 border-transparent",
        )}
      >
        <div className="px-4 py-3 space-y-3">
        <MobileNavLink href="/internships" onClick={handleNavigation}>
            <GraduationCap className="w-5 h-5 mr-3 text-teal-500" />
            Internships
          </MobileNavLink>
          <MobileNavLink href="/jobs" onClick={handleNavigation}>
            <Briefcase className="w-5 h-5 mr-3 text-teal-500" />
            Jobs
          </MobileNavLink>
          <MobileNavLink href="/companies" onClick={handleNavigation}>
            <Building className="w-5 h-5 mr-3 text-blue-500" />
            Companies
          </MobileNavLink>

          <div className="pt-2 border-t border-gray-100">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center py-2 px-1 rounded-lg hover:bg-gray-50"
                onClick={handleNavigation}
              >
                <Avatar className="h-10 w-10 border-2 border-teal-100">
                  <AvatarImage src={user.avatar || undefined} alt={user.firstName || "User"} />
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">View profile</p>
                </div>
              </Link>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white border-0 hover:from-teal-600 hover:to-blue-600"
                onClick={() => {
                  router.push("/signin")
                  handleNavigation()
                }}
              >
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Desktop Navigation Link Component
const NavLink = React.memo(
  ({
    href,
    children,
    onClick,
  }: {
    href: string
    children: React.ReactNode
    onClick?: () => void
  }) => {
    return (
      <Link
        href={href}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
        onClick={onClick}
        prefetch={true}
      >
        {children}
      </Link>
    )
  },
)
NavLink.displayName = "NavLink"

// Mobile Navigation Link Component
const MobileNavLink = React.memo(
  ({
    href,
    children,
    onClick,
  }: {
    href: string
    children: React.ReactNode
    onClick?: () => void
  }) => {
    return (
      <Link
        href={href}
        className="flex items-center py-2 px-1 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
        onClick={onClick}
        prefetch={true}
      >
        {children}
      </Link>
    )
  },
)
MobileNavLink.displayName = "MobileNavLink"


