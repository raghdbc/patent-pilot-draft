
import { ApplicantCategory, SheetCount } from "@/models/patentApplication";

// Helper functions for patent form calculations

// Calculate total sheet count
export const calculateTotalSheets = (sheetCounts: SheetCount): number => {
  return (
    (sheetCounts.patentDocumentSheets || 0) +
    (sheetCounts.abstractSheets || 0) +
    (sheetCounts.claimsSheets || 0) +
    (sheetCounts.drawingSheets || 0)
  );
};

// Calculate excess sheet fee
export const calculateExcessSheetFee = (
  totalSheets: number, 
  category: ApplicantCategory | string, 
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
  category: ApplicantCategory | string, 
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

// Calculate basic filing fee
export const calculateBasicFee = (
  applicationType: 'provisional' | 'complete',
  category: ApplicantCategory | string,
  mode: 'online' | 'offline'
): number => {
  // Basic fee structure
  if (applicationType === 'provisional') {
    if (mode === 'online') {
      if (category === 'natural_person' || category === 'woman') return 1600;
      else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 4000;
      else return 8000;
    } else { // offline
      if (category === 'natural_person' || category === 'woman') return 3200;
      else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 8000;
      else return 16000;
    }
  } else { // complete
    if (mode === 'online') {
      if (category === 'natural_person' || category === 'woman') return 1750;
      else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 4400;
      else return 8800;
    } else { // offline
      if (category === 'natural_person' || category === 'woman') return 3500;
      else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 8800;
      else return 17600;
    }
  }
};

// Calculate early publication fee
export const calculateEarlyPublicationFee = (
  category: ApplicantCategory | string,
  mode: 'online' | 'offline'
): number => {
  if (mode === 'online') {
    if (category === 'natural_person' || category === 'woman') return 2750;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 6875;
    else return 13750;
  } else { // offline
    if (category === 'natural_person' || category === 'woman') return 5500;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 13750;
    else return 27500;
  }
};

// Calculate expedited examination fee
export const calculateExpeditedExamFee = (
  category: ApplicantCategory | string,
  mode: 'online' | 'offline'
): number => {
  if (mode === 'online') {
    if (category === 'natural_person' || category === 'woman') return 4000;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 10000;
    else return 20000;
  } else { // offline
    if (category === 'natural_person' || category === 'woman') return 8000;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 20000;
    else return 40000;
  }
};

// Calculate total fee
export const calculateTotalFee = (
  category: ApplicantCategory | string,
  mode: 'online' | 'offline',
  totalSheets: number,
  totalClaims: number,
  isEarlyPublication: boolean,
  isExpeditedExamination: boolean,
  applicationType: 'provisional' | 'complete' = 'complete'
): {
  basicFee: number;
  excessSheetFee: number;
  excessClaimFee: number;
  earlyPublicationFee?: number;
  expeditedExaminationFee?: number;
  totalFee: number;
} => {
  // Calculate basic fee
  const basicFee = calculateBasicFee(applicationType, category, mode);
  
  // Calculate excess sheet fee
  const excessSheetFee = calculateExcessSheetFee(totalSheets, category, mode);
  
  // Calculate excess claim fee
  const excessClaimFee = calculateExcessClaimFee(totalClaims, category, mode);
  
  // Calculate early publication fee if applicable
  const earlyPublicationFee = isEarlyPublication ? calculateEarlyPublicationFee(category, mode) : 0;
  
  // Calculate expedited examination fee if applicable
  const expeditedExaminationFee = isExpeditedExamination ? calculateExpeditedExamFee(category, mode) : 0;
  
  // Calculate total fee
  const totalFee = basicFee + excessSheetFee + excessClaimFee + 
                  earlyPublicationFee + expeditedExaminationFee;
  
  return {
    basicFee,
    excessSheetFee,
    excessClaimFee,
    ...(isEarlyPublication && { earlyPublicationFee }),
    ...(isExpeditedExamination && { expeditedExaminationFee }),
    totalFee
  };
};

// Check if expedited examination is allowed
export const isExpeditedExamAllowed = (applicants: any): { allowed: boolean; reason?: string } => {
  // Check if at least one applicant is female
  const hasWomanApplicant = applicants.additionalApplicants?.some(
    (app: any) => app.category === 'woman'
  ) ?? false;
  
  if (hasWomanApplicant) {
    return { allowed: true, reason: 'At least one woman applicant' };
  }
  
  // Check if all applicants are in eligible categories
  const eligibleCategories = [
    'startup', 
    'small_entity', 
    'govt_entity', 
    'education_institute', 
    'woman'
  ];
  
  const allApplicantsEligible = applicants.additionalApplicants?.every(
    (app: any) => eligibleCategories.includes(app.category)
  ) ?? false;
  
  if (allApplicantsEligible) {
    return { allowed: true, reason: 'All eligible' };
  }
  
  return { allowed: false };
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
