import { BusinessProfile } from "../types";

export interface DemoProfileOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  profile: BusinessProfile;
  expectedHighlights: string[];
}

export const DEMO_PROFILES: DemoProfileOption[] = [
  {
    id: "profile-1-textiles",
    name: "Profile 1: Textiles Unit",
    badge: "Textiles · Small · Delhi",
    description: "Garment manufacturing firm in Okhla, Delhi with Udyam registration looking for public tenders, ZED certification & export rebates.",
    profile: {
      industry: "Textiles",
      size: "Small",
      udyamStatus: "registered",
      udyamNumber: "UDYAM-DL-08-0048219",
      state: "Delhi",
      city: "New Delhi",
      turnoverRange: "₹5 Cr - ₹15 Cr",
      employeeCount: "35 employees",
      yearsInBusiness: "4 years",
      gstStatus: "registered",
      exportStatus: "active_exporter",
      productsServices: "Cotton garments, knitwear, uniforms",
      existingCertifications: ["ISO 9001"],
    },
    expectedHighlights: [
      "SAMARTH Textile Capacity Scheme",
      "ZED Certification 60% Subsidy",
      "RoDTEP Export Rebate",
      "GeM 25% Mandatory Procurement",
      "Section 43B(h) 45-Day Payment Leverage",
    ],
  },
  {
    id: "profile-2-food-processing",
    name: "Profile 2: Food Processing",
    badge: "Food Processing · Micro · Maharashtra",
    description: "Micro food processor in Pune, Maharashtra specializing in grain milling & packaged spices seeking capital subsidies and bank credit.",
    profile: {
      industry: "Food Processing",
      size: "Micro",
      udyamStatus: "registered",
      udyamNumber: "UDYAM-MH-12-0019482",
      state: "Maharashtra",
      city: "Pune",
      turnoverRange: "₹80 Lakh - ₹2 Cr",
      employeeCount: "8 employees",
      yearsInBusiness: "2.5 years",
      gstStatus: "registered",
      exportStatus: "domestic_only",
      productsServices: "Milled flour, packaged spices, organic snacks",
      existingCertifications: ["FSSAI Registration"],
    },
    expectedHighlights: [
      "PMFME 35% Capital Subsidy (Up to ₹10L)",
      "CGTMSE Collateral-Free Bank Credit",
      "FSSAI/BIS Testing Fee Reimbursement",
      "TReDS Fast Bill Discounting",
      "PMEGP Margin Money Subsidy",
    ],
  },
  {
    id: "profile-3-it-software",
    name: "Profile 3: IT / Software",
    badge: "IT / Software · Small · Karnataka",
    description: "Software engineering and cloud solutions unit in Bengaluru, Karnataka bidding for e-governance tenders and collateral-free credit.",
    profile: {
      industry: "IT / Software",
      size: "Small",
      udyamStatus: "registered",
      udyamNumber: "UDYAM-KR-03-0091823",
      state: "Karnataka",
      city: "Bengaluru",
      turnoverRange: "₹5 Cr - ₹15 Cr",
      employeeCount: "28 engineers",
      yearsInBusiness: "3.5 years",
      gstStatus: "registered",
      exportStatus: "active_exporter",
      productsServices: "Fintech APIs, Cloud Apps, IT Consulting",
      existingCertifications: ["ISO 27001"],
    },
    expectedHighlights: [
      "NIC & CPPP E-Governance Software Tenders",
      "CGTMSE Collateral-Free Tech Credit",
      "GeM IT Services Framework",
      "Section 43B(h) Cash-Flow Protection",
      "Market Access Initiative (MAI) Trade Expositions",
    ],
  },
  {
    id: "profile-4-unregistered-artisan",
    name: "Profile 4: Artisan (Unregistered)",
    badge: "Handicrafts · Micro · Rajasthan",
    description: "Traditional blue pottery artisan in Jaipur, not yet registered on Udyam, seeking institutional credit & toolkits.",
    profile: {
      industry: "Handicrafts",
      size: "Micro",
      udyamStatus: "not_registered",
      udyamNumber: "",
      state: "Rajasthan",
      city: "Jaipur",
      turnoverRange: "₹15 Lakh - ₹35 Lakh",
      employeeCount: "4 artisans",
      yearsInBusiness: "3 years",
      gstStatus: "unregistered",
      exportStatus: "domestic_only",
      productsServices: "Handmade blue pottery, brass craft",
      existingCertifications: [],
    },
    expectedHighlights: [
      "Step 1: Immediate Udyam Registration (Zero Cost)",
      "PM Vishwakarma ₹15,000 Toolkit & 5% Loan",
      "MUDRA Shishu / Kishore Credit",
      "PMEGP Margin Money Grant",
      "FIEO Indian Business Portal Listing",
    ],
  },
];
