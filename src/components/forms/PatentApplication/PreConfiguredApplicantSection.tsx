
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { YesNoOption } from "@/models/patentApplication";
import { FormTooltip } from "../FormTooltip";

// Simplified country and state lists
const COUNTRIES = [
  "Indian",
  "American",
  "British",
  "Australian",
  "Canadian",
  "Chinese",
  "French",
  "German",
  "Japanese",
  "Other"
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
  "Other"
];

interface PreConfiguredApplicantSectionProps {
  form: UseFormReturn<any>;
}

export function PreConfiguredApplicantSection({ form }: PreConfiguredApplicantSectionProps) {
  const wantToPreConfigure = form.watch('wantToPreConfigure');
  const residency = form.watch('preConfiguredApplicant.residency');
  
  const handleWantToPreConfigureChange = (value: string) => {
    form.setValue('wantToPreConfigure', value as YesNoOption);
    
    // If user chooses "no", clear any pre-configured applicant data
    if (value === 'no') {
      form.setValue('preConfiguredApplicant', undefined);
      
      // If applicant mode was fixed or fixed++, reset it to no_applicant_configured
      const currentMode = form.getValues('applicantMode');
      if (currentMode === 'fixed' || currentMode === 'fixed_plus') {
        form.setValue('applicantMode', 'no_applicant_configured');
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Pre-Configure Applicant (Optional)</h3>
      <p className="text-muted-foreground">
        Optionally pre-configure an applicant that can be used in Fixed or Fixed++ mode
      </p>
      
      <FormField
        control={form.control}
        name="wantToPreConfigure"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Do you want to preconfigure the applicant?
              <FormTooltip content="Pre-configuring an applicant allows you to use it in Fixed or Fixed++ mode later" />
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => handleWantToPreConfigureChange(value)}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="pre-config-yes" />
                  <Label htmlFor="pre-config-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="pre-config-no" />
                  <Label htmlFor="pre-config-no">No</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {wantToPreConfigure === 'yes' && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Applicant Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preConfiguredApplicant.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter applicant's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preConfiguredApplicant.category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="natural_person">Human</SelectItem>
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="small_entity">Small</SelectItem>
                          <SelectItem value="large_entity">Large</SelectItem>
                          <SelectItem value="education_institute">Education Institute</SelectItem>
                          <SelectItem value="govt_entity">Govt Entity</SelectItem>
                          <SelectItem value="woman">Woman</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category affects fees and eligibility for expedited examination
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preConfiguredApplicant.nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
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
                          {COUNTRIES.map(country => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preConfiguredApplicant.residency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residency</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES.map(country => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {residency === "Indian" && (
                <FormField
                  control={form.control}
                  name="preConfiguredApplicant.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDIAN_STATES.map(state => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="preConfiguredApplicant.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter applicant's full address" 
                        className="min-h-20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
