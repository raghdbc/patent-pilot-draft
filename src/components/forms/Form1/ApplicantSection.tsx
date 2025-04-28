
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormTooltip } from "../FormTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface ApplicantSectionProps {
  form: UseFormReturn<any>;
}

export function ApplicantSection({ form }: ApplicantSectionProps) {
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

  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Applicant Details</h3>
      
      <FormField
        control={form.control}
        name="applicantName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Applicant Name
              <FormTooltip content="The applicant is the person or organization that will own the patent rights. For student inventions, this is often the educational institution." />
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter applicant name" {...field} />
            </FormControl>
            <FormDescription>
              Full legal name of individual or organization applying for the patent.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="applicantAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Applicant Address
              <FormTooltip content="Provide the complete postal address of the applicant, including postal/zip code." />
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
        name="applicantNationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Nationality/Country of Incorporation
              <FormTooltip content="For individuals, provide the nationality. For organizations, provide the country of incorporation." />
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
            <FormDescription>
              For individuals, select nationality. For organizations, select country of incorporation.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
