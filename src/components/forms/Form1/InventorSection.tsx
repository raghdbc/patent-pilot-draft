
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
  
  const [inventorAsApplicant, setInventorAsApplicant] = useState(true);

  // Watch for changes in inventor fields
  const inventorName = form.watch("inventorName");
  const inventorAddress = form.watch("inventorAddress");
  const inventorNationality = form.watch("inventorNationality");
  
  useEffect(() => {
    // Sync inventor data to applicant data when checkbox is checked
    if (inventorAsApplicant && (inventorName || inventorAddress || inventorNationality)) {
      form.setValue("applicantName", inventorName);
      form.setValue("applicantAddress", inventorAddress);
      form.setValue("applicantNationality", inventorNationality);
    }
  }, [inventorAsApplicant, inventorName, inventorAddress, inventorNationality, form]);

  const handleInventorAsApplicantChange = (checked: boolean) => {
    setInventorAsApplicant(checked);
  };

  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Inventor Details</h3>
      
      <div className="flex items-center space-x-2 mb-4 p-3 bg-slate-50 rounded-md border">
        <Checkbox 
          id="inventor-as-applicant" 
          checked={inventorAsApplicant}
          onCheckedChange={(checked) => handleInventorAsApplicantChange(!!checked)}
        />
        <label
          htmlFor="inventor-as-applicant"
          className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Use inventors as applicants
        </label>
        <FormTooltip content="Checking this will automatically add all inventors as applicants" />
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
              onValueChange={field.onChange}
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
        <div className="p-3 bg-blue-50 rounded-md border border-blue-200 text-sm">
          <p className="font-medium">Applicant details will automatically use the inventor details</p>
          <p className="text-muted-foreground mt-1">Uncheck the option above to edit applicant details separately</p>
        </div>
      )}
    </div>
  );
}
