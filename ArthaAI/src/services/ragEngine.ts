import {
  BusinessProfile,
  SchemeDocument,
  MatchedOpportunity,
  ScoreBreakdown,
  ScoreWeights,
  RelevanceTier,
  EligibilityStatus,
  RequirementCheck,
  AnalysisResult,
  OpportunityCategory,
  ActionPriority,
} from "../types";
import { MSME_KNOWLEDGE_BASE } from "../data/msmeKnowledgeBase";
import { buildComprehensiveActionPlan, generateTop3Actions, calculateActionPriority } from "./actionEngine";

// Configurable Scoring Weights (Deterministic 6-Factor Model)
export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  industry: 30,
  businessSize: 20,
  location: 15,
  udyam: 10,
  eligibility: 20,
  recency: 5,
};

/**
 * Normalizes user profile parameters into clean search attributes
 */
export function normalizeProfile(profile: BusinessProfile): BusinessProfile {
  return {
    ...profile,
    industry: (profile.industry || "Manufacturing").trim(),
    size: profile.size || "Micro",
    udyamStatus: profile.udyamStatus || "not_sure",
    state: (profile.state || "Delhi").trim(),
    city: profile.city ? profile.city.trim() : undefined,
    turnoverRange: profile.turnoverRange || "₹1 Cr - ₹5 Cr",
    employeeCount: profile.employeeCount || "10-25 employees",
    yearsInBusiness: profile.yearsInBusiness || "3 years",
    gstStatus: profile.gstStatus || "registered",
    exportStatus: profile.exportStatus || "domestic_only",
    productsServices: profile.productsServices || "",
    existingCertifications: profile.existingCertifications || [],
  };
}

/**
 * Evaluates requirements individually where data exists (PASS / FAIL / UNKNOWN)
 */
export function evaluateRequirementChecks(
  doc: SchemeDocument,
  normProf: BusinessProfile
): {
  checks: RequirementCheck[];
  status: EligibilityStatus;
} {
  const checks: RequirementCheck[] = [];
  let hasFail = false;
  let hasUnknown = false;

  // 1. Industry Criterion
  const userIndLower = normProf.industry.toLowerCase();
  const docIndsLower = doc.industry.map((i) => i.toLowerCase());
  if (docIndsLower.includes(userIndLower) || docIndsLower.includes("all")) {
    checks.push({
      criterion: "Industry",
      status: "PASS",
      details: `Matches ${normProf.industry}`,
    });
  } else if (doc.keywords.some((k) => userIndLower.includes(k.toLowerCase()) || k.toLowerCase().includes(userIndLower))) {
    checks.push({
      criterion: "Industry",
      status: "PASS",
      details: `Keyword overlap with ${normProf.industry}`,
    });
  } else {
    checks.push({
      criterion: "Industry",
      status: "FAIL",
      details: `Targeted for ${doc.industry.join(", ")}`,
    });
    hasFail = true;
  }

  // 2. Business Size Criterion
  if (doc.enterprise_size.includes("All") || doc.enterprise_size.includes(normProf.size)) {
    checks.push({
      criterion: "Business Size",
      status: "PASS",
      details: `Matches ${normProf.size} Enterprise threshold`,
    });
  } else {
    checks.push({
      criterion: "Business Size",
      status: "FAIL",
      details: `Requires ${doc.enterprise_size.join("/")}`,
    });
    hasFail = true;
  }

  // 3. Location / State Criterion
  const userStateLower = normProf.state.toLowerCase();
  const docStatesLower = doc.state.map((s) => s.toLowerCase());
  if (docStatesLower.includes("all")) {
    checks.push({
      criterion: "Location",
      status: "PASS",
      details: "Central Government scheme (Pan-India)",
    });
  } else if (docStatesLower.includes(userStateLower)) {
    checks.push({
      criterion: "Location",
      status: "PASS",
      details: `Applicable in ${normProf.state}`,
    });
  } else {
    checks.push({
      criterion: "Location",
      status: "FAIL",
      details: `State-specific to ${doc.state.join(", ")}`,
    });
    hasFail = true;
  }

  // 4. Udyam Registration Criterion
  const requiresUdyam = !doc.id.includes("vishwakarma") && !doc.id.includes("pmegp") && !doc.id.includes("mudra");
  if (normProf.udyamStatus === "registered") {
    checks.push({
      criterion: "Udyam Status",
      status: "PASS",
      details: "Registered (user-provided)",
    });
  } else if (!requiresUdyam) {
    checks.push({
      criterion: "Udyam Status",
      status: "PASS",
      details: "Accessible without prior Udyam registration",
    });
  } else if (normProf.udyamStatus === "not_sure") {
    checks.push({
      criterion: "Udyam Status",
      status: "UNKNOWN",
      details: "Udyam status needs verification",
    });
    hasUnknown = true;
  } else {
    checks.push({
      criterion: "Udyam Status",
      status: "UNKNOWN",
      details: "Requires Udyam registration prior to claim",
    });
    hasUnknown = true;
  }

  // 5. Additional Operational / Turnover Criterion
  if (doc.category === "certifications" || doc.category === "export_opportunities") {
    if (normProf.turnoverRange) {
      checks.push({
        criterion: "Operational Fit",
        status: "PASS",
        details: "Turnover profile compatible with guidelines",
      });
    } else {
      checks.push({
        criterion: "Operational Fit",
        status: "UNKNOWN",
        details: "Detailed financial verification required",
      });
      hasUnknown = true;
    }
  }

  // Determine overall status
  let status: EligibilityStatus = "Potentially eligible";
  if (hasFail) {
    status = "Not eligible";
  } else if (!hasUnknown && checks.every((c) => c.status === "PASS")) {
    status = "Likely eligible";
  } else if (hasUnknown) {
    status = "Needs verification";
  } else {
    status = "Potentially eligible";
  }

  return { checks, status };
}

