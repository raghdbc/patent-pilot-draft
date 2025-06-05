import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGenerateDocument } from "@/hooks/useGenerateDocument";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Loader, Info, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// List of countries for dropdown
const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "France", "Japan", "China", "Brazil", "Other"
];

// List of Indian states
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", 
  "Puducherry", "Andaman and Nicobar Islands"
];

// Type definitions
interface Inventor {
  name: string;
  gender: 'Male' | 'Female' | 'Others' | 'Prefer not to disclose';
  nationality: string;
  residency: string;
  state: string;
  address: string;
}

interface Applicant {
  name: string;
  nationality: string;
  residency: string;
  state: string;
  address: string;
  category: 'Human being' | 'Company' | 'Startup' | 'Small' | 'Large' | 'Education institute';
}

interface PatentFormData {
  applicationType: 'Provisional' | 'Complete';
  previousProvisionalFiled?: 'Yes' | 'No';
  provisionalApplicationNumber?: string;
  inventors: Inventor[];
  applicants: Applicant[];
  applicantMode: 'No applicant configured' | 'Fixed applicant' | 'Fixed++';
  populateFromInventors: boolean;
  applicationDetails: {
    title: string;
    sheetCount: number;
    claimCount?: number;
    others?: string;
    excessSheetFee?: number;
    excessClaimFee?: number;
  };
  publicationPreference?: 'Ordinary' | 'Early';
  publicationFee?: number;
  examinationPreference?: 'Ordinary' | 'Expedited';
  examinationFee?: number;
}

// Form schema for validation
const inventorSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  gender: z.enum(['Male', 'Female', 'Others', 'Prefer not to disclose']),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  residency: z.string().min(1, { message: "Residency is required" }),
  state: z.string().optional(),
  address: z.string().min(5, { message: "Address is required" })
});

const applicantSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  residency: z.string().min(1, { message: "Residency is required" }),
  state: z.string().optional(),
  address: z.string().min(5, { message: "Address is required" }),
  category: z.enum(['Human being', 'Company', 'Startup', 'Small', 'Large', 'Education institute'])
});

const patentFormSchema = z.object({
  applicationType: z.enum(['Provisional', 'Complete']),
  previousProvisionalFiled: z.enum(['Yes', 'No']).optional(),
  provisionalApplicationNumber: z.string().optional().refine(
    (val) => {
      // If previousProvisionalFiled is Yes, require application number
      return true;
    },
    { message: "Application number is required" }
  ),
  inventors: z.array(inventorSchema).min(1, { message: "At least one inventor is required" }),
  applicants: z.array(applicantSchema).min(1, { message: "At least one applicant is required" }),
  applicantMode: z.enum(['No applicant configured', 'Fixed applicant', 'Fixed++']),
  populateFromInventors: z.boolean(),
  applicationDetails: z.object({
    title: z.string().min(5, { message: "Title is required" }),
    sheetCount: z.number().min(1, { message: "Sheet count is required" }),
    claimCount: z.number().optional(),
    others: z.string().optional()
  }),
  publicationPreference: z.enum(['Ordinary', 'Early']).optional(),
  examinationPreference: z.enum(['Ordinary', 'Expedited']).optional()
});

