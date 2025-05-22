
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { FormTooltip } from "../FormTooltip";
import { isExpeditedExamAllowed } from "@/utils/patentFormHelpers";

interface PublicationExaminationSectionProps {
  form: UseFormReturn<any>;
}

export function PublicationExaminationSection({ form }: PublicationExaminationSectionProps) {
  const [expeditedInfo, setExpeditedInfo] = useState<{ allowed: boolean; reason?: string }>({ allowed: false });
  
  const applicationType = form.watch('applicationType');
  const applicants = form.watch('applicants');
  
  // Check eligibility for expedited examination whenever applicants change
  useEffect(() => {
    if (applicants) {
      const result = isExpeditedExamAllowed(applicants);
      setExpeditedInfo(result);
    }
  }, [applicants]);
  
  if (applicationType !== 'complete') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Publication & Examination Preferences</h3>
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-yellow-500 mt-0.5" />
            <p className="text-sm">
              Publication and examination preferences are only applicable for complete applications.
              Please select 'Complete' as the application type if you want to set these preferences.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Publication & Examination Preferences</h3>
      
      {/* Publication Preference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Publication Preference</CardTitle>
          <CardDescription>
            Select if you want ordinary or early publication of your patent application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="publicationPreference"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="ordinary" id="ordinary" />
                      <div className="grid gap-1">
                        <Label htmlFor="ordinary" className="font-medium">Ordinary Publication</Label>
                        <p className="text-sm text-muted-foreground">
                          Standard publication timeline (no additional fee)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="early" id="early" />
                      <div className="grid gap-1">
                        <Label htmlFor="early" className="font-medium">Early Publication</Label>
                        <p className="text-sm text-muted-foreground">
                          Earlier publication with additional fee based on applicant category
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Examination Preference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Examination Preference</CardTitle>
          <CardDescription>
            Select if you want ordinary or expedited examination of your patent application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="examinationPreference"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="ordinary" id="ordinary-exam" />
                      <div className="grid gap-1">
                        <Label htmlFor="ordinary-exam" className="font-medium">Ordinary Examination</Label>
                        <p className="text-sm text-muted-foreground">
                          Standard examination timeline (typically 18-36 months)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem 
                        value="expedited" 
                        id="expedited" 
                        disabled={!expeditedInfo.allowed}
                      />
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <Label 
                            htmlFor="expedited" 
                            className={`font-medium ${!expeditedInfo.allowed ? 'text-muted-foreground' : ''}`}
                          >
                            Expedited Examination
                          </Label>
                          {expeditedInfo.allowed && expeditedInfo.reason && (
                            <Badge className="bg-green-500 text-xs">
                              {expeditedInfo.reason}
                            </Badge>
                          )}
                        </div>
                        {expeditedInfo.allowed ? (
                          <p className="text-sm text-muted-foreground">
                            Faster examination (typically 6-12 months) with additional fee
                          </p>
                        ) : (
                          <p className="text-sm text-red-500">
                            Expedited examination is only available for Startups, Small Entities, 
                            Government Entities, Education Institutes, or Women Applicants.
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
        </CardContent>
      </Card>
    </div>
  );
}
