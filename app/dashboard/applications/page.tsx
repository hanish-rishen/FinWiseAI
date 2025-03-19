"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  LoanApplication,
  LoanDecision,
  calculateLoanDecision,
} from "@/lib/decision-engine";

// Define a type for application items in the list
interface ApplicationItem {
  id: string;
  date: string;
  applicationData: LoanApplication;
  decision: LoanDecision;
  application_complete: boolean; // Add this property
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Load applications from database
    const loadApplications = async () => {
      try {
        setLoading(true);

        // Get the current user
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        // Fetch applications for this user
        const { data: appData, error: fetchError } = await supabase
          .from("application")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (!appData || appData.length === 0) {
          // If no applications in database, try loading from localStorage as fallback
          const savedApplication = localStorage.getItem(
            "videobanker_application"
          );
          if (savedApplication) {
            const localAppData = JSON.parse(savedApplication);
            if (localAppData && !localAppData.application_id) {
              // If localStorage data exists but wasn't saved to DB yet, use it
              loadFromLocalStorage();
            } else {
              setApplications([]);
            }
          } else {
            setApplications([]);
          }
        } else {
          // Process application data from database
          const processedApps = appData.map((app) => {
            // Convert to LoanApplication format
            const loanApp: LoanApplication = {
              monthly_income: app.monthly_income || "",
              employment_type: app.employment_type || "",
              credit_history: app.credit_history || "",
              loan_amount: app.loan_amount || "",
              loan_tenure: app.loan_tenure || "",
              existing_loans: app.existing_loans || "",
              collateral: app.collateral || "",
              residence_type: app.residence_type || "",
              residence_duration: app.residence_duration || "",
              associations: app.associations || "",
              field_investigation_residence:
                app.field_investigation_residence || "",
              field_investigation_workplace:
                app.field_investigation_workplace || "",
              tele_verification_reachable:
                app.tele_verification_reachable || "",
              tele_verification_accuracy: app.tele_verification_accuracy || "",
              identity_verification_passed:
                app.identity_verification_passed || false,
            };

            // Calculate decision
            const decision = calculateLoanDecision(loanApp);

            return {
              id: app.application_id.toString(),
              date: app.created_at,
              applicationData: loanApp,
              decision,
              application_complete: app.application_complete,
            };
          });

          setApplications(processedApps);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading applications:", error);
        setError("Failed to load applications");
        // Try localStorage as fallback if database fails
        loadFromLocalStorage();
        setLoading(false);
      }
    };

    // Fallback to localStorage if database fetch fails
    const loadFromLocalStorage = () => {
      try {
        const savedApplication = localStorage.getItem(
          "videobanker_application"
        );
        if (!savedApplication) {
          setApplications([]);
          return;
        }

        const applicationData = JSON.parse(savedApplication);

        // Extract data from localStorage format
        let loanApp: LoanApplication;

        if (applicationData.conversation) {
          // Conversation format
          const conversation = applicationData.conversation;
          loanApp = {
            monthly_income: conversation[1]?.response || "",
            employment_type: conversation[2]?.response || "",
            credit_history: conversation[3]?.response || "",
            loan_amount: conversation[4]?.response || "",
            loan_tenure: conversation[5]?.response || "",
            existing_loans: conversation[6]?.response || "",
            collateral: conversation[7]?.response || "",
            residence_type: conversation[8]?.response || "",
            residence_duration: conversation[9]?.response || "",
            associations: conversation[10]?.response || "",
            field_investigation_residence: conversation[11]?.response || "",
            field_investigation_workplace: conversation[12]?.response || "",
            tele_verification_reachable: conversation[13]?.response || "",
            tele_verification_accuracy: conversation[14]?.response || "",
            identity_verification_passed:
              applicationData.identity_verification_passed || false,
          };
        } else {
          // Direct fields format
          loanApp = {
            monthly_income: applicationData.monthly_income || "",
            employment_type: applicationData.employment_type || "",
            credit_history: applicationData.credit_history || "",
            loan_amount: applicationData.loan_amount || "",
            loan_tenure: applicationData.loan_tenure || "",
            existing_loans: applicationData.existing_loans || "",
            collateral: applicationData.collateral || "",
            residence_type: applicationData.residence_type || "",
            residence_duration: applicationData.residence_duration || "",
            associations: applicationData.associations || "",
            field_investigation_residence:
              applicationData.field_investigation_residence || "",
            field_investigation_workplace:
              applicationData.field_investigation_workplace || "",
            tele_verification_reachable:
              applicationData.tele_verification_reachable || "",
            tele_verification_accuracy:
              applicationData.tele_verification_accuracy || "",
            identity_verification_passed:
              applicationData.identity_verification_passed || false,
          };
        }

        // Calculate decision
        const decision = calculateLoanDecision(loanApp);

        // Create application item
        const appItem: ApplicationItem = {
          id: applicationData.application_id || Date.now().toString(),
          date: applicationData.timestamp || new Date().toISOString(),
          applicationData: loanApp,
          decision,
          application_complete: applicationData.currentQuestion >= 14, // Assuming 15 questions
        };

        setApplications([appItem]);
      } catch (localError) {
        console.error("Error loading from localStorage:", localError);
        setApplications([]);
      }
    };

    loadApplications();
  }, [supabase]);

  // Filter applications based on search query
  const filteredApplications = applications.filter((app) => {
    const searchString = searchQuery.toLowerCase();
    return (
      app.id.toLowerCase().includes(searchString) ||
      (app.applicationData.loan_amount || "")
        .toLowerCase()
        .includes(searchString) ||
      (app.applicationData.employment_type || "")
        .toLowerCase()
        .includes(searchString) ||
      (app.decision.approved ? "approved" : "rejected").includes(searchString)
    );
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Applications</h1>
        <div className="flex w-full md:w-auto">
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2 w-full md:w-64"
            icon={<Search className="h-4 w-4" />}
          />
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/video-banker">New Application</Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Loading your applications...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">
            Error loading applications
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button asChild>
            <Link href="/dashboard/video-banker">Start New Application</Link>
          </Button>
        </Card>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No applications match your search criteria"
              : "You haven't submitted any loan applications yet"}
          </p>
          <Button asChild>
            <Link href="/dashboard/video-banker">Start New Application</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <Link
              href={`/dashboard/loan-status?id=${application.id}`}
              key={application.id}
              className="block"
            >
              <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      Loan Application
                      {application.application_complete ? (
                        application.decision.approved ? (
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            Approved
                          </Badge>
                        ) : (
                          <Badge className="ml-2 bg-red-100 text-red-800">
                            Rejected
                          </Badge>
                        )
                      ) : (
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                          In Progress
                        </Badge>
                      )}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {new Date(application.date).toLocaleDateString()} •
                      Amount:
                      {application.applicationData.loan_amount
                        ? `₹${parseInt(application.applicationData.loan_amount.replace(/\D/g, "") || "0").toLocaleString()}`
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="mr-4 text-right hidden md:block">
                      <div className="text-sm text-muted-foreground">
                        Credit Score
                      </div>
                      <div className="font-medium">
                        {application.decision.score}/100
                      </div>
                    </div>
                    <div className="w-24 h-2 rounded-full overflow-hidden bg-gray-200">
                      <div
                        className={`h-full ${
                          application.decision.score >= 75
                            ? "bg-green-500"
                            : application.decision.score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${application.decision.score}%` }}
                      ></div>
                    </div>
                    <ArrowRight className="ml-2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
