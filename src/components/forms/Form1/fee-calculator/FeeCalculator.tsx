
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SheetCountTable } from "./SheetCountTable";
import { OtherDetailsTable } from "./OtherDetailsTable";
import { FeeSummary } from "./FeeSummary";
import { calculateApplicationFee } from "@/services/patentService";

interface FeeCalculatorProps {
  form: UseFormReturn<any>;
  userRole?: string;
}

export function FeeCalculator({ form, userRole = 'user' }: FeeCalculatorProps) {
  const [sheetCount, setSheetCount] = useState({
    description: 0,
    abstract: 0,
    claims: 0,
    drawings: 0
  });
  
  const [feeMode, setFeeMode] = useState<'online' | 'offline'>('online');
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
  
  const claimCount = parseInt(form.watch('claimCount') || '0');
  const totalSheetCount = Object.values(sheetCount).reduce((a, b) => a + b, 0);
  
  // Calculate fees based on applicant type and counts
  const fees = calculateApplicationFee(
    feeCategory,
    claimCount,
    totalSheetCount,
    feeMode === 'online'
  );

  const handleSheetCountChange = (type: keyof typeof sheetCount, value: string) => {
    setSheetCount(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  // Update form values when sheet counts change
  React.useEffect(() => {
    form.setValue('sheetCount', totalSheetCount);
    form.setValue('fees', fees.totalFee);
    form.setValue('feeDetails', {
      baseFee: fees.baseFee,
      excessClaimFee: fees.excessClaimFee,
      excessSheetFee: fees.excessSheetFee,
      online: feeMode === 'online',
      excessClaims: fees.excessClaims,
      excessSheets: fees.excessSheets
    });
  }, [sheetCount, feeMode, claimCount, applicantType, form]);

  return (
    <div>
      <div className="mb-4">
        <Tabs value={feeMode} onValueChange={(value) => setFeeMode(value as 'online' | 'offline')}>
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="online">Online Filing</TabsTrigger>
            <TabsTrigger value="offline">Offline Filing</TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">
            Select filing mode to see applicable fee structure
          </p>
        </Tabs>
      </div>
      
      <SheetCountTable 
        sheetCount={sheetCount} 
        handleSheetCountChange={handleSheetCountChange}
        totalSheetCount={totalSheetCount}
        fees={fees}
        feeCategory={feeCategory}
        feeMode={feeMode}
      />
      
      <div className="mt-4">
        <OtherDetailsTable 
          form={form}
          fees={fees}
          feeCategory={feeCategory}
          feeMode={feeMode}
        />
      </div>
      
      <div className="mt-4">
        <FeeSummary fees={fees} />
      </div>
    </div>
  );
}
