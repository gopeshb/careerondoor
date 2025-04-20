"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingSpinner({ message = "Loading...", subMessage = "Please wait while we fetch the information" }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 animate-pulse"></div>
              <Loader2 className="h-20 w-20 animate-spin text-teal-600 absolute inset-0" />
            </div>
            <p className="text-gray-700 text-lg font-medium">{message}</p>
            <p className="text-gray-500 text-sm mt-2">{subMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}