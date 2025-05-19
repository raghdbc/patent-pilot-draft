
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormTooltip } from "../../FormTooltip";
import { Form1Values } from "../form1Schema";

interface AdditionalDetailsSectionProps {
  form: UseFormReturn<Form1Values>;
}

export function AdditionalDetailsSection({ form }: AdditionalDetailsSectionProps) {
  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Additional Details</h3>
      
      <FormField
        control={form.control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Additional Information
              <FormTooltip content="Any additional information that might be relevant for the patent application." />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any additional information (optional)"
                {...field}
                rows={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
