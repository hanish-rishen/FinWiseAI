/**
 * Decision Engine for loan approval
 * Converts application data to a loan decision
 */

export interface LoanApplication {
  monthly_income?: string;
  employment_type?: string;
  credit_history?: string;
  loan_amount?: string;
  loan_tenure?: string;
  existing_loans?: string;
  collateral?: string;
  residence_type?: string;
  residence_duration?: string;
  associations?: string;
  field_investigation_residence?: string;
  field_investigation_workplace?: string;
  tele_verification_reachable?: string;
  tele_verification_accuracy?: string;
  identity_verification_passed?: boolean;
}

export interface LoanDecision {
  approved: boolean;
  reason: string;
  interestRate?: number;
  maxAmount?: number;
  tenure?: number;
  score: number;
  riskLevel: "low" | "medium" | "high" | "very high";
  conditions?: string[];
}

/**
 * Score categories for each parameter
 */
const scoreFactors = {
  // Higher income = higher score (0-25)
  monthlyIncome: (value: string): number => {
    const income = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(income)) return 0;
    if (income >= 100000) return 25;
    if (income >= 70000) return 20;
    if (income >= 50000) return 15;
    if (income >= 30000) return 10;
    if (income >= 20000) return 5;
    return 0;
  },

  // Employment type scoring (0-15)
  employmentType: (value: string): number => {
    const type = value.toLowerCase();
    if (type.includes("government") || type.includes("public sector"))
      return 15;
    if (type.includes("permanent") || type.includes("full-time")) return 12;
    if (type.includes("private sector")) return 10;
    if (type.includes("business owner")) return 8;
    if (type.includes("self-employed")) return 6;
    if (type.includes("contract") || type.includes("temporary")) return 4;
    if (type.includes("part-time")) return 2;
    if (type.includes("unemployed")) return 0;
    return 5; // Default for unclassified responses
  },

  // Credit history scoring (0-20)
  creditHistory: (value: string): number => {
    const history = value.toLowerCase();
    if (history.includes("excellent")) return 20;
    if (history.includes("good")) return 15;
    if (history.includes("fair")) return 10;
    if (history.includes("poor")) return 5;
    if (history.includes("no credit history")) return 8; // Better than poor but not as good as fair
    if (history.includes("default") || history.includes("bankruptcy")) return 0;
    return 10; // Default for unclassified responses
  },

  // Loan amount to income ratio (0-10)
  loanAmountRatio: (income: string, loanAmount: string): number => {
    const monthlyIncome = parseFloat(income.replace(/[^0-9.]/g, ""));
    const amount = parseFloat(loanAmount.replace(/[^0-9.]/g, ""));

    if (isNaN(monthlyIncome) || isNaN(amount) || monthlyIncome === 0) return 0;

    const ratio = amount / (monthlyIncome * 12); // Annual income

    if (ratio <= 1) return 10; // Loan amount less than annual income
    if (ratio <= 2) return 8;
    if (ratio <= 3) return 6;
    if (ratio <= 4) return 4;
    if (ratio <= 5) return 2;
    return 0; // Loan amount > 5x annual income
  },

  // Existing loans (0-10)
  existingLoans: (value: string): number => {
    const loans = value.toLowerCase();
    if (loans.includes("none") || loans.includes("no loans")) return 10;
    if (loans.includes("one") || loans.includes("1 loan")) return 8;
    if (loans.includes("two") || loans.includes("2 loan")) return 6;
    if (loans.includes("three") || loans.includes("3 loan")) return 4;
    if (loans.includes("four") || loans.includes("4 loan")) return 2;
    if (
      loans.includes("five") ||
      loans.includes("5 loan") ||
      loans.includes("multiple") ||
      loans.includes("many")
    )
      return 0;
    return 5; // Default for unclassified responses
  },

  // Collateral (0-5)
  collateral: (value: string): number => {
    const coll = value.toLowerCase();
    if (
      coll.includes("property") ||
      coll.includes("real estate") ||
      coll.includes("house") ||
      coll.includes("land")
    )
      return 5;
    if (coll.includes("vehicle") || coll.includes("car")) return 4;
    if (coll.includes("gold") || coll.includes("jewelry")) return 3;
    if (coll.includes("fixed deposit") || coll.includes("insurance")) return 2;
    if (
      coll.includes("stock") ||
      coll.includes("shares") ||
      coll.includes("investment")
    )
      return 1;
    if (coll.includes("none") || coll.includes("no collateral")) return 0;
    return 0; // Default for unclassified responses
  },

  // Residence type (0-5)
  residenceType: (value: string): number => {
    const residence = value.toLowerCase();
    if (residence.includes("own") || residence.includes("owned")) return 5;
    if (residence.includes("mortgage")) return 3;
    if (residence.includes("rent") || residence.includes("rented")) return 2;
    if (residence.includes("family") || residence.includes("parents")) return 1;
    if (residence.includes("temporary") || residence.includes("hostel"))
      return 0;
    return 2; // Default for unclassified responses
  },

  // Residence duration (0-5)
  residenceDuration: (value: string): number => {
    const duration = value.toLowerCase();
    if (
      duration.includes("more than 5 years") ||
      duration.includes("5+ years") ||
      duration.includes("over 5")
    )
      return 5;
    if (
      duration.includes("3-5 years") ||
      duration.includes("4 years") ||
      duration.includes("5 years")
    )
      return 4;
    if (
      duration.includes("1-3 years") ||
      duration.includes("2 years") ||
      duration.includes("3 years")
    )
      return 3;
    if (duration.includes("6-12 months") || duration.includes("1 year"))
      return 2;
    if (duration.includes("3-6 months") || duration.includes("6 months"))
      return 1;
    if (duration.includes("less than 3 months")) return 0;
    return 3; // Default for unclassified responses
  },

  // Field investigation and verification (0-5)
  verification: (
    residence: string,
    workplace: string,
    reachable: string,
    accuracy: string
  ): number => {
    let score = 0;

    // Residence verification
    if (
      residence.toLowerCase().includes("verified") ||
      residence.toLowerCase().includes("positive")
    ) {
      score += 1;
    }

    // Workplace verification
    if (
      workplace.toLowerCase().includes("verified") ||
      workplace.toLowerCase().includes("positive")
    ) {
      score += 1;
    }

    // Reachability
    if (
      reachable.toLowerCase().includes("yes") ||
      reachable.toLowerCase().includes("reachable")
    ) {
      score += 1;
    }

    // Information accuracy
    if (
      accuracy.toLowerCase().includes("accurate") ||
      accuracy.toLowerCase().includes("correct") ||
      accuracy.toLowerCase().includes("matching")
    ) {
      score += 2;
    } else if (accuracy.toLowerCase().includes("mostly")) {
      score += 1;
    }

    return score;
  },

  // Identity verification (0-5)
  identityVerification: (passed: boolean): number => {
    return passed ? 5 : 0;
  },
};

