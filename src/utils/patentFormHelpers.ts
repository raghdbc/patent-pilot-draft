
import { 
  ApplicantCategory, 
  ApplicantDetails
} from "@/models/patentApplication";

export interface FeeSummary {
  basicFee: number;
  earlyPublicationFee?: number;
  expeditedExaminationFee?: number;
  excessSheetFee: number;
  excessClaimFee: number;
  totalFee: number;
}

// Calculate the basic filing fee based on applicant category and mode
export const calculateBasicFee = (
  category: ApplicantCategory, 
  mode: 'online' | 'offline'
): number => {
  if (mode === 'online') {
    switch (category) {
      case 'natural_person':
      case 'woman':
        return 1600;
      case 'startup':
      case 'small_entity':
        return 4000;
      case 'education_institute':
      case 'govt_entity':
        return 4000;
      default: // large entity
        return 8000;
    }
  } else { // offline
    switch (category) {
      case 'natural_person':
      case 'woman':
        return 1750;
      case 'startup':
      case 'small_entity':
        return 4400;
      case 'education_institute':
      case 'govt_entity':
        return 4400;
      default: // large entity
        return 8800;
    }
  }
};

// Calculate early publication fee
export const calculateEarlyPublicationFee = (
  category: ApplicantCategory, 
  mode: 'online' | 'offline'
): number => {
  if (mode === 'online') {
    switch (category) {
      case 'natural_person':
      case 'woman':
        return 2750;
      case 'startup':
      case 'small_entity':
        return 6875;
      case 'education_institute':
      case 'govt_entity':
        return 6875;
      default: // large entity
        return 13750;
    }
  } else { // offline
    switch (category) {
      case 'natural_person':
      case 'woman':
        return 3025;
      case 'startup':
      case 'small_entity':
        return 7560;
      case 'education_institute':
      case 'govt_entity':
        return 7560;
      default: // large entity
        return 15125;
    }
  }
};

// Calculate expedited examination fee
export const calculateExpeditedExaminationFee = (
  category: ApplicantCategory, 
  mode: 'online' | 'offline'
): number => {
  if (mode === 'online') {
    switch (category) {
      case 'natural_person':
      case 'woman':
        return 8000;
      case 'startup':
      case 'small_entity':
        return 20000;
      case 'education_institute':
      case 'govt_entity':
        return 20000;
      default: // large entity (should not be eligible, but included for completeness)
        return 60000;
    }
  } else { // offline
    switch (category) {
      case 'natural_person':
      case 'woman':
        return 8800;
      case 'startup':
      case 'small_entity':
        return 22000;
      case 'education_institute':
      case 'govt_entity':
        return 22000;
      default: // large entity (should not be eligible, but included for completeness)
        return 66000;
    }
  }
};

// Calculate excess sheet fee
export const calculateExcessSheetFee = (
  totalSheets: number, 
  category: ApplicantCategory, 
  mode: 'online' | 'offline'
): number => {
  if (totalSheets <= 30) return 0;
  
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
  
  return excessSheets * ratePerSheet;
};

// Calculate excess claim fee
export const calculateExcessClaimFee = (
  totalClaims: number, 
  category: ApplicantCategory, 
  mode: 'online' | 'offline'
): number => {
  if (totalClaims <= 10) return 0;
  
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
  
  return excessClaims * ratePerClaim;
};

// Check if expedited examination is allowed
export const isExpeditedExamAllowed = (applicants: ApplicantDetails): { allowed: boolean; reason?: string } => {
  // Check if at least one applicant is female
  const hasWomanApplicant = Boolean(
    (applicants.additionalApplicants && applicants.additionalApplicants.some(app => app.category === 'woman')) ||
    (applicants.fixed && applicants.fixed.category === 'woman')
  );
  
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
  
  // Check fixed applicant if present
  if (applicants.fixed && !eligibleCategories.includes(applicants.fixed.category)) {
    return { allowed: false };
  }
  
  // Check additional applicants
  const allAdditionalApplicantsEligible = !applicants.additionalApplicants || 
    (applicants.additionalApplicants.length > 0 && 
     applicants.additionalApplicants.every(app => eligibleCategories.includes(app.category)));
  
  if (applicants.fixed || (applicants.additionalApplicants && applicants.additionalApplicants.length > 0)) {
    if (allAdditionalApplicantsEligible) {
      return { allowed: true, reason: 'All applicants are eligible entities' };
    }
  }
  
  return { allowed: false };
};

// Calculate the total fee for a patent application
export const calculateTotalFee = (
  category: ApplicantCategory,
  mode: 'online' | 'offline',
  totalSheets: number,
  totalClaims: number,
  earlyPublication: boolean = false,
  expeditedExamination: boolean = false
): FeeSummary => {
  const basicFee = calculateBasicFee(category, mode);
  
  const earlyPublicationFee = earlyPublication 
    ? calculateEarlyPublicationFee(category, mode) 
    : 0;
  
  const expeditedExaminationFee = expeditedExamination 
    ? calculateExpeditedExaminationFee(category, mode) 
    : 0;
  
  const excessSheetFee = calculateExcessSheetFee(totalSheets, category, mode);
  const excessClaimFee = calculateExcessClaimFee(totalClaims, category, mode);
  
  const totalFee = basicFee + earlyPublicationFee + expeditedExaminationFee + excessSheetFee + excessClaimFee;
  
  return {
    basicFee,
    earlyPublicationFee: earlyPublication ? earlyPublicationFee : undefined,
    expeditedExaminationFee: expeditedExamination ? expeditedExaminationFee : undefined,
    excessSheetFee,
    excessClaimFee,
    totalFee
  };
};

// Create formatted fee output object for JSON
export const createFeeOutputJSON = (
  category: ApplicantCategory,
  totalSheets: number,
  totalClaims: number
) => {
  // Calculate excess sheet fee
  const excessSheetFee = {
    online: formatCurrency(calculateExcessSheetFee(totalSheets, category, 'online')),
    offline: formatCurrency(calculateExcessSheetFee(totalSheets, category, 'offline'))
  };
  
  // Calculate excess claim fee
  const excessClaimFee = {
    online: formatCurrency(calculateExcessClaimFee(totalClaims, category, 'online')),
    offline: formatCurrency(calculateExcessClaimFee(totalClaims, category, 'offline'))
  };
  
  // Calculate early publication fee
  const earlyPublicationFee = {
    online: formatCurrency(calculateEarlyPublicationFee(category, 'online')),
    offline: formatCurrency(calculateEarlyPublicationFee(category, 'offline'))
  };
  
  return {
    excessSheetFee,
    excessClaimFee,
    earlyPublicationFee
  };
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Calculate total sheet count
export const calculateTotalSheets = (sheetCounts: {
  patentDocumentSheets: number;
  abstractSheets: number;
  claimsSheets: number;
  drawingSheets: number;
}): number => {
  return (sheetCounts.patentDocumentSheets || 0) + 
         (sheetCounts.abstractSheets || 0) + 
         (sheetCounts.claimsSheets || 0) + 
         (sheetCounts.drawingSheets || 0);
};
