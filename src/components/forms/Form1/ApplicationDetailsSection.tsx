
import { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormTooltip } from "../FormTooltip";
import { UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { calculateApplicationFee } from "@/services/patentService";
import { Badge } from "@/components/ui/badge";

interface ApplicationDetailsSectionProps {
  form: UseFormReturn<any>;
  userRole?: string; // To check if user is authorized for certain options
}

export function ApplicationDetailsSection({ form, userRole = 'user' }: ApplicationDetailsSectionProps) {
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

  useEffect(() => {
    // Update form values when sheet counts change
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

  // Check if user is authorized for expedited examination
  const canRequestExpedited = userRole === 'admin' || 
                             feeCategory === 'startup' || 
                             feeCategory === 'small_entity';

  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Application Details</h3>
      
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
      
      <Card className="p-4">
        <h4 className="font-medium mb-4">Sheet Count:</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">Item</th>
                <th className="border p-2 text-left">Number of sheets</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">
                  Patent document (from title to end of detailed description)
                </td>
                <td className="border p-2">
                  <Input
                    type="number"
                    min="0"
                    value={sheetCount.description}
                    onChange={(e) => handleSheetCountChange('description', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border p-2">Abstract</td>
                <td className="border p-2">
                  <Input
                    type="number"
                    min="0"
                    value={sheetCount.abstract}
                    onChange={(e) => handleSheetCountChange('abstract', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border p-2">Claims</td>
                <td className="border p-2">
                  <Input
                    type="number"
                    min="0"
                    value={sheetCount.claims}
                    onChange={(e) => handleSheetCountChange('claims', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border p-2">Drawing sheets</td>
                <td className="border p-2">
                  <Input
                    type="number"
                    min="0"
                    value={sheetCount.drawings}
                    onChange={(e) => handleSheetCountChange('drawings', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">Total sheets:</td>
                <td className="border p-2 font-medium">{totalSheetCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {totalSheetCount > 30 && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm">
            <p className="font-medium">Excess sheet fee: ₹{fees.excessSheetFee}</p>
            <p className="text-muted-foreground">
              ({fees.excessSheets} sheets over 30 @ 
              {feeMode === 'online' ? 
                ` ₹${feeCategory === 'natural_person' ? '160' : feeCategory === 'small_entity' ? '400' : '800'}` : 
                ` ₹${feeCategory === 'natural_person' ? '180' : feeCategory === 'small_entity' ? '440' : '880'}`} 
              per sheet for {feeCategory.replace('_', ' ')})
            </p>
          </div>
        )}
      </Card>
      
      <Card className="p-4">
        <h4 className="font-medium mb-4">Other Details:</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">Item</th>
                <th className="border p-2 text-left">Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">No. of claims</td>
                <td className="border p-2">
                  <Input
                    id="claimCount"
                    type="number"
                    min="0"
                    {...form.register('claimCount')}
                  />
                </td>
              </tr>
              <tr>
                <td className="border p-2">No. of drawings</td>
                <td className="border p-2">
                  <Input
                    id="drawingCount"
                    type="number"
                    min="0"
                    {...form.register('drawingCount')}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {claimCount > 10 && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm">
            <p className="font-medium">Excess claim fee: ₹{fees.excessClaimFee}</p>
            <p className="text-muted-foreground">
              ({fees.excessClaims} claims over 10 @ 
              {feeMode === 'online' ? 
                ` ₹${feeCategory === 'natural_person' ? '320' : feeCategory === 'small_entity' ? '800' : '1600'}` : 
                ` ₹${feeCategory === 'natural_person' ? '350' : feeCategory === 'small_entity' ? '880' : '1750'}`} 
              per claim for {feeCategory.replace('_', ' ')})
            </p>
          </div>
        )}
      </Card>
      
      <FormField
        control={form.control}
        name="publicationPreference"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="flex items-center">
              Publication Preference
              <FormTooltip content="Choose how your patent application will be published" />
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ordinary" id="ordinary" />
                  <Label htmlFor="ordinary">Ordinary Publication <Badge variant="outline" className="ml-2">Free</Badge></Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="expedited" 
                    id="expedited" 
                    disabled={!canRequestExpedited}
                  />
                  <div className="flex flex-col">
                    <Label 
                      htmlFor="expedited" 
                      className={!canRequestExpedited ? "text-muted-foreground" : ""}>
                      Expedited Examination 
                      <Badge variant="secondary" className="ml-2">
                        ₹{feeMode === 'online' ? 
                          (feeCategory === 'natural_person' ? '8,000' : '20,000') : 
                          (feeCategory === 'natural_person' ? '8,800' : '22,000')}
                      </Badge>
                    </Label>
                    {!canRequestExpedited && (
                      <p className="text-xs text-muted-foreground">
                        Only available for startups, small entities, or with special authorization
                      </p>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Card className="p-4 bg-slate-50">
        <h4 className="font-medium mb-2">Fee Summary:</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Basic filing fee:</span>
            <span>₹{fees.baseFee}</span>
          </div>
          {fees.excessClaimFee > 0 && (
            <div className="flex justify-between">
              <span>Excess claim fee:</span>
              <span>₹{fees.excessClaimFee}</span>
            </div>
          )}
          {fees.excessSheetFee > 0 && (
            <div className="flex justify-between">
              <span>Excess sheet fee:</span>
              <span>₹{fees.excessSheetFee}</span>
            </div>
          )}
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total fee ({feeMode}):</span>
            <span>₹{fees.totalFee}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
