export type IndustryType =
  | "Manufacturing"
  | "Retail"
  | "Services"
  | "Export / Trading"
  | "Food Processing"
  | "Textiles"
  | "IT / Software"
  | "Agriculture"
  | "Construction"
  | "Handicrafts"
  | string;

export type BusinessSize = "Micro" | "Small" | "Medium";

export type UdyamStatus = "registered" | "not_registered" | "not_sure";

export type OpportunityCategory =
  | "tenders"
  | "subsidies"
  | "loans"
  | "certifications"
  | "compliance_alerts"
  | "export_opportunities";

export type OpportunityStatus = "verified" | "needs_verification" | "expired" | "demo";

export type SourceType =
  | "official_government"
  | "official_portal"
  | "official_notification"
  | "secondary_source"
  | "demo";

export type ActionPriority = "HIGH" | "MEDIUM" | "LOW";

export type EligibilityStatus =
  | "Likely eligible"
  | "Potentially eligible"
  | "Needs verification"
  | "Not eligible";

export interface RequirementCheck {
  criterion: string;
  status: "PASS" | "FAIL" | "UNKNOWN";
  details: string;
}

export interface BusinessProfile {
  industry: IndustryType;
  size: BusinessSize;
  udyamStatus: UdyamStatus;
  udyamNumber?: string;
  state: string;
  city?: string;
  // Optional enriched fields
  turnoverRange?: string;
  employeeCount?: string;
  yearsInBusiness?: string;
  gstStatus?: "registered" | "unregistered" | "composition";
  exportStatus?: "active_exporter" | "interested" | "domestic_only";
  productsServices?: string;
  existingCertifications?: string[];
}

export interface SchemeDocument {
  id: string;
  title: string;
  category: OpportunityCategory;
  description: string;
  government_department: string;
  industry: string[]; // ["All"] or specific industries
  enterprise_size: (BusinessSize | "All")[];
  state: string[]; // ["All"] or specific states
  eligibility: string;
  benefits: string;
  required_documents: string[];
  deadline: string;
  application_url: string;
  official_source: string;
  source_type: SourceType | string;
  last_verified: string;
  keywords: string[];
  status?: OpportunityStatus;
  isDemo?: boolean;
}

export interface ScoreWeights {
  industry: number; // default 30
  businessSize: number; // default 20
  location: number; // default 15
  udyam: number; // default 10
  eligibility: number; // default 20
  recency: number; // default 5
}

export interface ScoreBreakdown {
  industryScore: number; // max 30
  sizeScore: number; // max 20
  locationScore: number; // max 15
  udyamScore: number; // max 10
  eligibilityScore: number; // max 20
  recencyScore: number; // max 5
  totalScore: number; // 0-100
}

export type RelevanceTier = "Highly Relevant" | "Relevant" | "Potentially Relevant";

export interface MatchedOpportunity {
  document: SchemeDocument;
  relevanceScore: number; // 0-100
  scoreBreakdown: ScoreBreakdown;
  relevanceTier: RelevanceTier;
  eligibilityStatus: EligibilityStatus;
  requirementChecks: RequirementCheck[];
  whyMatches: string;
  whyMatched: string[]; // Structured checklist items
  actionRequired: string;
  urgency: "High" | "Medium" | "Low";
  priorityLevel: ActionPriority;
}

export interface ActionPlanStep {
  priority: number;
  priorityLevel: ActionPriority;
  step: string;
  detail: string;
  opportunityId?: string;
  relatedSchemeTitle?: string;
  officialUrl?: string;
  isCompleted?: boolean;
  reason?: string;
}

export interface AnalysisResult {
  summary: string;
  matchHighlights: {
    industryMatched: boolean;
    sizeMatched: boolean;
    locationMatched: boolean;
    udyamConsidered: boolean;
    verifiedSourcesCount: number;
  };
  totalOpportunitiesCount: number;
  highlyRelevantCount: number;
  highPriorityCount: number;
  action_plan: ActionPlanStep[];
  top3Actions: ActionPlanStep[];
  tenders: MatchedOpportunity[];
  subsidies: MatchedOpportunity[];
  loans: MatchedOpportunity[];
  certifications: MatchedOpportunity[];
  compliance_alerts: MatchedOpportunity[];
  export_opportunities: MatchedOpportunity[];
  sourceAttribution: string;
  generatedVia: "rag_verified_engine" | "rag_llm_grounded";
  timestamp: string;
}

export interface MonitorAlert {
  id: string;
  title: string;
  category: string;
  impactLevel: "Critical" | "Important" | "Advisory";
  date: string;
  source: string;
  summary: string;
  targetMSME: string;
  actionDeadline?: string;
  url: string;
}

export interface IngestionResult {
  success: boolean;
  docId: string;
  message: string;
}

export interface InAppNotification {
  id: string;
  userId?: string;
  opportunityId?: string;
  notificationType: "deadline" | "new_scheme" | "policy_change" | "compliance";
  title: string;
  message: string;
  priority: ActionPriority;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}
