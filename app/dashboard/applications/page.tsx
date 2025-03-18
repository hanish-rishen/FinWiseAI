"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  PlusCircle,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

// Mock loan application data
const mockApplications = [
  {
    id: "LA2023001",
    type: "Personal Loan",
    amount: "₹5,00,000",
    status: "approved",
    submissionDate: "2023-06-15",
    lastUpdated: "2023-06-20",
    loanTerm: "3 years",
    interestRate: "10.5%",
    emi: "₹16,133",
    applicationProgress: 100,
    actions: ["view", "download"],
  },
  {
    id: "LA2023002",
    type: "Home Loan",
    amount: "₹45,00,000",
    status: "in_progress",
    submissionDate: "2023-07-02",
    lastUpdated: "2023-07-10",
    loanTerm: "20 years",
    interestRate: "8.75%",
    emi: "₹39,114",
    applicationProgress: 65,
    actions: ["view", "edit", "upload_documents"],
  },
  {
    id: "LA2023003",
    type: "Vehicle Loan",
    amount: "₹10,00,000",
    status: "pending",
    submissionDate: "2023-08-21",
    lastUpdated: "2023-08-21",
    loanTerm: "7 years",
    interestRate: "9.5%",
    emi: "₹15,987",
    applicationProgress: 30,
    actions: ["view", "edit", "upload_documents", "cancel"],
  },
  {
    id: "LA2023004",
    type: "Personal Loan",
    amount: "₹2,50,000",
    status: "rejected",
    submissionDate: "2023-05-10",
    lastUpdated: "2023-05-15",
    loanTerm: "2 years",
    interestRate: "11.25%",
    emi: "₹11,674",
    applicationProgress: 100,
    actions: ["view", "download", "reapply"],
  },
  {
    id: "LA2023005",
    type: "Business Loan",
    amount: "₹20,00,000",
    status: "cancelled",
    submissionDate: "2023-04-05",
    lastUpdated: "2023-04-08",
    loanTerm: "5 years",
    interestRate: "12.5%",
    emi: "₹45,070",
    applicationProgress: 15,
    actions: ["view", "reapply"],
  },
  {
    id: "LA2023006",
    type: "Education Loan",
    amount: "₹8,00,000",
    status: "approved",
    submissionDate: "2023-03-12",
    lastUpdated: "2023-03-25",
    loanTerm: "7 years",
    interestRate: "9.25%",
    emi: "₹12,659",
    applicationProgress: 100,
    actions: ["view", "download"],
  },
  {
    id: "LA2023007",
    type: "Home Loan",
    amount: "₹60,00,000",
    status: "in_progress",
    submissionDate: "2023-08-01",
    lastUpdated: "2023-08-15",
    loanTerm: "25 years",
    interestRate: "8.5%",
    emi: "₹49,522",
    applicationProgress: 80,
    actions: ["view", "edit", "upload_documents"],
  },
];

// Status metadata
const statusMetadata = {
  approved: {
    label: "Approved",
    color:
      "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
    description: "Your loan has been approved and is ready for disbursement.",
  },
  in_progress: {
    label: "In Progress",
    color:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    icon: <Clock className="h-4 w-4 mr-1" />,
    description:
      "Your application is being processed and reviewed by our team.",
  },
  pending: {
    label: "Pending",
    color:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    icon: <AlertCircle className="h-4 w-4 mr-1" />,
    description:
      "Your application is waiting for document verification or additional information.",
  },
  rejected: {
    label: "Rejected",
    color:
      "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    icon: <XCircle className="h-4 w-4 mr-1" />,
    description:
      "Your application has been rejected. Please contact support for more details.",
  },
  cancelled: {
    label: "Cancelled",
    color:
      "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    icon: <Ban className="h-4 w-4 mr-1" />,
    description: "You cancelled this application.",
  },
};

type StatusType = keyof typeof statusMetadata;

