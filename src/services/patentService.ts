
import { supabase } from "@/integrations/supabase/client";
import { ApplicantData } from "@/utils/applicantSchema";

export interface PatentApplication {
  id?: string;
  user_id: string;
  title: string;
  application_type: string;
  applicant_type: string;
  applicant_name: string;
  applicant_address: string;
  applicant_nationality: string;
  inventor_name: string;
  inventor_address: string;
  inventor_nationality: string;
  claim_priority: boolean;
  priority_details: string;
  additional_info: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export async function createPatentApplication(data: Omit<PatentApplication, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('patent_applications')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create patent application: ${error.message}`);
  }

  return result;
}

export async function updatePatentApplication(id: string, data: Partial<PatentApplication>) {
  const { data: result, error } = await supabase
    .from('patent_applications')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update patent application: ${error.message}`);
  }

  return result;
}

export async function getPatentApplications(userId: string) {
  const { data, error } = await supabase
    .from('patent_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch patent applications: ${error.message}`);
  }

  return data || [];
}

export function calculateApplicationFee(
  category: 'natural_person' | 'startup' | 'small_entity' | 'others',
  claimCount: number,
  sheetCount: number,
  isOnline: boolean = true
) {
  // Base fees for different categories (online/offline)
  const baseFees = {
    natural_person: { online: 1600, offline: 1750 },
    startup: { online: 1600, offline: 1750 },
    small_entity: { online: 4000, offline: 4400 },
    others: { online: 8000, offline: 8800 }
  };

  // Excess claim fees (per claim over 10)
  const excessClaimFees = {
    natural_person: { online: 160, offline: 180 },
    startup: { online: 160, offline: 180 },
    small_entity: { online: 400, offline: 440 },
    others: { online: 800, offline: 880 }
  };

  // Excess sheet fees (per sheet over 30)
  const excessSheetFees = {
    natural_person: { online: 160, offline: 180 },
    startup: { online: 160, offline: 180 },
    small_entity: { online: 400, offline: 440 },
    others: { online: 800, offline: 880 }
  };

  const mode = isOnline ? 'online' : 'offline';
  const baseFee = baseFees[category][mode];
  
  const excessClaims = Math.max(0, claimCount - 10);
  const excessClaimFee = excessClaims * excessClaimFees[category][mode];
  
  const excessSheets = Math.max(0, sheetCount - 30);
  const excessSheetFee = excessSheets * excessSheetFees[category][mode];
  
  const totalFee = baseFee + excessClaimFee + excessSheetFee;

  return {
    baseFee,
    excessClaimFee,
    excessSheetFee,
    totalFee,
    excessClaims,
    excessSheets
  };
}

export function formDataToApplicantData(formData: any): ApplicantData {
  // Helper function to safely get string values
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.value !== undefined) return String(value.value);
    return String(value);
  };

  // Map form application type to schema application type
  const mapApplicationType = (formType: string): 'ordinary' | 'convention' | 'pct-np' | 'pph' => {
    switch (formType) {
      case 'Provisional':
      case 'provisional':
        return 'ordinary';
      case 'Complete':
      case 'complete':
        return 'ordinary';
      case 'convention':
        return 'convention';
      case 'pct-np':
        return 'pct-np';
      case 'pph':
        return 'pph';
      default:
        return 'ordinary';
    }
  };

  return {
    application_type: mapApplicationType(safeString(formData.applicationType)),
    application_no: `IN${new Date().getFullYear()}${Math.floor(Math.random() * 900000) + 100000}`,
    filing_date: new Date().toLocaleDateString('en-GB'),
    fee_paid: `₹${formData.fees || 0}`,
    cbr_no: `CBR-${Math.floor(Math.random() * 90000) + 10000}`,
    
    applicant_name: safeString(formData.applicantName),
    applicant_nationality: safeString(formData.applicantNationality) || 'Indian',
    applicant_address: safeString(formData.applicantAddress),
    applicant_category: formData.applicantType === 'individual' ? 'natural_person' : 'others',
    
    inventor_is_applicant: formData.inventorAsApplicant || false,
    inventor_name: safeString(formData.inventorName),
    inventor_address: safeString(formData.inventorAddress),
    inventor_nationality: safeString(formData.inventorNationality) || 'Indian',
    
    title_of_invention: safeString(formData.title),
    abstract: safeString(formData.abstract),
    claims: safeString(formData.claims),
    description: safeString(formData.description),
    background: safeString(formData.background),
    
    declaration_of_inventorship: formData.declarationOfInventorship || false,
    declaration_of_ownership: formData.declarationOfOwnership || false,
    
    provisional_specification: formData.provisionalSpecification || false,
    complete_specification: formData.completeSpecification || false,
    drawings: formData.drawings || false,
    sequence_listing: formData.sequenceListing || false,
    
    invention_field: safeString(formData.inventionField),
    prior_art: safeString(formData.priorArt),
    problem_addressed: safeString(formData.problemAddressed),
    proposed_solution: safeString(formData.proposedSolution),
    advantages: safeString(formData.advantages),
  };
}
