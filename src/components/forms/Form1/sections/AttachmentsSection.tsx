
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

interface AttachmentsSectionProps {
  form: UseFormReturn<Form1Values>;
}

export function AttachmentsSection({ form }: AttachmentsSectionProps) {
  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Attachments</h3>
      
      <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
        <p className="text-sm text-muted-foreground mb-4">
          Please indicate which documents you are attaching with this application:
        </p>
        
        <FormField
          control={form.control}
          name="provisionalSpecification"
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
                  Provisional Specification
                  <FormTooltip content="A provisional specification provides an early filing date while allowing 12 months to file the complete specification." />
                </FormLabel>
                <FormDescription>
                  Temporary protection allowing time to develop the invention further.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="completeSpecification"
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
                  Complete Specification
                  <FormTooltip content="A complete specification includes the full description, claims, and drawings of the invention." />
                </FormLabel>
                <FormDescription>
                  Full patent specification with detailed description and claims.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="drawings"
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
                  Drawings/Figures
                  <FormTooltip content="Technical drawings or figures that illustrate the invention." />
                </FormLabel>
                <FormDescription>
                  Technical drawings or diagrams illustrating the invention.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sequenceListing"
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
                  Sequence Listing
                  <FormTooltip content="Required for biotechnology inventions involving nucleotide or amino acid sequences." />
                </FormLabel>
                <FormDescription>
                  For biotechnology inventions with genetic sequences.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
