import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Logo */}
        <h2 className="text-lg font-semibold">COD | CareerOnDoor</h2>

        {/* Links and Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0">
          <div className="flex gap-4 text-sm text-gray-300">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
           
          </div>

          {/* Copyright */}
          <p className="text-white opacity-80 text-sm">
            © {new Date().getFullYear()} CareerOnDoor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

