import { useState } from "react";
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
import { Plus, Minus } from "lucide-react";

// Simplified country and state lists (same as in InventorDetailsSection)
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
      <h3 className="text-lg font-medium">Applicant Details</h3>
      
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
                
                {wantToPreConfigure === 'yes' && preConfiguredApplicant && (
                  <>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed_plus" id="fixed-plus" />
                      <Label htmlFor="fixed-plus">Fixed++</Label>
                    </div>
                  </>
                )}
              </RadioGroup>
            </FormControl>
            <FormDescription>
              {wantToPreConfigure === 'yes' 
                ? 'Choose how to use your pre-configured applicant'
                : 'Select inventors as applicants or add new applicants'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Mode: No Applicant Configured */}
      {applicantMode === 'no_applicant_configured' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Inventors as Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              {inventors.length > 0 ? (
                <div className="space-y-4">
                  {inventors.map((inventor: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name={`applicants.fromInventors`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(inventor.name)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValue, inventor.name]);
                                  } else {
                                    field.onChange(currentValue.filter((name: string) => name !== inventor.name));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {inventor.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No inventors added yet. Please add inventors first.</p>
              )}
            </CardContent>
          </Card>
          
          <div className="pt-4">
            <h4 className="font-medium mb-2 flex items-center justify-between">
              <span>Additional Applicants</span>
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
                        {/* Name, Category, Nationality, Residency, State (if applicable), Address */}
                        <FormField
                          control={form.control}
                          name={`applicants.additionalApplicants.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
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
                                  <SelectItem value="natural_person">Human (Natural Person)</SelectItem>
                                  <SelectItem value="startup">Startup</SelectItem>
                                  <SelectItem value="small_entity">Small Entity</SelectItem>
                                  <SelectItem value="large_entity">Large Entity</SelectItem>
                                  <SelectItem value="education_institute">Educational Institute</SelectItem>
                                  <SelectItem value="govt_entity">Government Entity</SelectItem>
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
                        
                        {/* Rest of form fields for each applicant */}
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
                              <FormLabel>Country of Residence</FormLabel>
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
      
      {/* Mode: Fixed Applicant */}
      {applicantMode === 'fixed' && preConfiguredApplicant && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fixed Applicant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Name:</span>
                <p>{preConfiguredApplicant.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Category:</span>
                <p>{preConfiguredApplicant.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Nationality:</span>
                <p>{preConfiguredApplicant.nationality}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Residency:</span>
                <p>{preConfiguredApplicant.residency}</p>
              </div>
              {preConfiguredApplicant.state && (
                <div>
                  <span className="text-sm font-medium">State:</span>
                  <p>{preConfiguredApplicant.state}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium">Address:</span>
                <p className="whitespace-pre-line">{preConfiguredApplicant.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Mode: Fixed++ */}
      {applicantMode === 'fixed_plus' && preConfiguredApplicant && (
        <div className="space-y-4">
          {/* Show preconfigured applicant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fixed Applicant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Name:</span>
                  <p>{preConfiguredApplicant.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Category:</span>
                  <p>{preConfiguredApplicant.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Nationality:</span>
                  <p>{preConfiguredApplicant.nationality}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Residency:</span>
                  <p>{preConfiguredApplicant.residency}</p>
                </div>
                {preConfiguredApplicant.state && (
                  <div>
                    <span className="text-sm font-medium">State:</span>
                    <p>{preConfiguredApplicant.state}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium">Address:</span>
                  <p className="whitespace-pre-line">{preConfiguredApplicant.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Show inventor checkboxes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Inventors as Additional Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              {inventors.length > 0 ? (
                <div className="space-y-4">
                  {inventors.map((inventor: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name={`applicants.fromInventors`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(inventor.name)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValue, inventor.name]);
                                  } else {
                                    field.onChange(currentValue.filter((name: string) => name !== inventor.name));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {inventor.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No inventors added yet. Please add inventors first.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Option to add additional applicants */}
          <div className="pt-4">
            <h4 className="font-medium mb-2 flex items-center justify-between">
              <span>Additional Applicants</span>
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
                      {/* Same applicant form fields as in "No Applicant Configured" mode */}
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
                        {/* Same fields as above */}
                        <FormField
                          control={form.control}
                          name={`applicants.additionalApplicants.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
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
                                  <SelectItem value="natural_person">Human (Natural Person)</SelectItem>
                                  <SelectItem value="startup">Startup</SelectItem>
                                  <SelectItem value="small_entity">Small Entity</SelectItem>
                                  <SelectItem value="large_entity">Large Entity</SelectItem>
                                  <SelectItem value="education_institute">Educational Institute</SelectItem>
                                  <SelectItem value="govt_entity">Government Entity</SelectItem>
                                  <SelectItem value="woman">Woman</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Other fields (same as above) */}
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
                              <FormLabel>Country of Residence</FormLabel>
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
