
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoCircle, AlertTriangle } from "lucide-react";
import { FormTooltip } from "../FormTooltip";
import { 
  ApplicantCategory, 
  PublicationPreference,
  ExaminationPreference 
} from "@/models/patentApplication";
import { 
  calculateEarlyPublicationFee,
  isExpeditedExamAllowed
} from "@/utils/patentFormHelpers";

interface PublicationExaminationSectionProps {
  form: UseFormReturn<any>;
  feeMode?: 'online' | 'offline';
}

export function PublicationExaminationSection({
  form,
  feeMode = 'online'
}: PublicationExaminationSectionProps) {
  const applicationType = form.watch('applicationType');
  const applicants = form.watch('applicants');
  const preConfiguredApplicant = form.watch('preConfiguredApplicant');
  const applicantMode = form.watch('applicantMode');
  
  // Determine fee category based on applicant details
  const [feeCategory, setFeeCategory] = useState<ApplicantCategory>('natural_person');
  const [expeditedExamAllowed, setExpeditedExamAllowed] = useState<{allowed: boolean; reason?: string}>({ allowed: false });
  const [earlyPublicationFee, setEarlyPublicationFee] = useState<string>("0");
  
  useEffect(() => {
    // Determine primary applicant category for fee calculation
    let primaryCategory: ApplicantCategory = 'natural_person';
    
    if (applicantMode === 'fixed' || applicantMode === 'fixed_plus') {
      if (preConfiguredApplicant?.category) {
        primaryCategory = preConfiguredApplicant.category;
      }
    } else if (applicants?.additionalApplicants?.length > 0) {
      // Use first additional applicant's category
      primaryCategory = applicants.additionalApplicants[0].category;
    }
    
    setFeeCategory(primaryCategory);
    
    // Calculate early publication fee
    const fee = calculateEarlyPublicationFee(primaryCategory, feeMode);
    setEarlyPublicationFee(fee.toString());
    
    // Check if expedited examination is allowed
    if (applicants) {
      const result = isExpeditedExamAllowed(applicants);
      setExpeditedExamAllowed(result);
      
      // Update form value
      form.setValue('expeditedAllowed', result.allowed);
      if (result.reason) {
        form.setValue('expeditedReason', result.reason);
      }
    }
  }, [applicants, preConfiguredApplicant, applicantMode, feeMode, form]);
  
  // Only show these sections for Complete applications
  if (applicationType !== 'complete') {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {/* Publication Preference */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Publication Preference</h3>
        
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="publicationPreference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Publication Preference
                    <FormTooltip content="Choose when your application should be published" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ordinary" id="ordinary-pub" />
                        <Label htmlFor="ordinary-pub">
                          Ordinary Publication
                          <Badge variant="secondary" className="ml-2">Free</Badge>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="early" id="early-pub" />
                        <Label htmlFor="early-pub">
                          Early Publication
                          <Badge variant="outline" className="ml-2">₹{earlyPublicationFee}</Badge>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Ordinary publication occurs after 18 months. Early publication expedites this process.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch('publicationPreference') === 'early' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
                <InfoCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    Early publication fee will be applied: <strong>₹{earlyPublicationFee}</strong> ({feeMode})
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Examination Preference */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Examination Preference</h3>
        
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="examinationPreference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Examination Preference
                    <FormTooltip content="Choose the examination route for your application" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ordinary" id="ordinary-exam" />
                        <Label htmlFor="ordinary-exam">Ordinary Examination</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="expedited" 
                          id="expedited-exam" 
                          disabled={!expeditedExamAllowed.allowed}
                        />
                        <Label 
                          htmlFor="expedited-exam" 
                          className={!expeditedExamAllowed.allowed ? "text-gray-400" : ""}
                        >
                          Expedited Examination
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Expedited examination is only available for certain applicant categories.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!expeditedExamAllowed.allowed && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-700">
                    Expedited examination is not available for your applicant type.
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Only available for: startups, small entities, government entities, 
                    educational institutes, or if at least one applicant is a woman.
                  </p>
                </div>
              </div>
            )}
            
            {expeditedExamAllowed.allowed && expeditedExamAllowed.reason && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start gap-2">
                <InfoCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-700">
                    Expedited examination is available: <strong>{expeditedExamAllowed.reason}</strong>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
