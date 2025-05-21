
// Types related to the Patent Application Form

// 1. Application Type
export type ApplicationType = 'provisional' | 'complete' | 'ordinary' | 'convention' | 'pct-np' | 'pph';
export type YesNoOption = 'yes' | 'no';

// 2. Inventor Details
export interface Inventor {
  name: string;
  gender: 'male' | 'female' | 'others' | 'prefer_not_to_say';
  nationality: string;
  residency: string;
  state?: string; // Only if residency is India
  address: string;
}

// 3 & 4. Applicant Details
export type ApplicantCategory = 
  'natural_person' | 
  'startup' | 
  'small_entity' | 
  'large_entity' | 
  'education_institute' | 
  'govt_entity' | 
  'woman';

export interface Applicant {
  name: string;
  nationality: string;
  residency: string;
  state?: string; // Only if residency is India
  address: string;
  category: ApplicantCategory;
}

export type ApplicantMode = 'no_applicant_configured' | 'fixed' | 'fixed_plus';

export interface ApplicantDetails {
  fixed?: Applicant;
  fromInventors?: string[]; // Names of inventors who are also applicants
  additionalApplicants?: Applicant[];
}

// 5. Application Details - Sheet Counts
export interface SheetCount {
  patentDocumentSheets: number;
  abstractSheets: number;
  claimsSheets: number;
  drawingSheets: number;
}

// 6. Others
export interface OtherDetails {
  numberOfClaims: number;
  numberOfDrawings: number;
}

// 7. Publication Preference
export type PublicationPreference = 'ordinary' | 'early';

export interface PublicationFee {
  online: string;
  offline: string;
}

// 8. Examination Preference
export type ExaminationPreference = 'ordinary' | 'expedited';

// 9. Agent Details
export interface AgentDetails {
  inpaNo: string;
  agentName: string;
  agentMobile: string;
  agentEmail: string;
}

// 10. Address for Service in India
export interface ServiceAddress {
  serviceName: string;
  postalAddress: string;
  telephone: string;
  mobile: string;
  fax?: string;
  email: string;
}

// Complete Patent Application Model
export interface PatentApplication {
  applicationType: ApplicationType;
  previousProvisionalFiled?: YesNoOption;
  provisionalApplicationNumber?: string;
  
  inventors: Inventor[];
  
  wantToPreConfigure?: YesNoOption;
  preConfiguredApplicant?: Applicant;
  
  applicantMode: ApplicantMode;
  applicants: ApplicantDetails;
  
  title: string;
  sheetCounts: SheetCount;
  others: OtherDetails;
  
  excessSheetFee?: PublicationFee;
  excessClaimFee?: PublicationFee;
  
  publicationPreference?: PublicationPreference;
  earlyPublicationFee?: PublicationFee;
  
  examinationPreference?: ExaminationPreference;
  expeditedAllowed?: boolean;
  expeditedReason?: string;
  
  agentDetails: AgentDetails;
  addressForService: ServiceAddress;
}

// Empty Patent Application Template
export const emptyPatentApplication: PatentApplication = {
  applicationType: 'provisional',
  inventors: [{
    name: '',
    gender: 'prefer_not_to_say',
    nationality: 'Indian',
    residency: 'Indian',
    address: ''
  }],
  applicantMode: 'no_applicant_configured',
  applicants: {
    fromInventors: [],
    additionalApplicants: []
  },
  title: '',
  sheetCounts: {
    patentDocumentSheets: 0,
    abstractSheets: 0,
    claimsSheets: 0,
    drawingSheets: 0
  },
  others: {
    numberOfClaims: 0,
    numberOfDrawings: 0
  },
  agentDetails: {
    inpaNo: '',
    agentName: '',
    agentMobile: '',
    agentEmail: ''
  },
  addressForService: {
    serviceName: '',
    postalAddress: '',
    telephone: '',
    mobile: '',
    email: ''
  }
};

// Helper functions
export const calculateExcessSheetFee = (
  totalSheets: number, 
  category: ApplicantCategory, 
  mode: 'online' | 'offline'
): string => {
  if (totalSheets <= 30) return '0';
  
  const excessSheets = totalSheets - 30;
  let ratePerSheet: number;
  
  if (mode === 'online') {
    if (category === 'natural_person' || category === 'woman') ratePerSheet = 160;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) ratePerSheet = 400;
    else ratePerSheet = 800;
  } else { // offline
    if (category === 'natural_person' || category === 'woman') ratePerSheet = 320;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) ratePerSheet = 800;
    else ratePerSheet = 1600;
  }
  
  return (excessSheets * ratePerSheet).toString();
};

export const calculateExcessClaimFee = (
  totalClaims: number, 
  category: ApplicantCategory, 
  mode: 'online' | 'offline'
): string => {
  if (totalClaims <= 10) return '0';
  
  const excessClaims = totalClaims - 10;
  let ratePerClaim: number;
  
  if (mode === 'online') {
    if (category === 'natural_person' || category === 'woman') ratePerClaim = 320;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) ratePerClaim = 800;
    else ratePerClaim = 1600;
  } else { // offline
    if (category === 'natural_person' || category === 'woman') ratePerClaim = 640;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) ratePerClaim = 1600;
    else ratePerClaim = 3200;
  }
  
  return (excessClaims * ratePerClaim).toString();
};

export const isExpeditedExamAllowed = (applicants: ApplicantDetails): { allowed: boolean; reason?: string } => {
  // Check if at least one applicant is female
  const hasWomanApplicant = applicants.additionalApplicants?.some(app => app.category === 'woman') ?? false;
  
  if (hasWomanApplicant) {
    return { allowed: true, reason: 'At least one woman applicant' };
  }
  
  // Check if all applicants are in eligible categories
  const eligibleCategories: ApplicantCategory[] = [
    'startup', 
    'small_entity', 
    'govt_entity', 
    'education_institute', 
    'woman'
  ];
  
  const allApplicantsEligible = applicants.additionalApplicants?.every(
    app => eligibleCategories.includes(app.category)
  ) ?? false;
  
  if (allApplicantsEligible) {
    return { allowed: true, reason: 'All eligible' };
  }
  
  return { allowed: false };
};