/**
 * Calculate loan approval score based on application data
 * @param application Loan application data
 * @returns Score between 0-100
 */
const calculateScore = (application: LoanApplication): number => {
  let score = 0;

  // Calculate score for each factor
  if (application.monthly_income) {
    score += scoreFactors.monthlyIncome(application.monthly_income);
  }

  if (application.employment_type) {
    score += scoreFactors.employmentType(application.employment_type);
  }

  if (application.credit_history) {
    score += scoreFactors.creditHistory(application.credit_history);
  }

  if (application.monthly_income && application.loan_amount) {
    score += scoreFactors.loanAmountRatio(
      application.monthly_income,
      application.loan_amount
    );
  }

  if (application.existing_loans) {
    score += scoreFactors.existingLoans(application.existing_loans);
  }

  if (application.collateral) {
    score += scoreFactors.collateral(application.collateral);
  }

  if (application.residence_type) {
    score += scoreFactors.residenceType(application.residence_type);
  }

  if (application.residence_duration) {
    score += scoreFactors.residenceDuration(application.residence_duration);
  }

  // Verification scores
  if (
    application.field_investigation_residence &&
    application.field_investigation_workplace &&
    application.tele_verification_reachable &&
    application.tele_verification_accuracy
  ) {
    score += scoreFactors.verification(
      application.field_investigation_residence,
      application.field_investigation_workplace,
      application.tele_verification_reachable,
      application.tele_verification_accuracy
    );
  }

  // Identity verification
  if (application.identity_verification_passed !== undefined) {
    score += scoreFactors.identityVerification(
      application.identity_verification_passed
    );
  }

  return Math.min(100, score); // Cap at 100
};

