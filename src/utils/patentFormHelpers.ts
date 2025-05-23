
// Add the calculateTotalFee function that's missing

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
  totalSheets: number,
  totalClaims: number,
  isOnline: boolean = true
) => {
  // Base fees
  let baseFee = 0;
  let excessSheetFee = 0;
  let excessClaimFee = 0;
  
  // Set base fee based on applicant type
  if (applicantType === 'natural_person' || applicantType === 'startup' || applicantType === 'woman') {
    baseFee = isOnline ? 1600 : 1750;
    excessSheetFee = isOnline ? 160 : 320;
    excessClaimFee = isOnline ? 320 : 640;
  } else if (applicantType === 'small_entity' || applicantType === 'education_institute' || applicantType === 'govt_entity') {
    baseFee = isOnline ? 4000 : 4400;
    excessSheetFee = isOnline ? 400 : 800;
    excessClaimFee = isOnline ? 800 : 1600;
  } else {
    // For 'large_entity'
    baseFee = isOnline ? 8000 : 8800;
    excessSheetFee = isOnline ? 800 : 1600;
    excessClaimFee = isOnline ? 1600 : 3200;
  }
  
  // Calculate excess sheets fee (if total sheets > 30)
  const excessSheets = Math.max(0, totalSheets - 30);
  const totalExcessSheetFee = excessSheets * excessSheetFee;
  
  // Calculate excess claims fee (if claims > 10)
  const excessClaims = Math.max(0, totalClaims - 10);
  const totalExcessClaimFee = excessClaims * excessClaimFee;
  
  // Total fee
  const totalFee = baseFee + totalExcessSheetFee + totalExcessClaimFee;
  
  return {
    baseFee,
    excessSheetFee: totalExcessSheetFee,
    excessClaimFee: totalExcessClaimFee,
    totalFee,
    excessSheets,
    excessClaims
  };
};
