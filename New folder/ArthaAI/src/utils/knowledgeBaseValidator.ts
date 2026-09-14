import { SchemeDocument } from "../types";

export interface ValidationIssue {
  docId: string;
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationReport {
  status: "VALID" | "WARNING" | "INVALID";
  totalRecords: number;
  validCount: number;
  warningCount: number;
  invalidCount: number;
  issues: ValidationIssue[];
}

/**
 * Validates a single SchemeDocument record against data integrity and compliance rules.
 */
export function validateSchemeDocument(doc: SchemeDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Required String Fields
  if (!doc.id || doc.id.trim().length === 0) {
    issues.push({ docId: doc.id || "UNKNOWN", field: "id", message: "Missing document ID", severity: "error" });
  }

  if (!doc.title || doc.title.trim().length < 5) {
    issues.push({ docId: doc.id, field: "title", message: "Title is missing or too short", severity: "error" });
  }

  if (!doc.category) {
    issues.push({ docId: doc.id, field: "category", message: "Missing category", severity: "error" });
  }

  if (!doc.description || doc.description.trim().length < 15) {
    issues.push({ docId: doc.id, field: "description", message: "Description is missing or too brief", severity: "warning" });
  }

  if (!doc.government_department || doc.government_department.trim().length === 0) {
    issues.push({ docId: doc.id, field: "government_department", message: "Missing issuing government department", severity: "error" });
  }

  // Arrays
  if (!Array.isArray(doc.industry) || doc.industry.length === 0) {
    issues.push({ docId: doc.id, field: "industry", message: "Industry array is empty", severity: "error" });
  }

  if (!Array.isArray(doc.enterprise_size) || doc.enterprise_size.length === 0) {
    issues.push({ docId: doc.id, field: "enterprise_size", message: "Enterprise size array is empty", severity: "error" });
  }

  if (!Array.isArray(doc.state) || doc.state.length === 0) {
    issues.push({ docId: doc.id, field: "state", message: "State array is empty", severity: "error" });
  }

  // Benefits & Eligibility
  if (!doc.eligibility || doc.eligibility.trim().length < 5) {
    issues.push({ docId: doc.id, field: "eligibility", message: "Eligibility criteria missing", severity: "error" });
  }

  if (!doc.benefits || doc.benefits.trim().length < 5) {
    issues.push({ docId: doc.id, field: "benefits", message: "Stated benefits missing", severity: "error" });
  }

  // Official Source & URL Format Verification
  if (!doc.official_source || doc.official_source.trim().length === 0) {
    issues.push({ docId: doc.id, field: "official_source", message: "Official source attribution missing", severity: "error" });
  }

  if (!doc.application_url) {
    issues.push({ docId: doc.id, field: "application_url", message: "Application URL missing", severity: "error" });
  } else {
    try {
      const url = new URL(doc.application_url);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        issues.push({ docId: doc.id, field: "application_url", message: "URL protocol must be HTTP or HTTPS", severity: "error" });
      }
    } catch {
      issues.push({ docId: doc.id, field: "application_url", message: `Invalid URL format: ${doc.application_url}`, severity: "error" });
    }
  }

  if (!doc.last_verified || doc.last_verified.trim().length === 0) {
    issues.push({ docId: doc.id, field: "last_verified", message: "Missing verification date timestamp", severity: "warning" });
  }

  return issues;
}

/**
 * Validates the entire knowledge base collection.
 */
export function validateKnowledgeBase(documents: SchemeDocument[]): ValidationReport {
  const allIssues: ValidationIssue[] = [];
  let invalidCount = 0;
  let warningCount = 0;
  let validCount = 0;

  for (const doc of documents) {
    const issues = validateSchemeDocument(doc);
    const hasError = issues.some((i) => i.severity === "error");
    const hasWarning = issues.some((i) => i.severity === "warning");

    if (hasError) {
      invalidCount++;
    } else if (hasWarning) {
      warningCount++;
    } else {
      validCount++;
    }

    allIssues.push(...issues);
  }

  let status: "VALID" | "WARNING" | "INVALID" = "VALID";
  if (invalidCount > 0) {
    status = "INVALID";
  } else if (warningCount > 0) {
    status = "WARNING";
  }

  return {
    status,
    totalRecords: documents.length,
    validCount,
    warningCount,
    invalidCount,
    issues: allIssues,
  };
}
