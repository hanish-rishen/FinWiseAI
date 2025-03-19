import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LoanApplication {
  monthly_income: string;
  employment_type: string;
  credit_history: string;
  loan_amount: string;
  loan_tenure: string;
  existing_loans: string;
  collateral: string;
  residence_type: string;
  residence_duration: string;
  associations: string;
  field_investigation_residence: string;
  field_investigation_workplace: string;
  tele_verification_reachable: string;
  tele_verification_accuracy: string;
  identity_verification_passed?: boolean;
}

/**
 * Maps conversation indices to loan application fields
 * @param conversation Array of conversation responses
 * @returns Loan application object with properly mapped fields
 */
export function mapConversationToApplication(
  conversation: { response: string }[]
): LoanApplication {
  return {
    // Correct mapping based on conversation indices
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
    identity_verification_passed: false,
  };
}