export function PatentApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { generateDocument, isGenerating } = useGenerateDocument();
  
  // Initialize the form with default values
  const form = useForm<PatentFormData>({
    resolver: zodResolver(patentFormSchema),
    defaultValues: {
      applicationType: 'Provisional',
      inventors: [{ name: '', gender: 'Prefer not to disclose', nationality: 'India', residency: 'India', state: '', address: '' }],
      applicants: [],
      applicantMode: 'No applicant configured',
      populateFromInventors: true,
      applicationDetails: {
        title: '',
        sheetCount: 1,
        claimCount: 0
      }
    }
  });

  // Watch values for conditional rendering
  const applicationType = form.watch('applicationType');
  const previousProvisionalFiled = form.watch('previousProvisionalFiled');
  const residencyInventors = form.watch('inventors').map(inv => inv.residency);
  const residencyApplicants = form.watch('applicants').map(app => app.residency);
  const populateFromInventors = form.watch('populateFromInventors');
  const sheetCount = form.watch('applicationDetails.sheetCount');
  const claimCount = form.watch('applicationDetails.claimCount');
  
  // Calculate fees
  const calculateExcessSheetFee = (sheets: number): number => {
    if (sheets <= 30) return 0;
    return (sheets - 30) * 400; // Rs. 400 per excess sheet
  };
  
  const calculateExcessClaimFee = (claims: number): number => {
    if (claims <= 10) return 0;
    return (claims - 10) * 800; // Rs. 800 per excess claim
  };

  const excessSheetFee = calculateExcessSheetFee(sheetCount || 0);
  const excessClaimFee = calculateExcessClaimFee(claimCount || 0);
  
  // Publication and examination fees calculations
  const calculatedPublicationFee = applicationType === 'Complete' 
    ? (form.watch('publicationPreference') === 'Early' ? 12500 : 2500) 
    : 0;
    
  const calculatedExaminationFee = applicationType === 'Complete'
    ? (form.watch('examinationPreference') === 'Expedited' ? 8000 : 4000)
    : 0;
  
  // Total fees
  const totalFees = excessSheetFee + excessClaimFee + 
    (applicationType === 'Complete' ? calculatedPublicationFee + calculatedExaminationFee : 0);
  
  // Navigation functions
  const totalSteps = 5 + (applicationType === 'Complete' ? 2 : 0); // Additional steps for complete applications
  
  const handleNext = async () => {
    const fields = getFieldsForCurrentStep();
    const result = await form.trigger(fields as any);
    
    if (result) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Determine which fields to validate for the current step
  const getFieldsForCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return ['applicationType', 'previousProvisionalFiled', 'provisionalApplicationNumber'];
      case 2:
        return ['inventors'];
      case 3:
        return ['applicants', 'applicantMode', 'populateFromInventors'];
      case 4:
        return ['applicationDetails'];
      case 5:
        return applicationType === 'Complete' ? ['publicationPreference'] : [];
      case 6:
        return applicationType === 'Complete' ? ['examinationPreference'] : [];
      default:
        return [];
    }
  };
  
  // Handle adding and removing inventors
  const addInventor = () => {
    const currentInventors = form.getValues('inventors');
    form.setValue('inventors', [
      ...currentInventors, 
      { name: '', gender: 'Prefer not to disclose', nationality: 'India', residency: 'India', state: '', address: '' }
    ]);
  };
  
  const removeInventor = (index: number) => {
    const currentInventors = form.getValues('inventors');
    if (currentInventors.length > 1) {
      form.setValue('inventors', currentInventors.filter((_, i) => i !== index));
    }
  };
  
  // Handle adding and removing applicants
  const addApplicant = () => {
    const currentApplicants = form.getValues('applicants');
    form.setValue('applicants', [
      ...currentApplicants, 
      { name: '', nationality: 'India', residency: 'India', state: '', address: '', category: 'Human being' }
    ]);
  };
  
  const removeApplicant = (index: number) => {
    const currentApplicants = form.getValues('applicants');
    if (currentApplicants.length > 0) {
      form.setValue('applicants', currentApplicants.filter((_, i) => i !== index));
    }
  };
  
  // Populate applicants from inventors
  const populateApplicantsFromInventors = () => {
    if (populateFromInventors) {
      const inventors = form.getValues('inventors');
      const applicants = inventors.map(inventor => ({
        name: inventor.name,
        nationality: inventor.nationality,
        residency: inventor.residency,
        state: inventor.state,
        address: inventor.address,
        category: 'Human being' as const
      }));
      form.setValue('applicants', applicants);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: PatentFormData) => {
    try {
      setIsSubmitting(true);
      
      // Add calculated fee information
      data.applicationDetails.excessSheetFee = excessSheetFee;
      data.applicationDetails.excessClaimFee = excessClaimFee;
      data.publicationFee = calculatedPublicationFee;
      data.examinationFee = calculatedExaminationFee;
      
      console.log("Form submitted with data:", data);
      
      // In a real application, you would send this data to the server
      // and then generate the documents
      
      toast({
        title: "Application submitted",
        description: "Your patent application has been submitted successfully",
      });
      
      // Generate documents - using the correct method name
      // await generateDocument('patent-application', transformedData);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting the form",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>Patent Application Form</div>
            <Badge variant={applicationType === 'Provisional' ? "secondary" : "default"}>
              {applicationType} Application
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }} 
              />
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Application Type */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold">Application Type</h2>
                    
                    <FormField
                      control={form.control}
                      name="applicationType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Select Application Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="Provisional" id="provisional" />
                                <Label htmlFor="provisional">Provisional</Label>
                              </div>
                              <div className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="Complete" id="complete" />
                                <Label htmlFor="complete">Complete</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            A provisional application establishes a priority date but requires a complete application within 12 months.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {applicationType === 'Complete' && (
                      <div className="space-y-4 border-l-2 pl-4 ml-2 border-muted">
                        <FormField
                          control={form.control}
                          name="previousProvisionalFiled"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Have you filed a provisional application in the last 12 months?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="yes-prev" />
                                    <Label htmlFor="yes-prev">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="no-prev" />
                                    <Label htmlFor="no-prev">No</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {previousProvisionalFiled === 'Yes' && (
                          <FormField
                            control={form.control}
                            name="provisionalApplicationNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Provisional Application Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g. 202101012345" />
                                </FormControl>
                                <FormDescription>
                                  Enter the application number of your previously filed provisional application
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Step 2: Inventor Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Inventor Details</h2>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addInventor}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Inventor</span>
                    </Button>
                  </div>
                  
                  {form.watch('inventors').map((_, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Inventor {index + 1}</h3>
                        {form.watch('inventors').length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInventor(index)}
                            className="h-8 px-2 text-destructive"
                          >
                            <MinusCircle className="h-4 w-4 mr-1" />
                            <span>Remove</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`inventors.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Full name of inventor" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`inventors.${index}.gender`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Others">Others</SelectItem>
                                  <SelectItem value="Prefer not to disclose">Prefer not to disclose</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`inventors.${index}.nationality`}
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
                          name={`inventors.${index}.residency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Residency</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country of residence" />
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
                      </div>
                      
                      {residencyInventors[index] === 'India' && (
                        <FormField
                          control={form.control}
                          name={`inventors.${index}.state`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {indianStates.map(state => (
                                    <SelectItem key={state} value={state}>{state}</SelectItem>
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
                        name={`inventors.${index}.address`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Complete address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  
                  {form.watch('inventors').length === 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        At least one inventor is required. Please add an inventor.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
              
              {/* Step 3: Applicant Details */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Applicant Details</h2>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={populateApplicantsFromInventors}
                        disabled={form.watch('inventors').length === 0}
                      >
                        Use Inventors as Applicants
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addApplicant}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        <span>Add Applicant</span>
                      </Button>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="applicantMode"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Applicant Mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-3 space-y-0">
                              <RadioGroupItem value="No applicant configured" id="no-applicant" />
                              <Label htmlFor="no-applicant">No applicant configured</Label>
                            </div>
                            <div className="flex items-center space-x-3 space-y-0">
                              <RadioGroupItem value="Fixed applicant" id="fixed-applicant" />
                              <Label htmlFor="fixed-applicant">Fixed applicant</Label>
                            </div>
                            <div className="flex items-center space-x-3 space-y-0">
                              <RadioGroupItem value="Fixed++" id="fixed-plus" />
                              <Label htmlFor="fixed-plus">Fixed++</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          Choose how applicants are configured for this patent
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="populateFromInventors"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Use inventors as applicants
                          </FormLabel>
                          <FormDescription>
                            Checking this will automatically add all inventors as applicants
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('applicants').map((_, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Applicant {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeApplicant(index)}
                          className="h-8 px-2 text-destructive"
                        >
                          <MinusCircle className="h-4 w-4 mr-1" />
                          <span>Remove</span>
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`applicants.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Full name or organization name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`applicants.${index}.category`}
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
                                  <SelectItem value="Human being">Human being</SelectItem>
                                  <SelectItem value="Company">Company</SelectItem>
                                  <SelectItem value="Startup">Startup</SelectItem>
                                  <SelectItem value="Small">Small Entity</SelectItem>
                                  <SelectItem value="Large">Large Entity</SelectItem>
                                  <SelectItem value="Education institute">Education Institute</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`applicants.${index}.nationality`}
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
                          name={`applicants.${index}.residency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Residency</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country of residence" />
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
                      </div>
                      
                      {residencyApplicants[index] === 'India' && (
                        <FormField
                          control={form.control}
                          name={`applicants.${index}.state`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {indianStates.map(state => (
                                    <SelectItem key={state} value={state}>{state}</SelectItem>
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
                        name={`applicants.${index}.address`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Complete address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  
                  {form.watch('applicants').length === 0 && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>No Applicants</AlertTitle>
                      <AlertDescription>
                        No applicants have been added yet. You can add applicants manually or populate from inventors.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
              
              {/* Step 4: Application Details */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-bold">Application Details</h2>
                  
                  <FormField
                    control={form.control}
                    name="applicationDetails.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title of Invention</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter the title of your invention" />
                        </FormControl>
                        <FormDescription>
                          The title should be clear, concise and accurately reflect the invention
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="applicationDetails.sheetCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Sheets</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              onChange={e => field.onChange(parseInt(e.target.value) || 1)} 
                              value={field.value} 
                            />
                          </FormControl>
                          <FormDescription>
                            Total number of pages in your specification
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="applicationDetails.claimCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Claims</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                              value={field.value || 0} 
                            />
                          </FormControl>
                          <FormDescription>
                            Total number of claims in your specification
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="applicationDetails.others"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Comments (Optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Any additional information about your application" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6 border rounded-md p-4">
                    <h3 className="font-medium mb-2">Fee Calculation</h3>
                    <div className="space-y-2">
                      {excessSheetFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Excess Sheet Fee ({sheetCount - 30} sheets @ ₹400 per sheet):</span>
                          <span>₹{excessSheetFee}</span>
                        </div>
                      )}
                      {excessClaimFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Excess Claim Fee ({claimCount - 10} claims @ ₹800 per claim):</span>
                          <span>₹{excessClaimFee}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Base Fee:</span>
                        <span>₹{applicationType === 'Provisional' ? '1,750' : '4,000'}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Additional Fees:</span>
                        <span>₹{excessSheetFee + excessClaimFee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 5: Publication Preference (Only for Complete Applications) */}
              {currentStep === 5 && applicationType === 'Complete' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-bold">Publication Preference</h2>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Publication Information</AlertTitle>
                    <AlertDescription>
                      All patent applications are published after 18 months from filing date. However, you can request early publication by paying an additional fee.
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="publicationPreference"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Publication Preference</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-3 space-y-0">
                              <RadioGroupItem value="Ordinary" id="ordinary-pub" />
                              <Label htmlFor="ordinary-pub">Ordinary (after 18 months) - ₹2,500</Label>
                            </div>
                            <div className="flex items-center space-x-3 space-y-0">
                              <RadioGroupItem value="Early" id="early-pub" />
                              <Label htmlFor="early-pub">Early (as soon as possible) - ₹12,500</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between font-medium">
                      <span>Publication Fee:</span>
                      <span>₹{calculatedPublicationFee}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 6: Examination Preference (Only for Complete Applications) */}
              {currentStep === 6 && applicationType === 'Complete' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-bold">Examination Preference</h2>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Examination Information</AlertTitle>
                    <AlertDescription>
                      A request for examination must be filed within 48 months from the priority date. Expedited examination is available for startups, small entities, and female applicants at an additional fee.
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="examinationPreference"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Examination Preference</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-3 space-y-0">
                              <RadioGroupItem value="Ordinary" id="ordinary-exam" />
                              <Label htmlFor="ordinary-exam">Ordinary - ₹4,000</Label>
                            </div>
                            <div className="flex items-center space-x-3 space-y-0">
                              <RadioGroupItem value="Expedited" id="expedited-exam" />
                              <Label htmlFor="expedited-exam">Expedited - ₹8,000</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between font-medium">
                      <span>Examination Fee:</span>
                      <span>₹{calculatedExaminationFee}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 7: Review and Submit */}
              {currentStep === totalSteps && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-bold">Review and Submit</h2>
                  
                  <div className="border rounded-md p-4 space-y-4">
                    <div>
                      <h3 className="font-medium">Application Type</h3>
                      <p>{applicationType} Application</p>
                      {applicationType === 'Complete' && previousProvisionalFiled === 'Yes' && (
                        <p className="text-sm text-muted-foreground">
                          Previous Provisional Application: {form.watch('provisionalApplicationNumber')}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Inventor(s)</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {form.watch('inventors').map((inventor, index) => (
                          <li key={index}>
                            {inventor.name}, {inventor.nationality}
                            <p className="text-sm text-muted-foreground">{inventor.address}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Applicant(s)</h3>
                      {form.watch('applicants').length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {form.watch('applicants').map((applicant, index) => (
                            <li key={index}>
                              {applicant.name}, {applicant.category}
                              <p className="text-sm text-muted-foreground">{applicant.address}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No applicants added</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Application Details</h3>
                      <p><strong>Title:</strong> {form.watch('applicationDetails.title')}</p>
                      <p><strong>Sheets:</strong> {form.watch('applicationDetails.sheetCount')}</p>
                      <p><strong>Claims:</strong> {form.watch('applicationDetails.claimCount') || 0}</p>
                    </div>
                    
                    {applicationType === 'Complete' && (
                      <>
                        <div>
                          <h3 className="font-medium">Publication</h3>
                          <p>{form.watch('publicationPreference')} Publication</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium">Examination</h3>
                          <p>{form.watch('examinationPreference')} Examination</p>
                        </div>
                      </>
                    )}
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium">Fee Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Base Filing Fee:</span>
                          <span>₹{applicationType === 'Provisional' ? '1,750' : '4,000'}</span>
                        </div>
                        {excessSheetFee > 0 && (
                          <div className="flex justify-between">
                            <span>Excess Sheet Fee:</span>
                            <span>₹{excessSheetFee}</span>
                          </div>
                        )}
                        {excessClaimFee > 0 && (
                          <div className="flex justify-between">
                            <span>Excess Claim Fee:</span>
                            <span>₹{excessClaimFee}</span>
                          </div>
                        )}
                        {applicationType === 'Complete' && (
                          <>
                            <div className="flex justify-between">
                              <span>Publication Fee:</span>
                              <span>₹{calculatedPublicationFee}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Examination Fee:</span>
                              <span>₹{calculatedExaminationFee}</span>
                            </div>
                          </>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total Fee:</span>
                          <span>₹{totalFees + (applicationType === 'Provisional' ? 1750 : 4000)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Ready to Submit</AlertTitle>
                    <AlertDescription>
                      Please review all the information above before submitting. Once submitted, you will be able to download the generated documents.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
