/**
 * Manual scoring verification for Task 4.
 * Run from ArthaAI/:  npx tsx scripts/verify-scoring.ts
 */
import { BusinessProfile } from "../src/types";
import { generateRAGAnalysis } from "../src/services/ragEngine";
import { runArthaAITests } from "../src/services/testSuite";

function printProfileScores(label: string, profile: BusinessProfile) {
  const result = generateRAGAnalysis(profile);
  const all = [
    ...result.tenders,
    ...result.subsidies,
    ...result.loans,
    ...result.certifications,
    ...result.compliance_alerts,
    ...result.export_opportunities,
  ].sort((a, b) => b.relevanceScore - a.relevanceScore);

  console.log("\n========================================");
  console.log(label);
  console.log("========================================");
  console.log(
    `Profile: ${profile.size} ${profile.industry} · ${profile.state} · Udyam ${profile.udyamStatus}`
  );
  console.log(
    `Total matches: ${result.totalOpportunitiesCount} | Highly relevant: ${result.highlyRelevantCount} | generatedVia: ${result.generatedVia}`
  );
  console.log("Top matches:");
  for (const opp of all.slice(0, 8)) {
    const b = opp.scoreBreakdown;
    console.log(
      `  ${opp.relevanceScore}/100  [${opp.relevanceTier}]  ${opp.document.title}`
    );
    console.log(
      `           Ind ${b.industryScore}  Size ${b.sizeScore}  State ${b.locationScore}  Udyam ${b.udyamScore}  Elig ${b.eligibilityScore}  Recency ${b.recencyScore}`
    );
  }
}

const typedTextiles: BusinessProfile = {
  industry: "Textiles",
  size: "Small",
  udyamStatus: "registered",
  udyamNumber: "UDYAM-DL-08-0048219",
  state: "Delhi",
  city: "New Delhi",
};

// Shape produced after user reviews/applies Udyam certificate extraction
const documentPrefillFood: BusinessProfile = {
  industry: "Food Processing",
  size: "Micro",
  udyamStatus: "registered",
  udyamNumber: "UDYAM-MH-12-0019482",
  state: "Maharashtra",
  city: "Pune",
  gstStatus: "registered",
};

printProfileScores("(a) Manually typed profile — Textiles / Small / Delhi", typedTextiles);
printProfileScores(
  "(b) Document-prefilled profile — Food Processing / Micro / Maharashtra",
  documentPrefillFood
);

const suite = runArthaAITests();
console.log("\n========================================");
console.log(`Engine test suite: ${suite.passed}/${suite.total} passed (${suite.failed} failed)`);
console.log("========================================");
for (const t of suite.results) {
  console.log(`  ${t.passed ? "PASS" : "FAIL"}  ${t.name}`);
  console.log(`        ${t.details}`);
}

if (suite.failed > 0) {
  process.exit(1);
}
