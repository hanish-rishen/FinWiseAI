"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Check, Clock, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { LoanApplication, calculateLoanDecision } from "@/lib/decision-engine";
import { Progress } from "@/components/ui/progress";

export default function LoanStatusPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadApplication = async () => {
      try {
        setLoading(true);

        // Try to get from DB first if we have an ID
        if (applicationId) {
          // Get current user
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            throw new Error("User not authenticated");
          }

          // Get application from database
          const { data, error } = await supabase
            .from("application")
            .select("*")
            .eq("application_id", applicationId)
            .eq("user_id", session.user.id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            // Convert to application format
            const loanApp: LoanApplication = {
              monthly_income: data.monthly_income || "",
              employment_type: data.employment_type || "",
              credit_history: data.credit_history || "",
              loan_amount: data.loan_amount || "",
              loan_tenure: data.loan_tenure || "",
              existing_loans: data.existing_loans || "",
              collateral: data.collateral || "",
              residence_type: data.residence_type || "",
              residence_duration: data.residence_duration || "",
              associations: data.associations || "",
              field_investigation_residence:
                data.field_investigation_residence || "",
              field_investigation_workplace:
                data.field_investigation_workplace || "",
              tele_verification_reachable:
                data.tele_verification_reachable || "",
              tele_verification_accuracy: data.tele_verification_accuracy || "",
              identity_verification_passed:
                data.identity_verification_passed || false,
            };

            const decision = calculateLoanDecision(loanApp);

            setApplication({
              id: data.application_id,
              date: data.created_at,
              loanApp,
              decision,
              application_complete: data.application_complete,
            });

            setLoading(false);
            return;
          }
        }

        // Fallback to localStorage
        const savedApplication = localStorage.getItem(
          "videobanker_application"
        );
        if (savedApplication) {
          const applicationData = JSON.parse(savedApplication);

          // Extract data from localStorage format
          let loanApp: LoanApplication;

          if (applicationData.conversation) {
            // Fix indices to match actual conversation array order
            const conversation = applicationData.conversation;
            loanApp = {
              monthly_income: conversation[0]?.response || "",
              employment_type: conversation[1]?.response || "",
              credit_history: conversation[2]?.response || "",
              loan_amount: conversation[3]?.response || "",
              loan_tenure: conversation[4]?.response || "",
              existing_loans: conversation[5]?.response || "",
              collateral: conversation[6]?.response || "",
              residence_type: conversation[7]?.response || "",
              residence_duration: conversation[8]?.response || "",
              associations: conversation[9]?.response || "",
              field_investigation_residence: conversation[10]?.response || "",
              field_investigation_workplace: conversation[11]?.response || "",
              tele_verification_reachable: conversation[12]?.response || "",
              tele_verification_accuracy: conversation[13]?.response || "",
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

          const decision = calculateLoanDecision(loanApp);

          setApplication({
            id: applicationData.application_id || "local",
            date: applicationData.timestamp || new Date().toISOString(),
            loanApp,
            decision,
            application_complete: applicationData.currentQuestion >= 13, // 0-based index
          });
        } else {
          setError("Application not found");
        }
      } catch (error) {
        console.error("Error loading application:", error);
        setError("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [applicationId, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <Card className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading application details...
          </p>
        </Card>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <Card className="p-8 text-center">
          <X className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Application not found</h3>
          <p className="text-muted-foreground mb-4">
            {error || "The application you're looking for doesn't exist"}
          </p>
          <Button asChild>
            <Link href="/dashboard/applications">View All Applications</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const { loanApp, decision, application_complete } = application;

  // Format the loan amount nicely if available
  const formattedLoanAmount = loanApp.loan_amount
    ? `₹${parseInt(loanApp.loan_amount.replace(/\D/g, "") || "0").toLocaleString()}`
    : "Not specified";

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="mb-4">
        <Link
          href="/dashboard/applications"
          className="text-blue-600 hover:underline flex items-center"
        >
          <ChevronRight className="mr-1 h-4 w-4 rotate-180" />
          Back to Applications
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                Loan Application Status
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Applied on {new Date(application.date).toLocaleDateString()}
              </p>
            </div>

            {application_complete ? (
              decision.approved ? (
                <Badge className="px-3 py-1 bg-green-100 text-green-800">
                  Approved
                </Badge>
              ) : (
                <Badge className="px-3 py-1 bg-red-100 text-red-800">
                  Rejected
                </Badge>
              )
            ) : (
              <Badge className="px-3 py-1 bg-yellow-100 text-yellow-800">
                In Progress
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Application Details</h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Monthly Income:</p>
                  <p>{loanApp.monthly_income || "Not provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Employment Type:</p>
                  <p>{loanApp.employment_type || "Not provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Credit History:</p>
                  <p>{loanApp.credit_history || "Not provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Loan Amount:</p>
                  <p>{formattedLoanAmount}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Loan Tenure:</p>
                  <p>{loanApp.loan_tenure || "Not provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Existing Loans:</p>
                  <p>{loanApp.existing_loans || "Not provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Collateral:</p>
                  <p>{loanApp.collateral || "Not provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Residence Type:</p>
                  <p>{loanApp.residence_type || "Not provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Identity Verified:</p>
                  <p>{loanApp.identity_verification_passed ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Decision Details</h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Credit Score</span>
                  <span className="font-medium">{decision.score}/100</span>
                </div>
                <Progress
                  value={decision.score}
                  className={`h-2 ${
                    decision.score >= 75
                      ? "progress-green"
                      : decision.score >= 60
                        ? "progress-yellow"
                        : "progress-red"
                  }`}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  {decision.income_factor >= 0 ? (
                    <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="text-red-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">Income Assessment</p>
                    <p className="text-foreground text-sm">
                      {decision.income_factor >= 0
                        ? "Your income is sufficient for this loan amount."
                        : "Your income may be insufficient for this loan amount."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  {decision.credit_factor >= 0 ? (
                    <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="text-red-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">Credit Assessment</p>
                    <p className="text-foreground text-sm">
                      {decision.credit_factor >= 0
                        ? "Your credit history is favorable."
                        : "Your credit history needs improvement."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  {decision.stability_factor >= 0 ? (
                    <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="text-red-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">Stability Assessment</p>
                    <p className="text-foreground text-sm">
                      {decision.stability_factor >= 0
                        ? "Your employment and residence history shows stability."
                        : "We'd like to see more stability in employment or residence."}
                    </p>
                  </div>
                </div>

                {application_complete && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-medium mb-2">Final Decision</h4>
                    <p className="text-foreground">
                      {decision.approved
                        ? "Congratulations! Your loan application has been approved. Our representative will contact you shortly with the next steps."
                        : "We regret to inform you that we cannot approve your loan application at this time. Please consider reapplying after addressing the issues mentioned above."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!application_complete && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-medium">Application Incomplete</span>
              </div>
              <p className="mt-2 text-foreground mb-4">
                You haven't completed all the required questions for this
                application.
              </p>
              <Button asChild>
                <Link href="/dashboard/video-banker">Continue Application</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/applications">Back to All Applications</Link>
        </Button>

        {decision.approved && (
          <Button className="bg-green-600 hover:bg-green-700">
            Proceed to Loan Disbursement
          </Button>
        )}
      </div>
    </div>
  );
}
