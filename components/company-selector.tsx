"use client";

import { useState, useCallback, useEffect } from "react";
import { Building2, Check, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import AddCompanyModal from "@/components/add-company-modal";
import { toast } from "react-hot-toast";

interface Company {
  _id: string;
  name: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface CompanyResponse {
  companies: Company[];
  pagination: PaginationInfo;
}

interface CompanySelectorProps {
  selectedCompanyId: string;
  onCompanySelect: (companyId: string) => void;
  hasError: boolean;
  errorMessage?: string;
  baseUrl: string;
}

export default function CompanySelector({
  selectedCompanyId,
  onCompanySelect,
  hasError,
  errorMessage,
  baseUrl,
}: CompanySelectorProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companySearchOpen, setCompanySearchOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const [searchDebounceTimeout, setSearchDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);

  // Get selected company name
  const selectedCompanyName = companies.find((c) => c._id === selectedCompanyId)?.name || "";

  // Fetch companies with search query
  const fetchCompanies = useCallback(
    async (searchTerm = "", page = 1) => {
      setLoadingCompanies(true);
      try {
        const queryParams = new URLSearchParams({
          search: searchTerm,
          page: page.toString(),
          limit: "100",
        }).toString();

        const res = await fetch(`${baseUrl}/api/companies/names-and-ids?${queryParams}`);
        if (!res.ok) throw new Error("Failed to fetch companies");

        const data: CompanyResponse = await res.json();
        setCompanies(data.companies);
        setPaginationInfo(data.pagination);
      } catch (error) {
        toast.error("Failed to load companies", {
          duration: 4000,
          style: {
            background: "#f44336",
            color: "white",
            borderRadius: "8px",
            padding: "12px 24px",
          },
          icon: "⚠️",
        });
        console.error(error);
      } finally {
        setLoadingCompanies(false);
      }
    },
    [baseUrl],
  );

  // Initial fetch
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Handle search with debounce
  useEffect(() => {
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }

    const timeout = setTimeout(() => {
      fetchCompanies(companySearch);
    }, 300);

    setSearchDebounceTimeout(timeout);

    return () => {
      if (searchDebounceTimeout) {
        clearTimeout(searchDebounceTimeout);
      }
    };
  }, [companySearch, fetchCompanies]);

  // Load more companies
  const handleLoadMore = useCallback(() => {
    if (paginationInfo && paginationInfo.page < paginationInfo.pages) {
      fetchCompanies(companySearch, paginationInfo.page + 1);
    }
  }, [fetchCompanies, companySearch, paginationInfo]);

  // Handle company added from modal
  const handleCompanyAdded = useCallback(
    (newCompany: Company) => {
      setCompanies((prev) => [newCompany, ...prev]);
      onCompanySelect(newCompany._id);
    },
    [onCompanySelect],
  );

  return (
    <div className="space-y-4">
      <Label
        htmlFor="companyId"
        className={`flex items-center gap-2 text-sm font-medium ${
          hasError ? "text-red-600" : "text-gray-700"
        }`}
      >
        <Building2
          className={`h-5 w-5 ${hasError ? "text-red-600" : "text-gray-500"}`}
        />
        Company *
      </Label>
      <Popover open={companySearchOpen} onOpenChange={setCompanySearchOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={companySearchOpen}
            className={`w-full justify-between px-3 py-2 text-sm font-normal bg-white border ${
              hasError ? "border-red-300 focus:ring-red-300" : "border-gray-300 focus:ring-teal-500"
            } rounded-lg hover:bg-gray-50 transition-all duration-200`}
            disabled={loadingCompanies}
          >
            {selectedCompanyId ? (
              <span className="truncate max-w-[80%]">{selectedCompanyName}</span>
            ) : (
              <span className="text-gray-400">
                {loadingCompanies ? "Loading companies..." : "Select company"}
              </span>
            )}
            <Building2 className="ml-2 h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white shadow-lg rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto" align="start">
          <Command className="w-full">
            <CommandInput
              placeholder="Search company..."
              value={companySearch}
              onValueChange={setCompanySearch}
              className="h-10 px-3 text-sm border-b border-gray-200 focus:ring-0"
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                {loadingCompanies ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm space-y-4">
                    <p className="text-gray-500">No company found</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCompanySearchOpen(false);
                        setAddCompanyModalOpen(true);
                      }}
                      className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 text-xs px-4 py-2 rounded"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Company
                    </Button>
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {companies.map((company) => (
                  <CommandItem
                    key={company._id}
                    value={company.name}
                    onSelect={() => {
                      onCompanySelect(company._id);
                      setCompanySearchOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    <div className="mr-3 h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-800">{company.name}</span>
                    {company._id === selectedCompanyId && (
                      <Check className="ml-auto h-4 w-4 text-teal-600" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {paginationInfo && paginationInfo.page < paginationInfo.pages && (
                <div className="py-2 px-3 text-center border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={loadingCompanies}
                    className="text-xs text-teal-600 hover:text-teal-800"
                  >
                    {loadingCompanies ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
                    Load more results
                  </Button>
                </div>
              )}
              <div className="py-2 px-3 text-center border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCompanySearchOpen(false);
                    setAddCompanyModalOpen(true);
                  }}
                  className="text-xs bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 px-4 py-2 rounded"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Company Not Found? Add New Company
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {hasError && (
        <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
      )}

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={addCompanyModalOpen}
        onClose={() => setAddCompanyModalOpen(false)}
        onCompanyAdded={handleCompanyAdded}
        baseUrl={baseUrl}
      />
    </div>
  );
}