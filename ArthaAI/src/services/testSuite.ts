import { BusinessProfile, SchemeDocument } from "../types";
import { normalizeProfile, calculateRelevanceScore, executeRAGRetrieval, generateRAGAnalysis } from "./ragEngine";
import { validateKnowledgeBase, validateSchemeDocument } from "../utils/knowledgeBaseValidator";
import { MSME_KNOWLEDGE_BASE } from "../data/msmeKnowledgeBase";

export interface TestCaseResult {
  name: string;
  passed: boolean;
  details: string;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  results: TestCaseResult[];
}

/**
 * Runs comprehensive automated validation and behavioral test suite for ArthaAI.
 */
export function runArthaAITests(): TestSuiteSummary {
  const results: TestCaseResult[] = [];

  // TEST 1: Knowledge Base Integrity Validation
  try {
    const report = validateKnowledgeBase(MSME_KNOWLEDGE_BASE);
    results.push({
      name: "Knowledge Base Integrity Check",
      passed: report.status !== "INVALID" && report.invalidCount === 0,
      details: `${report.totalRecords} schemes analyzed (${report.validCount} valid, ${report.warningCount} warnings, ${report.invalidCount} errors).`,
    });
  } catch (err: any) {
    results.push({ name: "Knowledge Base Integrity Check", passed: false, details: err.message });
  }

  // TEST 2: Profile Normalization & Safe Defaults
  try {
    const raw: any = { industry: "  Textiles  ", size: undefined, udyamStatus: "", state: " Delhi " };
    const norm = normalizeProfile(raw);
    const passed = norm.industry === "Textiles" && norm.size === "Micro" && norm.state === "Delhi";
    results.push({
      name: "Profile Normalization",
      passed,
      details: `Normalized: ${norm.industry}, ${norm.size}, ${norm.state}, ${norm.udyamStatus}`,
    });
  } catch (err: any) {
    results.push({ name: "Profile Normalization", passed: false, details: err.message });
  }

  // TEST 3: Multi-Factor Scoring (6 Dimensions)
  try {
    const testDoc = MSME_KNOWLEDGE_BASE[0]; // GeM 25% MSME quota
    const testProfile: BusinessProfile = {
      industry: "Manufacturing",
      size: "Small",
      udyamStatus: "registered",
      state: "Delhi",
    };
    const scored = calculateRelevanceScore(testDoc, testProfile);
    const passed =
      scored.score >= 85 &&
      scored.breakdown.industryScore > 0 &&
      scored.breakdown.sizeScore === 20 &&
      scored.breakdown.locationScore > 0 &&
      scored.breakdown.udyamScore === 10;
    results.push({
      name: "Relevance Scoring Formula",
      passed,
      details: `Score: ${scored.score}/100, Tier: ${scored.tier}, Industry: ${scored.breakdown.industryScore}, Size: ${scored.breakdown.sizeScore}, Udyam: ${scored.breakdown.udyamScore}`,
    });
  } catch (err: any) {
    results.push({ name: "Relevance Scoring Formula", passed: false, details: err.message });
  }

  // TEST 4: SCENARIO CASE A: Textiles + Small + Delhi
  try {
    const profileA: BusinessProfile = {
      industry: "Textiles",
      size: "Small",
      udyamStatus: "registered",
      state: "Delhi",
    };
    const resA = generateRAGAnalysis(profileA);
    const hasTextileTender = resA.tenders.some((t) => t.document.id.includes("textile"));
    const passed = resA.totalOpportunitiesCount > 0 && hasTextileTender;
    results.push({
      name: "Case A: Textiles + Small + Delhi",
      passed,
      details: `Retrieved ${resA.totalOpportunitiesCount} opportunities; matched specialized textile tender correctly.`,
    });
  } catch (err: any) {
    results.push({ name: "Case A: Textiles + Small + Delhi", passed: false, details: err.message });
  }

  // TEST 5: SCENARIO CASE B: Food Processing + Micro + Maharashtra
  try {
    const profileB: BusinessProfile = {
      industry: "Food Processing",
      size: "Micro",
      udyamStatus: "registered",
      state: "Maharashtra",
    };
    const resB = generateRAGAnalysis(profileB);
    const hasFSSAIOrPMFME = resB.subsidies.some((s) => s.document.id.includes("pmfme") || s.document.id.includes("zed"));
    const passed = resB.totalOpportunitiesCount > 0 && hasFSSAIOrPMFME;
    results.push({
      name: "Case B: Food Processing + Micro + Maharashtra",
      passed,
      details: `Retrieved ${resB.totalOpportunitiesCount} opportunities; matched food processing subsidies correctly.`,
    });
  } catch (err: any) {
    results.push({ name: "Case B: Food Processing + Micro + Maharashtra", passed: false, details: err.message });
  }

  // TEST 6: SCENARIO CASE C: IT + Small + Karnataka
  try {
    const profileC: BusinessProfile = {
      industry: "IT / Software",
      size: "Small",
      udyamStatus: "registered",
      state: "Karnataka",
    };
    const resC = generateRAGAnalysis(profileC);
    const hasITTender = resC.tenders.some((t) => t.document.id.includes("nic-it") || t.document.id.includes("gem"));
    const passed = resC.totalOpportunitiesCount > 0 && hasITTender;
    results.push({
      name: "Case C: IT / Software + Small + Karnataka",
      passed,
      details: `Retrieved ${resC.totalOpportunitiesCount} opportunities; matched IT tenders and credit guarantees.`,
    });
  } catch (err: any) {
    results.push({ name: "Case C: IT / Software + Small + Karnataka", passed: false, details: err.message });
  }

  // TEST 7: SCENARIO CASE D: No Udyam Registration (Udyam Triage)
  try {
    const profileD: BusinessProfile = {
      industry: "Manufacturing",
      size: "Micro",
      udyamStatus: "not_registered",
      state: "Punjab",
    };
    const resD = generateRAGAnalysis(profileD);
    const topActionIsUdyam = resD.top3Actions[0]?.step.toLowerCase().includes("udyam");
    results.push({
      name: "Case D: No Udyam Registration Triage",
      passed: topActionIsUdyam,
      details: `First priority action correctly set to: "${resD.top3Actions[0]?.step}"`,
    });
  } catch (err: any) {
    results.push({ name: "Case D: No Udyam Registration Triage", passed: false, details: err.message });
  }

  // TEST 8: SCENARIO CASE E: Unknown / Generic Industry
  try {
    const profileE: BusinessProfile = {
      industry: "Custom Specialized Fabrication",
      size: "Micro",
      udyamStatus: "registered",
      state: "Haryana",
    };
    const resE = generateRAGAnalysis(profileE);
    // Should safely fallback to general MSME schemes (CGTMSE, Section 43B(h), GeM) without crashing
    const passed = resE.totalOpportunitiesCount > 0;
    results.push({
      name: "Case E: Custom / Unknown Industry Fallback",
      passed,
      details: `Safely retrieved ${resE.totalOpportunitiesCount} applicable cross-industry schemes without error.`,
    });
  } catch (err: any) {
    results.push({ name: "Case E: Custom / Unknown Industry Fallback", passed: false, details: err.message });
  }

  // TEST 9: SCENARIO CASE F: Irrelevant Filtering (Scores < 60)
  try {
    const dummyIrrelevantDoc: SchemeDocument = {
      id: "test-solar-kerala-only",
      title: "Kerala State High-Tech Solar Subsidy",
      category: "subsidies",
      description: "Specific solar manufacturing subsidy exclusively for large units in Kerala state.",
      government_department: "Government of Kerala",
      industry: ["Solar Photovoltaics"],
      enterprise_size: ["Medium"],
      state: ["Kerala"],
      eligibility: "Must have ₹50 Cr capital investment in Kerala.",
      benefits: "State grant.",
      required_documents: ["Kerala State Reg"],
      deadline: "31 Dec 2026",
      application_url: "https://kerala.gov.in",
      official_source: "Kerala State Industrial Development",
      source_type: "official_government",
      last_verified: "August 2026",
      keywords: ["solar", "Kerala", "photovoltaic"],
    };

    const mismatchProfile: BusinessProfile = {
      industry: "Textiles",
      size: "Micro",
      udyamStatus: "not_registered",
      state: "Delhi",
    };

    const scoreResult = calculateRelevanceScore(dummyIrrelevantDoc, mismatchProfile);
    const passed = scoreResult.score < 60;
    results.push({
      name: "Case F: Irrelevant Filtering (<60 cutoff)",
      passed,
      details: `Irrelevant document received score of ${scoreResult.score}/100 (below 60 cutoff: filtered out).`,
    });
  } catch (err: any) {
    results.push({ name: "Case F: Irrelevant Filtering", passed: false, details: err.message });
  }

  // TEST 10: SCENARIO CASE G & H: Missing / Malformed URL Detection
  try {
    const invalidDoc: any = {
      id: "bad-doc-1",
      title: "Broken Scheme",
      category: "tenders",
      application_url: "not-a-valid-url",
      government_department: "Test Dept",
      industry: ["All"],
      enterprise_size: ["All"],
      state: ["All"],
      eligibility: "None",
      benefits: "None",
      official_source: "Test",
    };
    const issues = validateSchemeDocument(invalidDoc);
    const caughtUrlError = issues.some((i) => i.field === "application_url");
    results.push({
      name: "Case G & H: Malformed URL Validation",
      passed: caughtUrlError,
      details: "Validator successfully flagged invalid URL format without crashing.",
    });
  } catch (err: any) {
    results.push({ name: "Case G & H: Malformed URL Validation", passed: false, details: err.message });
  }

  // TEST 11: Manual typed profile vs document-prefilled profile produce the same pipeline
  try {
    const typed: BusinessProfile = {
      industry: "Textiles & Apparel",
      size: "Small",
      udyamStatus: "registered",
      udyamNumber: "UDYAM-DL-08-0048219",
      state: "Delhi",
      city: "New Delhi",
    };
    const fromDocument: BusinessProfile = {
      industry: "Textiles & Apparel",
      size: "Small",
      udyamStatus: "registered",
      udyamNumber: "UDYAM-DL-08-0048219",
      state: "Delhi",
      city: "New Delhi",
      gstStatus: "registered",
    };
    const typedResult = generateRAGAnalysis(typed);
    const docResult = generateRAGAnalysis(fromDocument);
    const typedGem = typedResult.tenders.find((t) => t.document.id === "tender-gem-msme-25pct");
    const docGem = docResult.tenders.find((t) => t.document.id === "tender-gem-msme-25pct");
    const passed =
      typedResult.totalOpportunitiesCount > 0 &&
      typedResult.totalOpportunitiesCount === docResult.totalOpportunitiesCount &&
      typedGem?.relevanceScore === docGem?.relevanceScore &&
      (typedGem?.relevanceScore || 0) >= 60;
    results.push({
      name: "Document-prefill vs typed profile scoring parity",
      passed,
      details: `Typed GeM score ${typedGem?.relevanceScore ?? "n/a"} vs extract-shaped ${docGem?.relevanceScore ?? "n/a"}; counts ${typedResult.totalOpportunitiesCount}/${docResult.totalOpportunitiesCount}.`,
    });
  } catch (err: any) {
    results.push({
      name: "Document-prefill vs typed profile scoring parity",
      passed: false,
      details: err.message,
    });
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed: passedCount,
    failed: results.length - passedCount,
    results,
  };
}