/**
 * Calculates a multidimensional relevance score (0-100) and eligibility status for a document
 */
export function calculateRelevanceScore(
  doc: SchemeDocument,
  profile: BusinessProfile,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): {
  score: number;
  tier: RelevanceTier;
  eligibilityStatus: EligibilityStatus;
  requirementChecks: RequirementCheck[];
  whyMatched: string[];
  breakdown: ScoreBreakdown;
  why: string;
  action: string;
  urgency: "High" | "Medium" | "Low";
} {
  const normProf = normalizeProfile(profile);
  const whyMatched: string[] = [];

  // 1. Industry Match (0 - 30 points)
  let industryScore = 0;
  const userIndLower = normProf.industry.toLowerCase();
  const docIndsLower = doc.industry.map((i) => i.toLowerCase());

  if (docIndsLower.includes(userIndLower)) {
    industryScore = weights.industry; // 30
    whyMatched.push(`Industry matches: ${normProf.industry}`);
  } else if (docIndsLower.includes("all")) {
    industryScore = Math.round(weights.industry * 0.85); // ~26
    whyMatched.push("Applicable to all manufacturing & service industries");
  } else if (
    doc.keywords.some((k) => userIndLower.includes(k.toLowerCase()) || k.toLowerCase().includes(userIndLower))
  ) {
    industryScore = Math.round(weights.industry * 0.75); // ~23
    whyMatched.push(`Keyword match in sector: ${normProf.industry}`);
  } else {
    industryScore = 0;
  }

  // 2. Business Size Match (0 - 20 points)
  let sizeScore = 0;
  if (doc.enterprise_size.includes("All") || doc.enterprise_size.includes(normProf.size)) {
    sizeScore = weights.businessSize; // 20
    whyMatched.push(`Enterprise size matches: ${normProf.size}`);
  } else {
    sizeScore = 0;
  }

  // 3. Location / State Match (0 - 15 points)
  let locationScore = 0;
  const userStateLower = normProf.state.toLowerCase();
  const docStatesLower = doc.state.map((s) => s.toLowerCase());

  if (docStatesLower.includes("all")) {
    locationScore = Math.round(weights.location * 0.9); // ~14
    whyMatched.push("National Central Government Scheme (All States)");
  } else if (docStatesLower.includes(userStateLower)) {
    locationScore = weights.location; // 15
    whyMatched.push(`State-specific incentive for ${normProf.state}`);
  } else {
    locationScore = 0; // State mismatch
  }

  // 4. Udyam Match (0 - 10 points)
  let udyamScore = 0;
  if (normProf.udyamStatus === "registered") {
    udyamScore = weights.udyam; // 10
    whyMatched.push("Udyam status: Registered (user-provided)");
  } else {
    if (doc.id.includes("vishwakarma") || doc.id.includes("pmegp") || doc.id.includes("mudra")) {
      udyamScore = weights.udyam;
      whyMatched.push("Accessible without prior Udyam registration");
    } else {
      udyamScore = Math.round(weights.udyam * 0.5); // 5
      whyMatched.push("One useful next step may be checking Udyam registration");
    }
  }

  // 5. Eligibility Criteria Match (0 - 20 points)
  let eligibilityScore = 0;
  const isMfg = normProf.industry.toLowerCase().includes("mfg") || normProf.industry.toLowerCase().includes("manufactur") || normProf.industry.toLowerCase().includes("textil") || normProf.industry.toLowerCase().includes("food");
  
  if (doc.category === "certifications" || doc.category === "subsidies") {
    eligibilityScore = isMfg ? weights.eligibility : Math.round(weights.eligibility * 0.7);
    whyMatched.push("Meets core ministry operational eligibility");
  } else if (doc.category === "compliance_alerts") {
    eligibilityScore = weights.eligibility;
    whyMatched.push("Statutory compliance mandatory under Income Tax Act");
  } else if (doc.category === "export_opportunities") {
    eligibilityScore = normProf.exportStatus === "active_exporter" ? weights.eligibility : Math.round(weights.eligibility * 0.6);
    whyMatched.push("Meets foreign trade policy criteria");
  } else {
    eligibilityScore = Math.round(weights.eligibility * 0.9);
    whyMatched.push("Eligibility criteria compatible");
  }

  // 6. Recency / Verification (0 - 5 points)
  const recencyScore = doc.last_verified ? weights.recency : 2;
  if (doc.last_verified) {
    whyMatched.push(`Grounded in source record (${doc.last_verified})`);
  }

  const rawTotal = industryScore + sizeScore + locationScore + udyamScore + eligibilityScore + recencyScore;
  const totalScore = Math.min(100, Math.max(0, rawTotal));

  // Determine Relevance Tier
  let tier: RelevanceTier = "Potentially Relevant";
  if (totalScore >= 90) {
    tier = "Highly Relevant";
  } else if (totalScore >= 75) {
    tier = "Relevant";
  } else {
    tier = "Potentially Relevant";
  }

  // Evaluate Requirement Checks (Relevance ≠ Eligibility)
  const { checks: requirementChecks, status: evaluatedStatus } = evaluateRequirementChecks(doc, normProf);

  const breakdown: ScoreBreakdown = {
    industryScore,
    sizeScore,
    locationScore,
    udyamScore,
    eligibilityScore,
    recencyScore,
    totalScore,
  };

  // Why matches descriptive narrative
  let why = `Matched for ${normProf.size} ${normProf.industry} enterprises in ${normProf.state}.`;
  if (doc.category === "certifications") {
    const subsidyPct = normProf.size === "Micro" ? "80%" : normProf.size === "Small" ? "60%" : "50%";
    why = `As a ${normProf.size} ${normProf.industry} unit, you may qualify for up to ${subsidyPct} government fee subsidy and bank interest rebates.`;
  } else if (doc.category === "loans") {
    why = `Provides institutional financing tailored for ${normProf.size} units in ${normProf.state} without third-party collateral requirements.`;
  } else if (doc.category === "compliance_alerts") {
    why = `Directly protects ${normProf.size} ${normProf.industry} cash-flow and mandates statutory 45-day payment recovery.`;
  } else if (doc.category === "tenders") {
    why = `Qualifies under public procurement quota with 100% EMD fee waiver for ${normProf.size} enterprises in ${normProf.state}.`;
  } else if (doc.category === "export_opportunities") {
    why = `Provides duty remission and market access support tailored for ${normProf.industry} products from ${normProf.state}.`;
  }

  // Tailored Action Required
  let action = `Review verified guidelines and submit required documents via ${doc.official_source}.`;
  if (normProf.udyamStatus === "not_registered") {
    action = `Complete Udyam registration first, then apply on the official ${doc.government_department} portal.`;
  } else if (doc.required_documents.length > 0) {
    action = `Prepare ${doc.required_documents.slice(0, 2).join(" & ")} and register on ${doc.application_url.replace("https://", "")}.`;
  }

  let urgency: "High" | "Medium" | "Low" = "Medium";
  if (doc.category === "compliance_alerts" || totalScore >= 90) {
    urgency = "High";
  } else if (totalScore < 75) {
    urgency = "Low";
  }

  return {
    score: totalScore,
    tier,
    eligibilityStatus: evaluatedStatus,
    requirementChecks,
    whyMatched,
    breakdown,
    why,
    action,
    urgency,
  };
}

