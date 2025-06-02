
import { useState, useEffect } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ApplicantCategory, ApplicantMode, YesNoOption } from "@/models/patentApplication";
import { FormTooltip } from "../FormTooltip";
import { Plus, Minus, User, Users } from "lucide-react";

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

interface ApplicantDetailsSectionProps {
  form: UseFormReturn<any>;
}

export function ApplicantDetailsSection({ form }: ApplicantDetailsSectionProps) {
  const applicantMode = form.watch('applicantMode');
  const inventors = form.watch('inventors') || [];
  const preConfiguredApplicant = form.watch('preConfiguredApplicant');
  const wantToPreConfigure = form.watch('wantToPreConfigure');
  
  const { fields: additionalApplicantFields, append: appendApplicant, remove: removeApplicant } = useFieldArray({
    control: form.control,
    name: "applicants.additionalApplicants"
  });
  
  useEffect(() => {
    // If applicantMode is 'fixed' or 'fixed_plus', set the fixed applicant to the preConfiguredApplicant
    if ((applicantMode === 'fixed' || applicantMode === 'fixed_plus') && preConfiguredApplicant) {
      form.setValue('applicants.fixed', preConfiguredApplicant);
    }
    // Clear fixed applicant if mode is no_applicant_configured
    if (applicantMode === 'no_applicant_configured') {
      form.setValue('applicants.fixed', undefined);
    }
  }, [applicantMode, preConfiguredApplicant, form]);
  
  // Check if fixed modes should be available
  const fixedModesAvailable = wantToPreConfigure === 'yes' && preConfiguredApplicant;
  
  const handleAddApplicant = () => {
    appendApplicant({
      name: "",
      nationality: "Indian",
      residency: "Indian",
      state: "",
      address: "",
      category: "natural_person"
    });
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Applicant Details Section</h3>
      
      <FormField
        control={form.control}
        name="applicantMode"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Applicant Mode
              <FormTooltip content="Choose how to configure the applicants for this application" />
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no_applicant_configured" id="no-configured" />
                  <Label htmlFor="no-configured">No Applicant Configured</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" disabled={!fixedModesAvailable} />
                  <Label htmlFor="fixed" className={!fixedModesAvailable ? "opacity-50" : ""}>Fixed</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed_plus" id="fixed-plus" disabled={!fixedModesAvailable} />
                  <Label htmlFor="fixed-plus" className={!fixedModesAvailable ? "opacity-50" : ""}>Fixed++</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              {!fixedModesAvailable && (
                <span className="text-amber-600">
                  To use Fixed or Fixed++ modes, you need to pre-configure an applicant in the previous step
                </span>
              )}
              {fixedModesAvailable && (
                <span>
                  Choose how to use your pre-configured applicant
                </span>
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Mode: No Applicant Configured */}
      {applicantMode === 'no_applicant_configured' && (
        <div className="space-y-4">
          <div className="pt-4">
            <h4 className="font-medium mb-2 flex items-center justify-between">
              <span>+ Add Applicant</span>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={handleAddApplicant}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Applicant
              </Button>
            </h4>
            
            {additionalApplicantFields.length > 0 ? (
              <div className="space-y-6">
                {additionalApplicantFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Applicant {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeApplicant(index)}
                          className="text-destructive hover:text-destructive/90 flex items-center gap-1"
                        >
                          <Minus className="h-4 w-4" /> Remove
                        </Button>
                      </div>
                      
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`applicants.additionalApplicants.${index}.name`}
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
                          name={`applicants.additionalApplicants.${index}.category`}
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`applicants.additionalApplicants.${index}.nationality`}
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
                          name={`applicants.additionalApplicants.${index}.residency`}
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
                        
                        {form.watch(`applicants.additionalApplicants.${index}.residency`) === "Indian" && (
                          <FormField
                            control={form.control}
                            name={`applicants.additionalApplicants.${index}.state`}
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
                          name={`applicants.additionalApplicants.${index}.address`}
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No applicants added yet</p>
                <Button onClick={handleAddApplicant}>
                  <Plus className="mr-2 h-4 w-4" /> Add Applicant
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Mode: Fixed Applicant */}
      {applicantMode === 'fixed' && preConfiguredApplicant && (
        <Card className="border-green-200">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="text-base flex items-center text-green-800">
              <User className="h-5 w-5 mr-2" />
              Pre-configured Applicant (Read-only)
            </CardTitle>
            <FormDescription>
              Cannot add/edit anything in Fixed mode
            </FormDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Name:</span>
                <p className="text-muted-foreground">{preConfiguredApplicant.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Category:</span>
                <p className="text-muted-foreground">{preConfiguredApplicant.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Nationality:</span>
                <p className="text-muted-foreground">{preConfiguredApplicant.nationality}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Residency:</span>
                <p className="text-muted-foreground">{preConfiguredApplicant.residency}</p>
              </div>
              {preConfiguredApplicant.state && (
                <div>
                  <span className="text-sm font-medium">State:</span>
                  <p className="text-muted-foreground">{preConfiguredApplicant.state}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium">Address:</span>
                <p className="text-muted-foreground whitespace-pre-line">{preConfiguredApplicant.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Mode: Fixed++ */}
      {applicantMode === 'fixed_plus' && preConfiguredApplicant && (
        <div className="space-y-4">
          {/* Show preconfigured applicant */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50 border-b border-green-200">
              <CardTitle className="text-base flex items-center text-green-800">
                <User className="h-5 w-5 mr-2" />
                Pre-configured Applicant (Read-only)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Name:</span>
                  <p className="text-muted-foreground">{preConfiguredApplicant.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Category:</span>
                  <p className="text-muted-foreground">{preConfiguredApplicant.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Nationality:</span>
                  <p className="text-muted-foreground">{preConfiguredApplicant.nationality}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Residency:</span>
                  <p className="text-muted-foreground">{preConfiguredApplicant.residency}</p>
                </div>
                {preConfiguredApplicant.state && (
                  <div>
                    <span className="text-sm font-medium">State:</span>
                    <p className="text-muted-foreground">{preConfiguredApplicant.state}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium">Address:</span>
                  <p className="text-muted-foreground whitespace-pre-line">{preConfiguredApplicant.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Option to add additional applicants */}
          <div className="pt-4">
            <h4 className="font-medium mb-2 flex items-center justify-between">
              <span>+ Add Applicant</span>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={handleAddApplicant}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Applicant
              </Button>
            </h4>
            
            {additionalApplicantFields.length > 0 ? (
              <div className="space-y-6">
                {additionalApplicantFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Applicant {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeApplicant(index)}
                          className="text-destructive hover:text-destructive/90 flex items-center gap-1"
                        >
                          <Minus className="h-4 w-4" /> Remove
                        </Button>
                      </div>
                      
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`applicants.additionalApplicants.${index}.name`}
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
                          name={`applicants.additionalApplicants.${index}.category`}
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`applicants.additionalApplicants.${index}.nationality`}
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
                          name={`applicants.additionalApplicants.${index}.residency`}
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
                        
                        {form.watch(`applicants.additionalApplicants.${index}.residency`) === "Indian" && (
                          <FormField
                            control={form.control}
                            name={`applicants.additionalApplicants.${index}.state`}
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
                          name={`applicants.additionalApplicants.${index}.address`}
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No additional applicants added yet</p>
                <Button onClick={handleAddApplicant}>
                  <Plus className="mr-2 h-4 w-4" /> Add Applicant
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
