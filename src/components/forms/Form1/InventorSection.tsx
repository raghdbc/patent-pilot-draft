
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormTooltip } from "../FormTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";

interface InventorSectionProps {
  form: UseFormReturn<any>;
}

export function InventorSection({ form }: InventorSectionProps) {
  const countries = [
    "Indian",
    "American",
    "British",
    "Canadian",
    "Australian",
    "German",
    "French",
    "Japanese",
    "Chinese",
    "Other"
  ];
  
  const [inventorAsApplicant, setInventorAsApplicant] = useState(false);

  // Watch for changes in applicant name to disable manual editing when inventor as applicant is enabled
  const applicantName = form.watch("applicantName");
  const applicantAddress = form.watch("applicantAddress");
  const applicantNationality = form.watch("applicantNationality");
  
  // Check if user manually changed the applicant field while inventor as applicant was checked
  useEffect(() => {
    if (inventorAsApplicant) {
      // Sync inventor data to applicant data
      const inventorName = form.getValues("inventorName");
      const inventorAddress = form.getValues("inventorAddress");
      const inventorNationality = form.getValues("inventorNationality");
      
      form.setValue("applicantName", inventorName);
      form.setValue("applicantAddress", inventorAddress);
      form.setValue("applicantNationality", inventorNationality);
    }
  }, [inventorAsApplicant, form]);

  const handleInventorAsApplicantChange = (checked: boolean) => {
    setInventorAsApplicant(checked);
    
    if (checked) {
      // Copy inventor details to applicant fields
      const inventorName = form.getValues("inventorName");
      const inventorAddress = form.getValues("inventorAddress");
      const inventorNationality = form.getValues("inventorNationality");
      
      form.setValue("applicantName", inventorName);
      form.setValue("applicantAddress", inventorAddress);
      form.setValue("applicantNationality", inventorNationality);
    }
  };

  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Inventor Details</h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="inventor-as-applicant" 
          checked={inventorAsApplicant}
          onCheckedChange={(checked) => handleInventorAsApplicantChange(!!checked)}
        />
        <label
          htmlFor="inventor-as-applicant"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Use inventor details as applicant
        </label>
      </div>
      
      <FormField
        control={form.control}
        name="inventorName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Inventor Name
              <FormTooltip content="The inventor is the person who actually created the invention. This may be different from the applicant/patent owner." />
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter inventor name" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  if (inventorAsApplicant) {
                    form.setValue("applicantName", e.target.value);
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Full name of the person who created the invention.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="inventorAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Inventor Address
              <FormTooltip content="Provide the complete postal address of the inventor, including postal/zip code." />
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter complete address" 
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  if (inventorAsApplicant) {
                    form.setValue("applicantAddress", e.target.value);
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Complete postal address including city, state and pin code.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="inventorNationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Nationality
              <FormTooltip content="Nationality of the inventor as per their passport or citizenship." />
            </FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (inventorAsApplicant) {
                  form.setValue("applicantNationality", value);
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {inventorAsApplicant && (
        <div className="p-3 bg-slate-50 rounded-md border text-sm">
          <p className="font-medium">Applicant details will automatically use the inventor details</p>
          <p className="text-muted-foreground mt-1">Uncheck the option above to edit applicant details separately</p>
        </div>
      )}
    </div>
  );
}