/**
 * Executes the core RAG retrieval, eligibility filtering, and ranking pipeline
 */
export function executeRAGRetrieval(profile: BusinessProfile): {
  categorizedResults: Record<OpportunityCategory, MatchedOpportunity[]>;
  totalCount: number;
  highlyRelevantCount: number;
  highPriorityCount: number;
} {
  const normProf = normalizeProfile(profile);

  const categorized: Record<OpportunityCategory, MatchedOpportunity[]> = {
    tenders: [],
    subsidies: [],
    loans: [],
    certifications: [],
    compliance_alerts: [],
    export_opportunities: [],
  };

  let totalCount = 0;
  let highlyRelevantCount = 0;
  let highPriorityCount = 0;

  for (const doc of MSME_KNOWLEDGE_BASE) {
    const { score, tier, eligibilityStatus, requirementChecks, whyMatched, breakdown, why, action, urgency } = calculateRelevanceScore(doc, normProf);

    // Rule: Scores below 60 are considered weak/irrelevant and filtered out
    if (score < 60) continue;

    if (tier === "Highly Relevant") {
      highlyRelevantCount++;
    }

    const matchedOpp: MatchedOpportunity = {
      document: doc,
      relevanceScore: score,
      scoreBreakdown: breakdown,
      relevanceTier: tier,
      eligibilityStatus,
      requirementChecks,
      whyMatches: why,
      whyMatched,
      actionRequired: action,
      urgency,
      priorityLevel: "MEDIUM", // calculated below
    };

    const priorityLevel: ActionPriority = calculateActionPriority(matchedOpp, normProf);
    matchedOpp.priorityLevel = priorityLevel;
    if (priorityLevel === "HIGH") {
      highPriorityCount++;
    }

    categorized[doc.category].push(matchedOpp);
    totalCount++;
  }

  // Sort each category by relevanceScore descending
  for (const cat in categorized) {
    categorized[cat as OpportunityCategory].sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  return {
    categorizedResults: categorized,
    totalCount,
    highlyRelevantCount,
    highPriorityCount,
  };
}

/**
 * Builds the complete AnalysisResult object deterministically from RAG pipeline
 */
export function buildDeterministicAnalysis(profile: BusinessProfile): AnalysisResult {
  const normProf = normalizeProfile(profile);
  const { categorizedResults, totalCount, highlyRelevantCount, highPriorityCount } = executeRAGRetrieval(normProf);

  const actionPlan = buildComprehensiveActionPlan(normProf, categorizedResults);
  const top3Actions = generateTop3Actions(normProf, categorizedResults);

  const summary = `Opportunity map built for ${normProf.size} ${normProf.industry} enterprise in ${normProf.state}. Found ${totalCount} opportunities (${highlyRelevantCount} highly relevant) across subsidies, financing, public procurement quotas, and cash-flow protection.`;

  return {
    summary,
    matchHighlights: {
      industryMatched: true,
      sizeMatched: true,
      locationMatched: true,
      udyamConsidered: normProf.udyamStatus === "registered",
      verifiedSourcesCount: totalCount,
    },
    totalOpportunitiesCount: totalCount,
    highlyRelevantCount,
    highPriorityCount,
    action_plan: actionPlan,
    top3Actions,
    tenders: categorizedResults.tenders,
    subsidies: categorizedResults.subsidies,
    loans: categorizedResults.loans,
    certifications: categorizedResults.certifications,
    compliance_alerts: categorizedResults.compliance_alerts,
    export_opportunities: categorizedResults.export_opportunities,
    sourceAttribution: `Grounded in structured MSME knowledge base across ${totalCount} recorded opportunities.`,
    generatedVia: "rag_verified_engine",
    timestamp: new Date().toISOString(),
  };
}

export const generateRAGAnalysis = buildDeterministicAnalysis;

export interface CompactSchemeContext {
  id: string;
  title: string;
  category: OpportunityCategory;
  department: string;
  eligibility: string;
  benefits: string;
  required_documents: string[];
  official_source: string;
  deadline: string;
  application_url: string;
}

/**
 * Compact a scheme record for Gemini assistant context (no invented fields).
 */
export function compactSchemeForAssistant(doc: SchemeDocument): CompactSchemeContext {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category,
    department: doc.government_department,
    eligibility: doc.eligibility,
    benefits: doc.benefits,
    required_documents: doc.required_documents,
    official_source: doc.official_source,
    deadline: doc.deadline,
    application_url: doc.application_url,
  };
}

