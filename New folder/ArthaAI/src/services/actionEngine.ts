import {
  BusinessProfile,
  MatchedOpportunity,
  ActionPlanStep,
  ActionPriority,
  OpportunityCategory,
} from "../types";

/**
 * Calculates priority level (HIGH, MEDIUM, LOW) deterministically
 * based on relevance, statutory deadline/urgency, and profile status.
 */
export function calculateActionPriority(
  opp: MatchedOpportunity,
  profile: BusinessProfile
): ActionPriority {
  // Critical statutory compliance items
  if (opp.document.category === "compliance_alerts") {
    return "HIGH";
  }

  // Missing Udyam is highest blocker for government benefits
  if (
    (profile.udyamStatus === "not_registered" || profile.udyamStatus === "not_sure") &&
    opp.document.eligibility.toLowerCase().includes("udyam")
  ) {
    return "HIGH";
  }

  // Highly relevant opportunities (Score >= 88) with immediate value
  if (opp.relevanceScore >= 88) {
    if (opp.document.category === "subsidies" || opp.document.category === "loans") {
      return "HIGH";
    }
    return "MEDIUM";
  }

  if (opp.relevanceScore >= 75) {
    return "MEDIUM";
  }

  return "LOW";
}

/**
 * Generates the prioritized TOP 3 Actions at the top of the dashboard.
 * Each action links directly to an underlying verified opportunity.
 */
export function generateTop3Actions(
  profile: BusinessProfile,
  categorized: Record<OpportunityCategory, MatchedOpportunity[]>
): ActionPlanStep[] {
  const top3: ActionPlanStep[] = [];

  // Action 1: Legal Protection / Immediate Statutory Registration
  if (profile.udyamStatus === "not_registered" || profile.udyamStatus === "not_sure") {
    top3.push({
      priority: 1,
      priorityLevel: "HIGH",
      step: "Complete Zero-Cost Udyam Registration",
      detail: "Mandatory foundation to unlock 25% GeM public procurement quota, 100% EMD waivers, and Section 43B(h) statutory payment protections.",
      opportunityId: "udyam-portal",
      relatedSchemeTitle: "Udyam Registration Portal (Ministry of MSME)",
      officialUrl: "https://udyamregistration.gov.in",
      reason: "Udyam is required for 90% of central government MSME benefits.",
      isCompleted: false,
    });
  } else {
    top3.push({
      priority: 1,
      priorityLevel: "HIGH",
      step: "Print Udyam Number & 45-Day Payment Notice on Invoices",
      detail: `Cite Section 43B(h) of the Income Tax Act with your Udyam Certificate (${profile.udyamNumber || "Active"}) so buyers must pay within 15–45 days or face mandatory tax disallowance.`,
      opportunityId: "alert-it-43bh-payment",
      relatedSchemeTitle: "Section 43B(h) MSME Payment Protection Directive",
      officialUrl: "https://incometax.gov.in",
      reason: "Protects working capital and enforces statutory 3x RBI compound interest on delayed payments.",
      isCompleted: false,
    });
  }

  // Action 2: Top Verified Subsidy or Grant from retrieved evidence
  const topSubsidy = categorized.subsidies[0];
  if (topSubsidy) {
    const subsidyPct = profile.size === "Micro" ? "80%" : profile.size === "Small" ? "60%" : "50%";
    top3.push({
      priority: 2,
      priorityLevel: "HIGH",
      step: `Apply for ${topSubsidy.document.title.split("(")[0].trim()}`,
      detail: `${topSubsidy.document.benefits.slice(0, 130)}... Verified through ${topSubsidy.document.government_department}.`,
      opportunityId: topSubsidy.document.id,
      relatedSchemeTitle: topSubsidy.document.title,
      officialUrl: topSubsidy.document.application_url,
      reason: `Direct non-repayable government financial grant (up to ${subsidyPct} subsidy).`,
      isCompleted: false,
    });
  }

  // Action 3: Top Verified Financing or Procurement Tender from retrieved evidence
  const topLoan = categorized.loans[0];
  const topTender = categorized.tenders[0];

  if (topLoan && topLoan.relevanceScore >= 80) {
    top3.push({
      priority: 3,
      priorityLevel: "MEDIUM",
      step: `Apply for ${topLoan.document.title.split("(")[0].trim()}`,
      detail: `Access collateral-free credit with up to 85% sovereign guarantee and interest subvention via ${topLoan.document.official_source}.`,
      opportunityId: topLoan.document.id,
      relatedSchemeTitle: topLoan.document.title,
      officialUrl: topLoan.document.application_url,
      reason: "Provides low-interest institutional capital without pledging collateral.",
      isCompleted: false,
    });
  } else if (topTender) {
    top3.push({
      priority: 3,
      priorityLevel: "MEDIUM",
      step: `Bid on ${topTender.document.title.split("(")[0].trim()}`,
      detail: `Qualifies for 100% Earnest Money Deposit (EMD) exemption and 15% price purchase preference against non-MSME competitors.`,
      opportunityId: topTender.document.id,
      relatedSchemeTitle: topTender.document.title,
      officialUrl: topTender.document.application_url,
      reason: "Zero tender fees and mandated 25% government procurement quota.",
      isCompleted: false,
    });
  }

  return top3;
}

/**
 * Builds the full 5-step prioritized action plan with linked evidence.
 */
export function buildComprehensiveActionPlan(
  profile: BusinessProfile,
  categorized: Record<OpportunityCategory, MatchedOpportunity[]>
): ActionPlanStep[] {
  const top3 = generateTop3Actions(profile, categorized);
  const steps: ActionPlanStep[] = [...top3];

  // Action 4: Certification or Technology Upgrade
  const topCert = categorized.certifications[0];
  if (topCert) {
    steps.push({
      priority: 4,
      priorityLevel: "MEDIUM",
      step: `Enroll for ${topCert.document.title.split("(")[0].trim()}`,
      detail: `Avail ${profile.size === "Micro" ? "80%" : profile.size === "Small" ? "60%" : "50%"} government fee subsidy and 0.50% interest concession from banks.`,
      opportunityId: topCert.document.id,
      relatedSchemeTitle: topCert.document.title,
      officialUrl: topCert.document.application_url,
      reason: "Lowers testing costs and improves credit ratings.",
      isCompleted: false,
    });
  }

  // Action 5: Tenders or Export Readiness
  const topExport = categorized.export_opportunities[0];
  const topTender = categorized.tenders[0];

  if (profile.exportStatus === "active_exporter" && topExport) {
    steps.push({
      priority: 5,
      priorityLevel: "LOW",
      step: `Claim ${topExport.document.title.split("(")[0].trim()}`,
      detail: `Submit shipping bills for duty remission (RoDTEP) and participate in subsidized international trade fairs.`,
      opportunityId: topExport.document.id,
      relatedSchemeTitle: topExport.document.title,
      officialUrl: topExport.document.application_url,
      reason: "Recovers un-rebated taxes and expands overseas sales.",
      isCompleted: false,
    });
  } else if (topTender && !steps.some((s) => s.opportunityId === topTender.document.id)) {
    steps.push({
      priority: 5,
      priorityLevel: "LOW",
      step: `Register on GeM / CPPP for ${profile.industry} Supply Tenders`,
      detail: `Participate in central and PSU tenders with 100% EMD fee waivers and tender document fee exemptions.`,
      opportunityId: topTender.document.id,
      relatedSchemeTitle: topTender.document.title,
      officialUrl: topTender.document.application_url,
      reason: "Opens steady revenue stream from verified government buyers.",
      isCompleted: false,
    });
  }

  return steps;
}
