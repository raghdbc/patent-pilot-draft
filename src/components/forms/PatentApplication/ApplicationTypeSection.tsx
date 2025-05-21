
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApplicationType, YesNoOption } from "@/models/patentApplication";
import { FormTooltip } from "../FormTooltip";

interface ApplicationTypeSectionProps {
  form: UseFormReturn<any>;
}

export function ApplicationTypeSection({ form }: ApplicationTypeSectionProps) {
  const applicationType = form.watch('applicationType');
  const previousProvisionalFiled = form.watch('previousProvisionalFiled');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Application Type</h3>
      
      <FormField
        control={form.control}
        name="applicationType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Application Type 
              <FormTooltip content="Select the type of patent application you're filing" />
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="provisional" id="provisional" />
                  <Label htmlFor="provisional">Provisional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complete" id="complete" />
                  <Label htmlFor="complete">Complete</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              A provisional application establishes a priority date, while a complete application includes full details and claims.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {applicationType === 'complete' && (
        <FormField
          control={form.control}
          name="previousProvisionalFiled"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                Has a provisional application been filed for this invention?
                <FormTooltip content="Indicate if you have already filed a provisional application for this invention" />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="prev-yes" />
                    <Label htmlFor="prev-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="prev-no" />
                    <Label htmlFor="prev-no">No</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {applicationType === 'complete' && previousProvisionalFiled === 'yes' && (
        <FormField
          control={form.control}
          name="provisionalApplicationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Provisional Application Number
                <FormTooltip content="Enter the application number of your previously filed provisional application" />
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., 202141012345" {...field} />
              </FormControl>
              <FormDescription>
                This will link your complete application to the previously filed provisional application
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
