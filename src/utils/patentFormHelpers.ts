
/**
 * Calculate the total number of sheets from the sheet count object
 */
export const calculateTotalSheets = (sheetCounts: {
  patentDocumentSheets: number;
  abstractSheets: number;
  claimsSheets: number;
  drawingSheets: number;
}) => {
  return (
    sheetCounts.patentDocumentSheets +
    sheetCounts.abstractSheets +
    sheetCounts.claimsSheets +
    sheetCounts.drawingSheets
  );
};

/**
 * Calculate the total application fee based on entity type and other factors
 */
export const calculateTotalFee = (
  applicantType: string, 
  filingMode: 'online' | 'offline' = 'online',
  totalSheets: number,
  totalClaims: number,
  isEarlyPublication: boolean = false,
  isExpeditedExamination: boolean = false,
  applicationType: string = 'complete'
) => {
  // Base fees
  let baseFee = 0;
  let excessSheetFee = 0;
  let excessClaimFee = 0;
  let earlyPublicationFee = 0;
  let expeditedExaminationFee = 0;
  
  // Set base fee based on applicant type
  if (applicantType === 'natural_person' || applicantType === 'startup' || applicantType === 'woman') {
    baseFee = filingMode === 'online' ? 1600 : 1750;
    
    // Early publication fee if applicable
    if (isEarlyPublication) {
      earlyPublicationFee = filingMode === 'online' ? 2750 : 3000;
    }
    
    // Expedited examination fee if applicable
    if (isExpeditedExamination && applicationType === 'complete') {
      expeditedExaminationFee = filingMode === 'online' ? 8000 : 8800;
    }
    
  } else if (applicantType === 'small_entity' || applicantType === 'education_institute' || applicantType === 'govt_entity') {
    baseFee = filingMode === 'online' ? 4000 : 4400;
    
    // Early publication fee if applicable
    if (isEarlyPublication) {
      earlyPublicationFee = filingMode === 'online' ? 6875 : 7500;
    }
    
    // Expedited examination fee if applicable
    if (isExpeditedExamination && applicationType === 'complete') {
      expeditedExaminationFee = filingMode === 'online' ? 20000 : 22000;
    }
    
  } else {
    // For 'large_entity'
    baseFee = filingMode === 'online' ? 8000 : 8800;
    
    // Early publication fee if applicable
    if (isEarlyPublication) {
      earlyPublicationFee = filingMode === 'online' ? 13750 : 15000;
    }
    
    // Expedited examination fee if applicable
    if (isExpeditedExamination && applicationType === 'complete') {
      expeditedExaminationFee = filingMode === 'online' ? 40000 : 44000;
    }
  }
  
  // Calculate excess sheets fee (if total sheets > 30)
  const excessSheets = Math.max(0, totalSheets - 30);
  excessSheetFee = calculateExcessSheetFee(totalSheets, applicantType, filingMode);
  
  // Calculate excess claims fee (if claims > 10)
  const excessClaims = Math.max(0, totalClaims - 10);
  excessClaimFee = calculateExcessClaimFee(totalClaims, applicantType, filingMode);
  
  // Total fee
  const totalFee = baseFee + excessSheetFee + excessClaimFee + 
                  earlyPublicationFee + expeditedExaminationFee;
  
  return {
    baseFee,
    excessSheetFee,
    excessClaimFee,
    earlyPublicationFee: isEarlyPublication ? earlyPublicationFee : undefined,
    expeditedExaminationFee: isExpeditedExamination ? expeditedExaminationFee : undefined,
    totalFee,
    excessSheets,
    excessClaims
  };
};

/**
 * Calculate excess sheet fee based on sheet count and applicant type
 */
export const calculateExcessSheetFee = (
  totalSheets: number, 
  applicantType: string, 
  filingMode: 'online' | 'offline' = 'online'
): number => {
  if (totalSheets <= 30) return 0;
  
  const excessSheets = totalSheets - 30;
  let feePerSheet = 0;
  
  // Determine fee per sheet based on applicant type and filing mode
  if (applicantType === 'natural_person' || applicantType === 'startup' || applicantType === 'woman') {
    feePerSheet = filingMode === 'online' ? 160 : 320;
  } else if (applicantType === 'small_entity' || applicantType === 'education_institute' || applicantType === 'govt_entity') {
    feePerSheet = filingMode === 'online' ? 400 : 800;
  } else {
    // For 'large_entity'
    feePerSheet = filingMode === 'online' ? 800 : 1600;
  }
  
  return excessSheets * feePerSheet;
};

/**
 * Calculate excess claim fee based on claim count and applicant type
 */
export const calculateExcessClaimFee = (
  totalClaims: number, 
  applicantType: string, 
  filingMode: 'online' | 'offline' = 'online'
): number => {
  if (totalClaims <= 10) return 0;
  
  const excessClaims = totalClaims - 10;
  let feePerClaim = 0;
  
  // Determine fee per claim based on applicant type and filing mode
  if (applicantType === 'natural_person' || applicantType === 'startup' || applicantType === 'woman') {
    feePerClaim = filingMode === 'online' ? 320 : 640;
  } else if (applicantType === 'small_entity' || applicantType === 'education_institute' || applicantType === 'govt_entity') {
    feePerClaim = filingMode === 'online' ? 800 : 1600;
  } else {
    // For 'large_entity'
    feePerClaim = filingMode === 'online' ? 1600 : 3200;
  }
  
  return excessClaims * feePerClaim;
};

/**
 * Format a number as Indian currency
 */
export const formatCurrency = (amount: number | string | undefined): string => {
  if (amount === undefined) return "₹0";
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numericAmount);
};

/**
 * Check if expedited examination is allowed based on applicant details
 */
export const isExpeditedExamAllowed = (applicants: any): { allowed: boolean; reason?: string } => {
  // If no applicants configured yet, return false
  if (!applicants) return { allowed: false };
  
  // Check for woman applicant
  const hasWomanApplicant = applicants.additionalApplicants?.some(
    (app: any) => app.category === 'woman'
  ) ?? false;
  
  if (hasWomanApplicant) {
    return { allowed: true, reason: 'At least one woman applicant' };
  }
  
  // Check if fixed applicant is of eligible category
  if (applicants.fixed && ['startup', 'small_entity', 'education_institute', 'govt_entity'].includes(applicants.fixed.category)) {
    return { allowed: true, reason: 'Eligible applicant category' };
  }
  
  // Check if all additional applicants are of eligible categories
  const eligibleCategories = ['startup', 'small_entity', 'education_institute', 'govt_entity'];
  
  const allApplicantsEligible = applicants.additionalApplicants?.every(
    (app: any) => eligibleCategories.includes(app.category)
  ) ?? false;
  
  if (applicants.additionalApplicants?.length > 0 && allApplicantsEligible) {
    return { allowed: true, reason: 'All eligible' };
  }
  
  return { allowed: false };
};