/**
 * Determine interest rate based on score
 */
const determineInterestRate = (score: number): number => {
  if (score >= 90) return 7.5;
  if (score >= 80) return 8.5;
  if (score >= 70) return 10.0;
  if (score >= 60) return 12.0;
  if (score >= 50) return 14.0;
  return 16.0; // High risk
};

/**
 * Determine risk level based on score
 */
const determineRiskLevel = (
  score: number
): "low" | "medium" | "high" | "very high" => {
  if (score >= 75) return "low";
  if (score >= 60) return "medium";
  if (score >= 40) return "high";
  return "very high";
};

/**
 * Calculate approval decision based on application data
 */
export const calculateLoanDecision = (
  application: LoanApplication
): LoanDecision => {
  // Calculate score
  const score = calculateScore(application);

  // Determine risk level
  const riskLevel = determineRiskLevel(score);

  // Parse loan amount
  let requestedAmount = 0;
  try {
    requestedAmount = parseFloat(
      application.loan_amount?.replace(/[^0-9.]/g, "") || "0"
    );
  } catch (e) {
    requestedAmount = 0;
  }

  // Parse monthly income
  let monthlyIncome = 0;
  try {
    monthlyIncome = parseFloat(
      application.monthly_income?.replace(/[^0-9.]/g, "") || "0"
    );
  } catch (e) {
    monthlyIncome = 0;
  }

  // Calculate max allowed loan amount (3x annual income for high scores, less for lower)
  const annualIncome = monthlyIncome * 12;
  let maxAmount = annualIncome * 3; // Base max

  if (score < 75) maxAmount = annualIncome * 2.5;
  if (score < 65) maxAmount = annualIncome * 2;
  if (score < 55) maxAmount = annualIncome * 1.5;
  if (score < 45) maxAmount = annualIncome * 1;
  if (score < 35) maxAmount = annualIncome * 0.5;

  // Determine approval
  const approved = score >= 60;

  // Determine reason
  let reason = "";
  if (approved) {
    reason =
      score >= 80
        ? "Excellent credit profile with strong financial stability."
        : "Good credit profile with adequate financial capacity.";
  } else {
    if (score >= 50) {
      reason =
        "Insufficient credit score. Consider applying for a smaller loan amount or providing additional collateral.";
    } else if (score >= 40) {
      reason =
        "High credit risk. Significant concerns with repayment capacity.";
    } else {
      reason =
        "Very high credit risk. Application does not meet minimum lending criteria.";
    }
  }

  // Determine interest rate
  const interestRate = determineInterestRate(score);

  // Determine conditions
  const conditions: string[] = [];

  if (approved) {
    if (score < 75) {
      conditions.push("Additional documentation may be required");
    }

    if (riskLevel === "medium") {
      conditions.push("Collateral documentation required");
      conditions.push("Income verification required");
    }

    if (!application.identity_verification_passed) {
      conditions.push("In-person identity verification required");
    }
  }

  // Parse tenure from string input
  let tenure = 0;
  try {
    const tenureStr = application.loan_tenure || "";
    if (tenureStr.includes("year")) {
      const match = tenureStr.match(/(\d+)/);
      if (match && match[1]) {
        tenure = parseInt(match[1], 10);
      }
    } else if (tenureStr.includes("month")) {
      const match = tenureStr.match(/(\d+)/);
      if (match && match[1]) {
        tenure = Math.ceil(parseInt(match[1], 10) / 12);
      }
    }
  } catch (e) {
    tenure = 0;
  }

  // Cap max amount to requested amount
  maxAmount = Math.min(maxAmount, requestedAmount || maxAmount);

  // Return decision
  return {
    approved,
    reason,
    interestRate,
    maxAmount: Math.round(maxAmount),
    tenure: tenure || undefined,
    score,
    riskLevel,
    conditions: conditions.length > 0 ? conditions : undefined,
  };
};
