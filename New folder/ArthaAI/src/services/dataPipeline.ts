import { SchemeDocument, IngestionResult } from "../types";
import { validateSchemeDocument } from "../utils/knowledgeBaseValidator";
import { MSME_KNOWLEDGE_BASE } from "../data/msmeKnowledgeBase";

/**
 * Data Pipeline & Opportunity Store Manager
 * Provides clean future-ready interfaces for official API ingestion, validation, and updates.
 */
class OpportunityDataPipeline {
  private repository: Map<string, SchemeDocument> = new Map();

  constructor() {
    // Seed in-memory repository with base verified knowledge base
    for (const doc of MSME_KNOWLEDGE_BASE) {
      this.repository.set(doc.id, doc);
    }
  }

  /**
   * Ingests a new opportunity document after running data integrity validation.
   */
  public ingestOpportunity(doc: SchemeDocument): IngestionResult {
    const issues = validateSchemeDocument(doc);
    const errors = issues.filter((i) => i.severity === "error");

    if (errors.length > 0) {
      return {
        success: false,
        docId: doc.id || "UNKNOWN",
        message: `Validation failed: ${errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`,
      };
    }

    this.repository.set(doc.id, doc);
    return {
      success: true,
      docId: doc.id,
      message: "Opportunity successfully validated and ingested into sovereign repository.",
    };
  }

  /**
   * Validates an opportunity without ingesting it.
   */
  public validateOpportunity(doc: SchemeDocument) {
    return validateSchemeDocument(doc);
  }

  /**
   * Updates an existing opportunity in the repository.
   */
  public updateOpportunity(docId: string, partial: Partial<SchemeDocument>): IngestionResult {
    const existing = this.repository.get(docId);
    if (!existing) {
      return { success: false, docId, message: "Opportunity ID not found in repository." };
    }

    const updated: SchemeDocument = {
      ...existing,
      ...partial,
      id: docId, // preserve original ID
    };

    const issues = validateSchemeDocument(updated);
    const errors = issues.filter((i) => i.severity === "error");
    if (errors.length > 0) {
      return {
        success: false,
        docId,
        message: `Update validation failed: ${errors.map((e) => e.message).join("; ")}`,
      };
    }

    this.repository.set(docId, updated);
    return { success: true, docId, message: "Opportunity successfully updated." };
  }

  /**
   * Marks an opportunity as expired without losing audit history.
   */
  public expireOpportunity(docId: string): IngestionResult {
    const existing = this.repository.get(docId);
    if (!existing) {
      return { success: false, docId, message: "Opportunity not found." };
    }

    existing.status = "expired";
    this.repository.set(docId, existing);
    return { success: true, docId, message: "Opportunity marked as expired." };
  }

  /**
   * Retrieves active, non-expired opportunities from the repository.
   */
  public retrieveOpportunities(includeExpired = false): SchemeDocument[] {
    const list: SchemeDocument[] = [];
    this.repository.forEach((doc) => {
      if (includeExpired || doc.status !== "expired") {
        list.push(doc);
      }
    });
    return list;
  }
}

export const dataPipeline = new OpportunityDataPipeline();
