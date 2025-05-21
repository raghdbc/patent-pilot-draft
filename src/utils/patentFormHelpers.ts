
import { 
  ApplicantCategory, 
  calculateExcessClaimFee, 
  calculateExcessSheetFee 
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
  
  const excessSheetFee = parseInt(calculateExcessSheetFee(totalSheets, category, mode));
  const excessClaimFee = parseInt(calculateExcessClaimFee(totalClaims, category, mode));
  
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
