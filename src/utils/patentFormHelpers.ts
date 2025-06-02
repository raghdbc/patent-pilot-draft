
import { ApplicantCategory } from "@/models/patentApplication";

export const calculateTotalSheets = (sheetCounts: {
  patentDocumentSheets: number;
  abstractSheets: number;
  claimsSheets: number;
  drawingSheets: number;
}): number => {
  return (
    sheetCounts.patentDocumentSheets +
    sheetCounts.abstractSheets +
    sheetCounts.claimsSheets +
    sheetCounts.drawingSheets
  );
};

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

export const getEarlyPublicationFee = (
  category: ApplicantCategory,
  mode: 'online' | 'offline'
): number => {
  if (mode === 'online') {
    if (category === 'natural_person' || category === 'woman') return 2500;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 6250;
    else return 12500;
  } else { // offline
    if (category === 'natural_person' || category === 'woman') return 5000;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) return 12500;
    else return 25000;
  }
};

export const isExpeditedExamAllowed = (applicants: any): { allowed: boolean; reason?: string } => {
  // Check if at least one applicant is female
  const hasWomanApplicant = 
    applicants?.fixed?.category === 'woman' ||
    (applicants?.additionalApplicants?.some((app: any) => app.category === 'woman') ?? false);
  
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
  
  let allEligible = true;
  
  // Check fixed applicant
  if (applicants?.fixed && !eligibleCategories.includes(applicants.fixed.category)) {
    allEligible = false;
  }
  
  // Check additional applicants
  if (applicants?.additionalApplicants?.length > 0) {
    const additionalEligible = applicants.additionalApplicants.every(
      (app: any) => eligibleCategories.includes(app.category)
    );
    if (!additionalEligible) allEligible = false;
  }
  
  if (allEligible && (applicants?.fixed || (applicants?.additionalApplicants?.length ?? 0) > 0)) {
    return { allowed: true, reason: 'All eligible' };
  }
  
  return { allowed: false };
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const calculateTotalFee = (
  category: ApplicantCategory,
  mode: 'online' | 'offline',
  totalSheets: number,
  totalClaims: number,
  isEarlyPublication: boolean,
  isExpeditedExamination: boolean
) => {
  // Base fees for different categories
  let baseFee: number;
  
  if (mode === 'online') {
    if (category === 'natural_person' || category === 'woman') baseFee = 1600;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) baseFee = 4000;
    else baseFee = 8000;
  } else {
    if (category === 'natural_person' || category === 'woman') baseFee = 3200;
    else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) baseFee = 8000;
    else baseFee = 16000;
  }
  
  const excessSheetFee = calculateExcessSheetFee(totalSheets, category, mode);
  const excessClaimFee = calculateExcessClaimFee(totalClaims, category, mode);
  
  let earlyPublicationFee = 0;
  if (isEarlyPublication) {
    earlyPublicationFee = getEarlyPublicationFee(category, mode);
  }
  
  let expeditedExaminationFee = 0;
  if (isExpeditedExamination) {
    if (mode === 'online') {
      if (category === 'natural_person' || category === 'woman') expeditedExaminationFee = 8000;
      else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) expeditedExaminationFee = 20000;
      else expeditedExaminationFee = 40000;
    } else {
      if (category === 'natural_person' || category === 'woman') expeditedExaminationFee = 16000;
      else if (['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(category)) expeditedExaminationFee = 40000;
      else expeditedExaminationFee = 80000;
    }
  }
  
  const totalFee = baseFee + excessSheetFee + excessClaimFee + earlyPublicationFee + expeditedExaminationFee;
  
  return {
    baseFee,
    excessSheetFee,
    excessClaimFee,
    earlyPublicationFee: isEarlyPublication ? earlyPublicationFee : undefined,
    expeditedExaminationFee: isExpeditedExamination ? expeditedExaminationFee : undefined,
    totalFee,
    excessSheets: Math.max(0, totalSheets - 30),
    excessClaims: Math.max(0, totalClaims - 10)
  };
};
