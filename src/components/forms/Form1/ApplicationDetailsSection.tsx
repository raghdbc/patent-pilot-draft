
import { UseFormReturn } from "react-hook-form";
import { FormTooltip } from "../FormTooltip";
import { FeeCalculator } from "./fee-calculator/FeeCalculator";
import { PublicationPreference } from "./fee-calculator/PublicationPreference";

interface ApplicationDetailsSectionProps {
  form: UseFormReturn<any>;
  userRole?: string;
}

export function ApplicationDetailsSection({ form, userRole = 'user' }: ApplicationDetailsSectionProps) {
  const applicantType = form.watch('applicantType');
  
  // Map applicant type to fee category
  let feeCategory: 'natural_person' | 'startup' | 'small_entity' | 'others';
  if (applicantType === 'individual') {
    feeCategory = 'natural_person';
  } else if (applicantType === 'startup') {
    feeCategory = 'startup';
  } else if (applicantType === 'small_entity') {
    feeCategory = 'small_entity';
  } else {
    feeCategory = 'others';
  }

  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Application Details</h3>
      
      <FeeCalculator form={form} userRole={userRole} />
      
      <PublicationPreference 
        form={form} 
        userRole={userRole} 
        feeMode="online"
        feeCategory={feeCategory}
      />
    </div>
  );
}