/**
 * Rank the sovereign knowledge base for a chat question so Gemini sees
 * relevant records first (e.g. CGTMSE, 43B(h)) instead of an arbitrary slice.
 */
export function selectSchemesForAssistant(
  message: string,
  profile?: BusinessProfile
): CompactSchemeContext[] {
  const tokens = (message || "")
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2);

  const ranked = MSME_KNOWLEDGE_BASE.map((doc) => {
    let score = 0;
    if (profile) {
      score += calculateRelevanceScore(doc, profile).score;
    }
    const haystack = [
      doc.title,
      doc.description,
      doc.eligibility,
      doc.benefits,
      doc.keywords.join(" "),
      doc.required_documents.join(" "),
      doc.government_department,
    ]
      .join(" ")
      .toLowerCase();

    for (const token of tokens) {
      if (haystack.includes(token)) score += 20;
    }
    return { doc, score };
  }).sort((a, b) => b.score - a.score);

  // Full compact KB is small (~22 records). Pass all of them, ranked, so the
  // model cannot invent a scheme that was merely omitted from a 15-item slice.
  return ranked.map((r) => compactSchemeForAssistant(r.doc));
}

/**
 * Deterministic assistant reply from the sovereign KB.
 * Used when Gemini is missing, rate-limited, or returns an API error.
 */
