
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FormTooltip } from "../../FormTooltip";

interface PublicationPreferenceProps {
  form: UseFormReturn<any>;
  userRole?: string;
  feeMode: 'online' | 'offline';
  feeCategory: string;
}

export function PublicationPreference({ 
  form, 
  userRole = 'user',
  feeMode,
  feeCategory
}: PublicationPreferenceProps) {
  // Check if user is authorized for expedited examination
  const canRequestExpedited = userRole === 'admin' || 
                             feeCategory === 'startup' || 
                             feeCategory === 'small_entity';
                             
  return (
    <FormField
      control={form.control}
      name="publicationPreference"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="flex items-center">
            Publication Preference
            <FormTooltip content="Choose how your patent application will be published" />
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ordinary" id="ordinary" />
                <Label htmlFor="ordinary">Ordinary Publication <Badge variant="outline" className="ml-2">Free</Badge></Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="expedited" 
                  id="expedited" 
                  disabled={!canRequestExpedited}
                />
                <div className="flex flex-col">
                  <Label 
                    htmlFor="expedited" 
                    className={!canRequestExpedited ? "text-muted-foreground" : ""}>
                    Expedited Examination 
                    <Badge variant="secondary" className="ml-2">
                      ₹{feeMode === 'online' ? 
                        (feeCategory === 'natural_person' ? '8,000' : '20,000') : 
                        (feeCategory === 'natural_person' ? '8,800' : '22,000')}
                    </Badge>
                  </Label>
                  {!canRequestExpedited && (
                    <p className="text-xs text-muted-foreground">
                      Only available for startups, small entities, or with special authorization
                    </p>
                  )}
                </div>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