export default function LoanApplicationsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );

  // Filter and sort applications based on current filters
  const filteredApplications = mockApplications
    .filter((app) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.type.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status (if not 'all')
      const matchesStatus =
        filterStatus === "all" || app.status === filterStatus;

      // Filter by loan type (if not 'all')
      const matchesType = filterType === "all" || app.type === filterType;

      // Filter by tab (status groups)
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" &&
          ["in_progress", "pending"].includes(app.status)) ||
        (activeTab === "completed" &&
          ["approved", "rejected", "cancelled"].includes(app.status));

      return matchesSearch && matchesStatus && matchesType && matchesTab;
    })
    .sort((a, b) => {
      // Sort applications based on selected sort option
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
        case "oldest":
          return (
            new Date(a.lastUpdated).getTime() -
            new Date(b.lastUpdated).getTime()
          );
        case "highest":
          return (
            parseFloat(b.amount.replace(/[^0-9.-]+/g, "")) -
            parseFloat(a.amount.replace(/[^0-9.-]+/g, ""))
          );
        case "lowest":
          return (
            parseFloat(a.amount.replace(/[^0-9.-]+/g, "")) -
            parseFloat(b.amount.replace(/[^0-9.-]+/g, ""))
          );
        default:
          return 0;
      }
    });

  // Get unique loan types for filtering
  const loanTypes = Array.from(
    new Set(mockApplications.map((app) => app.type))
  );

  // Toggle application details expansion
  const toggleApplicationDetails = (appId: string) => {
    if (selectedApplication === appId) {
      setSelectedApplication(null);
    } else {
      setSelectedApplication(appId);
    }
  };

  // Format date to locale string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get application status styles
  const getStatusStyles = (status: string) => {
    return (
      statusMetadata[status as StatusType]?.color ||
      "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  // Get application status label
  const getStatusLabel = (status: string) => {
    return statusMetadata[status as StatusType]?.label || status;
  };

  // Get application status icon
  const getStatusIcon = (status: string) => {
    return statusMetadata[status as StatusType]?.icon;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Loan Applications
            </h1>
          </div>
          <Link href="/dashboard/video-banker">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <Card className="mb-6 bg-white dark:bg-gray-900">
          <CardContent className="pt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search input - Add label for consistent alignment */}
              <div>
                <Label
                  htmlFor="searchQuery"
                  className="text-xs block mb-1.5 text-gray-500 dark:text-gray-400"
                >
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="searchQuery"
                    className="pl-9 pr-4 py-2"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Status filter - keep as is */}
              <div>
                <Label
                  htmlFor="statusFilter"
                  className="text-xs block mb-1.5 text-gray-500 dark:text-gray-400"
                >
                  Status
                </Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="statusFilter" className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loan Type filter - keep as is */}
              <div>
                <Label
                  htmlFor="typeFilter"
                  className="text-xs block mb-1.5 text-gray-500 dark:text-gray-400"
                >
                  Loan Type
                </Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="typeFilter" className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {loanTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By - keep as is */}
              <div>
                <Label
                  htmlFor="sortBy"
                  className="text-xs block mb-1.5 text-gray-500 dark:text-gray-400"
                >
                  Sort By
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sortBy" className="w-full">
                    <SelectValue placeholder="Sort applications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Amount</SelectItem>
                    <SelectItem value="lowest">Lowest Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-10">
                <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  No applications found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                  No applications match your current filters. Try adjusting your
                  search or filters, or start a new application.
                </p>
                <Link href="/dashboard/video-banker">
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Start New Application
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  {/* Application Summary */}
                  <div
                    className="p-4 md:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={() => toggleApplicationDetails(application.id)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* ID and Type */}
                      <div className="md:col-span-3 flex flex-col">
                        <div className="font-medium">{application.id}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {application.type}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="md:col-span-2 flex items-center">
                        <Badge
                          variant="outline"
                          className={`flex items-center ${getStatusStyles(application.status)}`}
                        >
                          {getStatusIcon(application.status)}
                          <span>{getStatusLabel(application.status)}</span>
                        </Badge>
                      </div>

                      {/* Amount */}
                      <div className="md:col-span-2">
                        <div className="font-medium">{application.amount}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Loan Amount
                        </div>
                      </div>

                      {/* EMI */}
                      <div className="md:col-span-2">
                        <div className="font-medium">{application.emi}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Monthly EMI
                        </div>
                      </div>

                      {/* Date */}
                      <div className="md:col-span-2">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          <span className="text-sm">
                            {formatDate(application.lastUpdated)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last Updated
                        </div>
                      </div>

                      {/* Progress bar for in-progress applications */}
                      <div className="md:col-span-1">
                        {(application.status === "in_progress" ||
                          application.status === "pending") && (
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${application.applicationProgress}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Application Details */}
                  {selectedApplication === application.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-6 gap-6">
                        {/* Loan Details */}
                        <div>
                          <h4 className="font-medium mb-3 text-sm">
                            Loan Details
                          </h4>
                          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                            <div>
                              <div className="text-gray-500 dark:text-gray-400">
                                Loan Type
                              </div>
                              <div>{application.type}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 dark:text-gray-400">
                                Loan Amount
                              </div>
                              <div>{application.amount}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 dark:text-gray-400">
                                Interest Rate
                              </div>
                              <div>{application.interestRate}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 dark:text-gray-400">
                                Tenure
                              </div>
                              <div>{application.loanTerm}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 dark:text-gray-400">
                                Monthly EMI
                              </div>
                              <div>{application.emi}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 dark:text-gray-400">
                                Status
                              </div>
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={`flex items-center ${getStatusStyles(application.status)}`}
                                >
                                  {getStatusLabel(application.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline and actions */}
                        <div>
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                            <h4 className="font-medium mb-2 md:mb-0 text-sm">
                              Application Timeline
                            </h4>
                            <div className="space-x-2">
                              {application.actions.includes("view") && (
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              )}
                              {application.actions.includes("edit") && (
                                <Button size="sm">Continue Application</Button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-3"></div>
                              <div>
                                <p className="text-sm">Application Submitted</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(application.submissionDate)}
                                </p>
                              </div>
                            </div>

                            {application.status === "in_progress" && (
                              <div className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-3"></div>
                                <div>
                                  <p className="text-sm">Under Review</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(application.lastUpdated)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {application.status === "approved" && (
                              <div className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-3"></div>
                                <div>
                                  <p className="text-sm">
                                    Application Approved
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(application.lastUpdated)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {application.status === "rejected" && (
                              <div className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-3"></div>
                                <div>
                                  <p className="text-sm">
                                    Application Rejected
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(application.lastUpdated)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {application.status === "pending" && (
                              <div className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 mr-3"></div>
                                <div>
                                  <p className="text-sm">
                                    Additional Documents Requested
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(application.lastUpdated)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status description for rejected/pending applications */}
                      {(application.status === "rejected" ||
                        application.status === "pending") && (
                        <div className="px-4 md:px-6 pb-6 pt-0">
                          <div
                            className={`p-3 rounded-md ${application.status === "rejected" ? "bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30" : "bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30"}`}
                          >
                            <p className="text-sm">
                              {
                                statusMetadata[application.status as StatusType]
                                  .description
                              }
                              {application.status === "pending" &&
                                " Please check your email for details."}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
