
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormTooltip } from "../FormTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

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
  
  const applicantIsInventor = form.watch("applicantName") === form.watch("inventorName");

  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Inventor Details</h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="applicant-is-inventor" 
          checked={applicantIsInventor}
          onCheckedChange={(checked) => {
            if (checked) {
              form.setValue("inventorName", form.getValues("applicantName"));
              form.setValue("inventorAddress", form.getValues("applicantAddress"));
              form.setValue("inventorNationality", form.getValues("applicantNationality"));
            } else {
              form.setValue("inventorName", "");
              form.setValue("inventorAddress", "");
            }
          }}
        />
        <label
          htmlFor="applicant-is-inventor"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Applicant is also the inventor
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
              <Input placeholder="Enter inventor name" {...field} />
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
              <Input placeholder="Enter complete address" {...field} />
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
    </div>
  );
}
