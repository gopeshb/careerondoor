"use client";

import type React from "react";
import { useState } from "react";
import { Plus, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-hot-toast";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyAdded: (company: { _id: string; name: string }) => void;
  baseUrl: string;
}

export default function AddCompanyModal({ isOpen, onClose, onCompanyAdded, baseUrl }: AddCompanyModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("https://");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract company name from website for validation
  const extractCompanyNameFromUrl = (url: string) => {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url.trim());
      const hostname = parsedUrl.hostname.replace(/^www\./, "").split(".")[0];
      return hostname.length > 0 ? hostname : null;
    } catch (error) {
      return url.trim(); // Fallback to raw URL if parsing fails
    }
  };

  // Validate form before submission
  const validateForm = () => {
    if (!companyName.trim()) {
      setError("Company name is required");
      return false;
    }

    if (!companyWebsite.trim()) {
      setError("Company website is required");
      return false;
    }

    // Validate website as HTTPS
    const httpsRegex =  /^https:\/\/[^\s/$.?#].[^\s]*$/;
    if (!httpsRegex.test(companyWebsite.trim())) {
      setError("Website must be a valid HTTPS URL (e.g., https://example.com)");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for auth
        body: JSON.stringify({
          companyName: companyName.trim(),
          companyWebsite: companyWebsite.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add company");
      }

      // Success - notify user and update parent component
      toast.success("Company added successfully!", {
        duration: 4000,
        style: {
          background: "#10b981",
          color: "white",
          borderRadius: "8px",
          padding: "12px 24px",
        },
        icon: "✅",
      });

      // Pass the new company back to parent component
      onCompanyAdded({
        _id: data.company.id,
        name: data.company.name,
      });

      // Reset form and close modal
      setCompanyName("");
      setCompanyWebsite("https://");
      onClose();
    } catch (error: any) {
      setError(error.message || "Failed to add company");
      toast.error(error.message || "Failed to add company", {
        duration: 4000,
        style: {
          background: "#f44336",
          color: "white",
          borderRadius: "8px",
          padding: "12px 24px",
        },
        icon: "⚠️",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCompanyName("");
    setCompanyWebsite("https://");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] bg-white p-6 rounded-xl shadow-xl border border-gray-200">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <Plus className="h-6 w-6 text-teal-600" />
            Add New Company
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Add a company that isn&apos;t in our database yet. The company will be reviewed before being made available.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 p-4 rounded-lg shadow-md">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
              Company Name *
            </Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. CareerOnDoor"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              autoComplete="organization"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="company-website" className="text-sm font-medium text-gray-700">
              Company Website (HTTPS) *
            </Label>
            <Input
              id="company-website"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              autoComplete="url"
            />
            <p className="text-xs text-gray-500">Must be a valid HTTPS URL (e.g., https://example.com)</p>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 px-6 py-2 rounded-md transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Company
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}