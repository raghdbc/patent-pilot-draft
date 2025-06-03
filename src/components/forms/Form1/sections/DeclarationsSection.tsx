
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormTooltip } from "../../FormTooltip";
import { Form1Values } from "../form1Schema";

interface DeclarationsSectionProps {
  form: UseFormReturn<Form1Values>;
}

export function DeclarationsSection({ form }: DeclarationsSectionProps) {
  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Declarations</h3>
      
      <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
        <FormField
          control={form.control}
          name="declarationOfInventorship"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex items-center">
                  Declaration of Inventorship
                  <FormTooltip content="This declaration confirms that the named inventor(s) are the true and first inventor(s) of the invention." />
                </FormLabel>
                <FormDescription>
                  I/We hereby declare that the inventor(s) named above is/are the true and first inventor(s) of the invention disclosed and claimed herein.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="declarationOfOwnership"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex items-center">
                  Declaration of Ownership Rights
                  <FormTooltip content="This declaration confirms that the applicant has the right to apply for this patent." />
                </FormLabel>
                <FormDescription>
                  I/We hereby declare that the applicant has the right to apply for and be granted a patent for the invention disclosed herein.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
      
      <div className="p-3 bg-blue-50 rounded-md border border-blue-200 text-sm">
        <p className="font-medium">Important Notice:</p>
        <p className="text-muted-foreground mt-1">
          These declarations are legally binding. False statements may result in the invalidity of the patent and legal consequences.
        </p>
      </div>
    </div>
  );
}
