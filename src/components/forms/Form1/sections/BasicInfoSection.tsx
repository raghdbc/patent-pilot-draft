
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormTooltip } from "../../FormTooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form1Values } from "../form1Schema";

interface BasicInfoSectionProps {
  form: UseFormReturn<Form1Values>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-medium">Invention Details</h3>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Title of Invention
              <FormTooltip content="The title should be concise but descriptive of your invention. It should reflect the technical field and specific feature of your invention." />
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter invention title" {...field} />
            </FormControl>
            <FormDescription>
              Keep the title clear, concise and specific to your invention.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="applicationType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="flex items-center">
              Application Type
              <FormTooltip content="Select the type of patent application you are filing." />
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded p-3 hover:bg-secondary">
                  <RadioGroupItem value="ordinary" id="ordinary" />
                  <Label htmlFor="ordinary">Ordinary</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded p-3 hover:bg-secondary">
                  <RadioGroupItem value="convention" id="convention" />
                  <Label htmlFor="convention">Convention</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded p-3 hover:bg-secondary">
                  <RadioGroupItem value="pct-np" id="pct-np" />
                  <Label htmlFor="pct-np">PCT-NP</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded p-3 hover:bg-secondary">
                  <RadioGroupItem value="pph" id="pph" />
                  <Label htmlFor="pph">PPH</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="applicantType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Applicant Type
              <FormTooltip content="An applicant can be an individual (natural person) or an organization (company, university, etc.). The applicant will be the owner of the patent once granted." />
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select applicant type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Select whether the applicant is an individual or an organization.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
