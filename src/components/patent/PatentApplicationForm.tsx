
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicantData, emptyApplicantData } from "@/utils/applicantSchema";
import { useGenerateDocument } from "@/hooks/useGenerateDocument";
import { enhancePatentContent } from "@/services/openaiService";
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
import { Tabs, TabsContent, TabsHeader, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, FileText, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form schema validation
const formSchema = z.object({
  application_type: z.enum(['ordinary', 'convention', 'pct-np', 'pph']),
  application_no: z.string().optional(),
  filing_date: z.string(),
  fee_paid: z.string().optional(),
  cbr_no: z.string().optional(),
  
  applicant_name: z.string().min(2, { message: "Applicant name is required" }),
  applicant_nationality: z.string().min(2, { message: "Nationality is required" }),
  applicant_address: z.string().min(5, { message: "Address is required" }),
  applicant_category: z.enum(['natural_person', 'startup', 'small_entity', 'others']),
  
  inventor_is_applicant: z.boolean(),
  inventor_name: z.string().optional(),
  inventor_address: z.string().optional(),
  inventor_nationality: z.string().optional(),
  
  title_of_invention: z.string().min(5, { message: "Title is required" }),
  abstract: z.string().min(10, { message: "Abstract is required" }),
  claims: z.string().optional(),
  description: z.string().min(10, { message: "Description is required" }),
  background: z.string().min(10, { message: "Background is required" }),
  
  declaration_of_inventorship: z.boolean(),
  declaration_of_ownership: z.boolean(),
  
  provisional_specification: z.boolean(),
  complete_specification: z.boolean(),
  drawings: z.boolean(),
  sequence_listing: z.boolean(),
  
  invention_field: z.string().min(5, { message: "Field of invention is required" }),
  prior_art: z.string().min(5, { message: "Prior art description is required" }),
  problem_addressed: z.string().min(5, { message: "Problem statement is required" }),
  proposed_solution: z.string().min(5, { message: "Solution description is required" }),
  advantages: z.string().min(5, { message: "Advantages are required" }),
}).refine(data => {
  // If inventor is not the applicant, these fields are required
  if (!data.inventor_is_applicant) {
    return !!data.inventor_name && 
           !!data.inventor_address && 
           !!data.inventor_nationality;
  }
  return true;
}, {
  message: "Inventor information is required when different from applicant",
  path: ["inventor_name"],
});

export function PatentApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEnhancingContent, setIsEnhancingContent] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [enhancementComplete, setEnhancementComplete] = useState(false);
  const { generateAllDocuments, isGenerating } = useGenerateDocument();
  
  const form = useForm<ApplicantData>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyApplicantData,
  });
  
  const totalSteps = 5;
  
  // Handle moving to next step
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
  
  const getFieldsForCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return ['application_type', 'application_no', 'filing_date', 'fee_paid', 'cbr_no'];
      case 2:
        return [
          'applicant_name', 'applicant_nationality', 'applicant_address', 'applicant_category',
          'inventor_is_applicant', 'inventor_name', 'inventor_address', 'inventor_nationality'
        ];
      case 3:
        return ['title_of_invention', 'abstract', 'claims', 'description', 'background'];
      case 4:
        return [
          'declaration_of_inventorship', 'declaration_of_ownership',
          'provisional_specification', 'complete_specification', 'drawings', 'sequence_listing'
        ];
      case 5:
        return ['invention_field', 'prior_art', 'problem_addressed', 'proposed_solution', 'advantages'];
      default:
        return [];
    }
  };
  
  const enhanceDraftContent = async () => {
    try {
      setIsEnhancingContent(true);
      const formData = form.getValues();
      
      // In a real application, you would set the API key from an environment variable
      // For this demo, we're using a simulated API call
      const enhancedContent = await enhancePatentContent(formData);
      
      // Update form with enhanced content
      Object.entries(enhancedContent).forEach(([key, value]) => {
        form.setValue(key as any, value as any);
      });
      
      setEnhancementComplete(true);
    } catch (error) {
      console.error("Error enhancing content:", error);
    } finally {
      setIsEnhancingContent(false);
    }
  };
  
  const onSubmit = async (data: ApplicantData) => {
    try {
      // If inventor is applicant, copy applicant details to inventor
      if (data.inventor_is_applicant) {
        data.inventor_name = data.applicant_name;
        data.inventor_address = data.applicant_address;
        data.inventor_nationality = data.applicant_nationality;
      }
      
      // In a real app, you'd save this to the database first
      console.log("Form submitted with data:", data);
      
      // Generate documents
      await generateAllDocuments(data);
      
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Patent Application</CardTitle>
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
              {/* Step 1: Basic Application Details */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-lg font-bold">Basic Application Details</h2>
                  
                  <FormField
                    control={form.control}
                    name="application_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Type</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="ordinary" id="ordinary" />
                              <FormLabel htmlFor="ordinary" className="font-normal">Ordinary</FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="convention" id="convention" />
                              <FormLabel htmlFor="convention" className="font-normal">Convention</FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="pct-np" id="pct-np" />
                              <FormLabel htmlFor="pct-np" className="font-normal">PCT-NP</FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="pph" id="pph" />
                              <FormLabel htmlFor="pph" className="font-normal">PPH</FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="application_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. IN2025012345" {...field} />
                          </FormControl>
                          <FormDescription>
                            Will be assigned officially after filing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="filing_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            Today's date by default
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fee_paid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fee Paid</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. ₹9,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cbr_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CBR Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. CBR-67890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              {/* Step 2: Applicant & Inventor Details */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-lg font-bold">Applicant & Inventor Details</h2>
                  
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold">Applicant Information</h3>
                    <FormField
                      control={form.control}
                      name="applicant_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Applicant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Acme Innovations Pvt. Ltd." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="applicant_nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Indian" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="applicant_category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={field.value}
                                onChange={field.onChange}
                              >
                                <option value="natural_person">Natural Person</option>
                                <option value="startup">Startup</option>
                                <option value="small_entity">Small Entity</option>
                                <option value="others">Others</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="applicant_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g. 123, 45th Main, HSR Layout, Bengaluru – 560102" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-md font-semibold">Inventor Information</h3>
                      <FormField
                        control={form.control}
                        name="inventor_is_applicant"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Inventor is same as Applicant
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {!form.watch("inventor_is_applicant") && (
                      <>
                        <FormField
                          control={form.control}
                          name="inventor_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inventor Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Dr. John Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="inventor_nationality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nationality</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Indian" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="inventor_address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="e.g. 456, Inventors Lane, Mumbai – 400001" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Step 3: Patent Information */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-lg font-bold">Patent Information</h2>
                  
                  <FormField
                    control={form.control}
                    name="title_of_invention"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title of Invention</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Method and System for Automated Patent Drafting" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="abstract"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abstract</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief summary of the invention (100-150 words)" 
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A concise summary that describes the invention
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="background"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Problem addressed by the invention and limitations of existing solutions" 
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of how the invention works" 
                            className="h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="claims"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claims</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Legal claims defining the scope of protection sought (optional at this stage)" 
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Optional - you can add these later
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {/* Step 4: Declarations & Attachments */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-lg font-bold">Declarations & Attachments</h2>
                  
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold">Declarations</h3>
                    <FormField
                      control={form.control}
                      name="declaration_of_inventorship"
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
                              Declaration of Inventorship
                            </FormLabel>
                            <FormDescription>
                              I/We hereby declare that the true and first inventor(s) is/are as stated above.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="declaration_of_ownership"
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
                              Declaration of Ownership
                            </FormLabel>
                            <FormDescription>
                              I/We claim the ownership of this invention and the right to apply for a patent.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="text-md font-semibold">Attachments</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="provisional_specification"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel>
                              Provisional Specification
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="complete_specification"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel>
                              Complete Specification
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="drawings"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel>
                              Drawings
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="sequence_listing"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel>
                              Sequence Listing
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 5: Draft Details & OpenAI Enhancement */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-bold">Patent Draft Details</h2>
                  
                  <FormField
                    control={form.control}
                    name="invention_field"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Invention</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g. This invention relates to the field of intellectual property management software..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="prior_art"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prior Art / Existing Solutions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe existing solutions and their limitations..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="problem_addressed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Addressed</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What problem does your invention solve?" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="proposed_solution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Solution</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How does your invention solve the problem?" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="advantages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advantages</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What are the advantages of your invention over existing solutions?" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <h3 className="text-md font-semibold mb-4">Content Enhancement with AI</h3>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Input 
                          placeholder="OpenAI API Key (optional)" 
                          type="password"
                          value={openaiKey}
                          onChange={(e) => setOpenaiKey(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="secondary" 
                          onClick={enhanceDraftContent}
                          disabled={isEnhancingContent}
                          className="whitespace-nowrap"
                        >
                          {isEnhancingContent && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                          Enhance Draft Content
                        </Button>
                      </div>
                      
                      {enhancementComplete && (
                        <Alert className="bg-secondary">
                          <CheckCircle className="h-4 w-4" />
                          <AlertTitle>Content Enhanced</AlertTitle>
                          <AlertDescription>
                            Your draft content has been enhanced with AI. When you generate documents, both the original and enhanced versions will be included.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>OpenAI Integration</AlertTitle>
                        <AlertDescription>
                          Providing an OpenAI API key will allow the system to enhance your patent draft with professional language and additional details. This is completely optional.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
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
                    disabled={isGenerating}
                  >
                    {isGenerating && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Documents
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