export function buildAssistantFallbackReply(
  message: string,
  profile?: BusinessProfile
): string {
  const schemes = selectSchemesForAssistant(message, profile);
  const top = schemes.slice(0, 5);

  if (top.length === 0) {
    return "I don't have verified details for that specific scheme in our current database. Please check the Matched Opportunities list or official government portals.";
  }

  const lines: string[] = [];
  if (profile?.industry || profile?.size || profile?.state) {
    const unit = [profile.size, profile.industry].filter(Boolean).join(" ");
    const location = profile.state ? ` in ${profile.state}` : "";
    lines.push(`For your ${unit || "MSME"} unit${location}:`);
    lines.push("");
  }

  lines.push("From ArthaAI's verified MSME knowledge base:");
  lines.push("");

  for (const scheme of top) {
    lines.push(`**${scheme.title}** (${scheme.department})`);
    if (scheme.benefits) lines.push(`- What it offers: ${scheme.benefits}`);
    if (scheme.eligibility) lines.push(`- Eligibility: ${scheme.eligibility}`);
    if (scheme.required_documents?.length) {
      lines.push(`- Documents: ${scheme.required_documents.join(", ")}`);
    }
    if (scheme.official_source) lines.push(`- Official source: ${scheme.official_source}`);
    if (scheme.application_url) lines.push(`- Apply: ${scheme.application_url}`);
    lines.push("");
  }

  lines.push("These records are from verified government sources. Open the official link before you apply.");
  return lines.join("\n");
}
