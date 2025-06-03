
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormTooltip } from "../../FormTooltip";
import { Form1Values } from "../form1Schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PriorityClaimsSectionProps {
  form: UseFormReturn<Form1Values>;
}

export function PriorityClaimsSection({ form }: PriorityClaimsSectionProps) {
  const claimPriority = form.watch("claimPriority");
  
  const countries = [
    "United States", "United Kingdom", "Germany", "France", "Japan", "China", 
    "South Korea", "Canada", "Australia", "Brazil", "India", "Other"
  ];

  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Priority Claims</h3>
      
      <FormField
        control={form.control}
        name="claimPriority"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center">
                Claim Priority from Earlier Application
                <FormTooltip content="Check this if you are claiming priority from an earlier patent application filed in any country." />
              </FormLabel>
              <FormDescription>
                You can claim priority from an application filed within the last 12 months.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      {claimPriority && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <FormField
            control={form.control}
            name="priorityCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Priority Country
                  <FormTooltip content="Select the country where the earlier application was filed." />
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
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
          
          <FormField
            control={form.control}
            name="priorityApplicationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Priority Application Number
                  <FormTooltip content="Enter the application number of the earlier filed application." />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter application number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priorityFilingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Priority Filing Date
                  <FormTooltip content="Enter the filing date of the earlier application (DD/MM/YYYY)." />
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priorityDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Additional Priority Details
                  <FormTooltip content="Provide any additional information about the priority claim." />
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional priority details (optional)"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
