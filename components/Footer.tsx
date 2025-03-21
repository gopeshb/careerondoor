export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Logo */}
        <h2 className="text-lg font-semibold">COD | CareerOnDoor</h2>

        {/* Copyright */}
        <p className="text-white opacity-80 text-sm mt-2 md:mt-0 ">
          © {new Date().getFullYear()} CareerOnDoor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
