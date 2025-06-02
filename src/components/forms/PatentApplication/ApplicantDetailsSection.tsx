
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
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const inventors = form.watch('inventors') || [];
  
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
      <h3 className="text-lg font-medium">Applicant Details Section</h3>
      
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
    </div>
  );
}
