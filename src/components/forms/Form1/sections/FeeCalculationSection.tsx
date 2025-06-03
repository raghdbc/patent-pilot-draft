
import { UseFormReturn } from "react-hook-form";
import { FeeCalculator } from "../fee-calculator/FeeCalculator";
import { PublicationPreference } from "../fee-calculator/PublicationPreference";
import { Form1Values } from "../form1Schema";

interface FeeCalculationSectionProps {
  form: UseFormReturn<Form1Values>;
  userRole?: string;
}

export function FeeCalculationSection({ form, userRole = 'user' }: FeeCalculationSectionProps) {
  return (
    <div className="space-y-6 animate-slide-in">
      <h3 className="text-lg font-medium">Fee Calculation & Publication</h3>
      
      <div className="space-y-6">
        <PublicationPreference 
          form={form} 
          userRole={userRole}
          feeMode="online"
          feeCategory={form.watch('applicantType') === 'individual' ? 'natural_person' : 'others'}
        />
        
        <FeeCalculator form={form} userRole={userRole} />
      </div>
    </div>
  );
}
