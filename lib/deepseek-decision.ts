import { LoanApplication, LoanDecision } from "./decision-engine";

export interface DeepSeekResponse {
  decision: LoanDecision;
  reasoning: string;
}

/**
 * Get loan decision using DeepSeek R1 model via OpenRouter
 * @param application The loan application data
 * @param streamCallback Optional callback function to receive streaming updates
 */
export async function getDeepSeekDecision(
  application: LoanApplication,
  streamCallback?: (chunk: string) => void
): Promise<DeepSeekResponse> {
  try {
    const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key not found");
    }

    // Prepare the prompt for DeepSeek R1
    const prompt = `
You are a loan approval AI assistant. Your task is to evaluate this loan application and decide whether to approve it.

Application data:
${JSON.stringify(application, null, 2)}

Decision engine scoring system:
- Monthly income (0-25 points)
  * ≥100,000: 25 points
  * ≥70,000: 20 points
  * ≥50,000: 15 points
  * ≥30,000: 10 points
  * ≥20,000: 5 points
  * <20,000: 0 points

- Employment type (0-15 points)
  * Government/public sector: 15 points
  * Permanent/full-time: 12 points
  * Private sector: 10 points
  * Business owner: 8 points
  * Self-employed: 6 points
  * Contract/temporary: 4 points
  * Part-time: 2 points
  * Unemployed: 0 points

- Credit history (0-20 points)
  * Excellent: 20 points
  * Good: 15 points
  * Fair: 10 points
  * Poor: 5 points
  * No credit history: 8 points
  * Default/bankruptcy: 0 points

- Loan amount to annual income ratio (0-10 points)
  * Ratio ≤1: 10 points
  * Ratio ≤2: 8 points
  * Ratio ≤3: 6 points
  * Ratio ≤4: 4 points
  * Ratio ≤5: 2 points
  * Ratio >5: 0 points

- Existing loans (0-10 points)
  * None: 10 points
  * One loan: 8 points
  * Two loans: 6 points
  * Three loans: 4 points
  * Four loans: 2 points
  * Five or more: 0 points

<think>
1. Calculate the applicant's score for each factor
2. Add the scores to get a total score (out of 80)
3. Decide approval based on total score:
   - 65+ points: Approve with low interest rate
   - 50-64 points: Approve with moderate interest rate
   - 40-49 points: Approve with high interest rate
   - Below 40: Reject
4. Consider other factors like residence stability and identity verification
</think>

Return your decision as a valid JSON object with this exact structure:
\`\`\`json
{
  "decision": {
    "approved": true/false,
    "reason": "Clear reason for decision",
    "interestRate": 10.5,
    "maxAmount": 500000,
    "tenure": 5,
    "score": 75,
    "riskLevel": "low/medium/high/very high",
    "conditions": ["condition1", "condition2"]
  },
  "reasoning": "Your step-by-step analysis"
}
\`\`\`
`;

    // If no streaming is requested, use normal fetch
    if (!streamCallback) {
      console.log(
        "Sending regular request to OpenRouter with DeepSeek R1 Zero..."
      );

      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://finwiseai.com",
              "X-Title": "FinWise AI",
            },
            body: JSON.stringify({
              model: "deepseek/deepseek-r1-zero:free", // Correct model ID
              messages: [{ role: "user", content: prompt }],
              temperature: 0.2,
              max_tokens: 2000,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("OpenRouter API error:", errorData);
          throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const responseData = await response.json();
        const content = responseData.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error("No response content from OpenRouter");
        }

        // Extract JSON from response content
        const jsonMatch =
          content.match(/```json\n([\s\S]*?)\n```/) ||
          content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
          content.match(/{[\s\S]*"decision"[\s\S]*}/);

        if (!jsonMatch) {
          console.error("Could not extract JSON from response:", content);
          throw new Error("Could not parse decision JSON from response");
        }

        let jsonContent = jsonMatch[1] || jsonMatch[0];

        try {
          const decisionData = JSON.parse(
            jsonContent.trim()
          ) as DeepSeekResponse;
          return decisionData;
        } catch (jsonError) {
          console.error("Error parsing decision JSON:", jsonError);
          throw new Error("Invalid JSON format in API response");
        }
      } catch (apiError) {
        console.error("API call failed:", apiError);
        throw apiError;
      }
    }
    // Handle streaming response
    else {
      console.log(
        "Sending streaming request to OpenRouter with DeepSeek R1 Zero..."
      );

      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://finwiseai.com",
              "X-Title": "FinWise AI",
            },
            body: JSON.stringify({
              model: "deepseek/deepseek-r1-zero:free", // Correct model ID
              messages: [{ role: "user", content: prompt }],
              temperature: 0.2,
              max_tokens: 2000,
              stream: true, // Enable streaming
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("OpenRouter streaming API error:", errorData);
          throw new Error(`OpenRouter API error: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        // Set up streaming response handling
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedContent = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Process each chunk
            const lines = chunk
              .split("\n")
              .filter(
                (line) => line.trim() !== "" && line.trim() !== "data: [DONE]"
              )
              .map((line) => line.replace(/^data: /, ""));

            for (const line of lines) {
              try {
                const parsedLine = JSON.parse(line);
                const content = parsedLine.choices?.[0]?.delta?.content || "";

                if (content) {
                  accumulatedContent += content;
                  streamCallback(content);
                }
              } catch (e) {
                // Silent error for parse failures on individual chunks
              }
            }
          }

          // After streaming is complete, process accumulated content
          console.log("Streaming complete, processing accumulated content");

          // Try all extraction methods
          const extractedResponse =
            extractResponseFromContent(accumulatedContent);
          if (extractedResponse) {
            return extractedResponse;
          }

          // If we get here, we couldn't extract a valid response
          throw new Error(
            "Could not extract valid decision from streamed response"
          );
        } catch (streamError) {
          console.error("Error processing stream:", streamError);
          throw streamError;
        }
      } catch (apiError) {
        console.error("Streaming API call failed:", apiError);
        throw apiError;
      }
    }
  } catch (error) {
    console.error("Error getting AI decision:", error);
    // Fallback to local decision engine if API fails
    return await getFallbackDecision(application);
  }
}

/**
 * Helper function to extract response from accumulated content
 */
function extractResponseFromContent(content: string): DeepSeekResponse | null {
  // 1. Try to find JSON blocks with regex
  const jsonMatch =
    content.match(/```json\n([\s\S]*?)\n```/) ||
    content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

  // 2. If JSON blocks found, parse them
  if (jsonMatch && jsonMatch[1]) {
    try {
      const jsonContent = jsonMatch[1].trim();
      console.log(
        "Found JSON with regex:",
        jsonContent.substring(0, 100) + "..."
      );
      const parsedContent = JSON.parse(jsonContent);
      return parsedContent as DeepSeekResponse;
    } catch (jsonError) {
      console.warn("Could not parse JSON from regex match:", jsonError);
      // Continue to the next approach
    }
  }

  // 3. Try to find any JSON object containing decision
  const decisionObjectMatch = content.match(/{[\s\S]*?"decision"[\s\S]*?}/);
  if (decisionObjectMatch) {
    try {
      const jsonContent = decisionObjectMatch[0];
      console.log(
        "Found JSON object match:",
        jsonContent.substring(0, 100) + "..."
      );
      const parsedContent = JSON.parse(jsonContent);
      return parsedContent as DeepSeekResponse;
    } catch (jsonError) {
      console.warn("Could not parse decision object match:", jsonError);
      // Continue to the next approach
    }
  }

  // 4. Last resort: AI-assisted JSON extraction
  console.log("Trying AI-assisted JSON extraction");
  try {
    // Find any text that looks like JSON structure (key-value pairs)
    const potentialJSON = extractPotentialJSON(content);
    if (potentialJSON) {
      return {
        decision: {
          approved:
            potentialJSON.approved ?? potentialJSON.decision?.approved ?? false,
          reason:
            potentialJSON.reason ??
            potentialJSON.decision?.reason ??
            "No clear reason provided",
          interestRate: parseFloat(
            potentialJSON.interestRate ??
              potentialJSON.decision?.interestRate ??
              0
          ),
          maxAmount: parseInt(
            potentialJSON.maxAmount ?? potentialJSON.decision?.maxAmount ?? 0
          ),
          tenure: parseInt(
            potentialJSON.tenure ?? potentialJSON.decision?.tenure ?? 0
          ),
          score: parseInt(
            potentialJSON.score ?? potentialJSON.decision?.score ?? 0
          ),
          riskLevel:
            potentialJSON.riskLevel ??
            potentialJSON.decision?.riskLevel ??
            "medium",
          conditions:
            potentialJSON.conditions ??
            potentialJSON.decision?.conditions ??
            [],
        },
        reasoning:
          potentialJSON.reasoning ?? "Decision generated from streamed content",
      };
    }
  } catch (extractError) {
    console.warn("AI-assisted JSON extraction failed:", extractError);
  }

  // 5. If everything fails, create a response from the accumulated content
  console.log("Creating synthetic response from accumulated content");

  // Extract key insights from the text
  const approved =
    content.toLowerCase().includes("approve") &&
    !content.toLowerCase().includes("not approve") &&
    !content.toLowerCase().includes("reject");

  const scoreMatch = content.match(/score[:\s]*(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : approved ? 70 : 35;

  const riskLevel =
    score >= 75
      ? "low"
      : score >= 60
        ? "medium"
        : score >= 40
          ? "high"
          : "very high";

  const amountMatch = content.match(/amount[:\s]*[₹$]?(\d+[,\d]*)/i);
  const maxAmount = amountMatch
    ? parseInt(amountMatch[1].replace(/,/g, ""))
    : 0;

  const rateMatch = content.match(/rate[:\s]*(\d+\.?\d*)/i);
  const interestRate = rateMatch
    ? parseFloat(rateMatch[1])
    : approved
      ? 10.5
      : 0;

  // Create synthetic decision
  return {
    decision: {
      approved,
      reason: extractReason(content, approved),
      interestRate,
      maxAmount,
      tenure: 5,
      score,
      riskLevel,
      conditions: extractConditions(content),
    },
    reasoning: content,
  };
}

/**
 * Extract potential JSON from text content
 */
function extractPotentialJSON(content: string): any {
  // Try to find anything that looks like JSON
  try {
    // Look for decision object
    if (content.includes('"decision"') || content.includes("'decision'")) {
      const startIdx = content.indexOf("{");
      const endIdx = content.lastIndexOf("}");
      if (startIdx >= 0 && endIdx > startIdx) {
        const jsonCandidate = content.substring(startIdx, endIdx + 1);
        return JSON.parse(jsonCandidate);
      }
    }

    // Attempt to extract key-value pairs
    const approved = /approved["\s:]+(\w+)/i.exec(content);
    const reason = /reason["\s:]+["']([^"']+)["']/i.exec(content);
    const interestRate = /interestRate["\s:]+([0-9.]+)/i.exec(content);
    const maxAmount = /maxAmount["\s:]+([0-9]+)/i.exec(content);
    const score = /score["\s:]+([0-9]+)/i.exec(content);
    const riskLevel = /riskLevel["\s:]+["']([^"']+)["']/i.exec(content);

    return {
      approved: approved && approved[1].toLowerCase() === "true",
      reason: reason && reason[1],
      interestRate: interestRate && interestRate[1],
      maxAmount: maxAmount && maxAmount[1],
      score: score && score[1],
      riskLevel: riskLevel && riskLevel[1],
    };
  } catch (e) {
    return null;
  }
}

/**
 * Extract a reason from text content
 */
function extractReason(content: string, approved: boolean): string {
  // Try to find a sentence about the reason
  const reasonRegex = approved
    ? /(?:approved|accepted|qualified).*?(?:because|due to|based on)([^.!?]*)/i
    : /(?:rejected|denied|not approved).*?(?:because|due to|based on)([^.!?]*)/i;

  const match = reasonRegex.exec(content);
  if (match && match[1]) {
    return match[1].trim();
  }

  return approved
    ? "Application meets our lending criteria based on the provided information."
    : "Application does not meet the minimum requirements for loan approval.";
}

/**
 * Extract conditions from text content
 */
function extractConditions(content: string): string[] {
  const conditions: string[] = [];

  // Look for lists or conditions
  const conditionSection = content.match(/conditions?:?([^]*)(?:$|reasoning)/i);

  if (conditionSection && conditionSection[1]) {
    // Try to extract bullet points or numbered items
    const bulletPoints = conditionSection[1].split(
      /(?:\r?\n|\r)(?:[-*•]|\d+\.)\s*/
    );

    for (const point of bulletPoints) {
      const trimmed = point.trim();
      if (trimmed && trimmed.length > 10) {
        // Avoid empty or too short conditions
        conditions.push(trimmed);
      }
    }
  }

  // If no explicit conditions found but the loan is approved, add standard ones
  if (conditions.length === 0 && content.toLowerCase().includes("approve")) {
    conditions.push("Verification of employment status and income");
    conditions.push("Submission of valid ID proof and address verification");
  }

  return conditions;
}

/**
 * Fallback function to use local decision engine if API fails
 */
async function getFallbackDecision(
  application: LoanApplication
): Promise<DeepSeekResponse> {
  // Import dynamically to avoid server-side issues
  const { calculateLoanDecision } = await import("./decision-engine");

  console.log("Using fallback local decision engine");
  const decision = calculateLoanDecision(application);

  return {
    decision,
    reasoning:
      "Decision made using local decision engine due to API error. The system analyzed your application data including income, employment type, credit history, and existing loans to determine your eligibility. Based on our automated scoring system, the application was evaluated for risk and affordability factors.",
  };
}
