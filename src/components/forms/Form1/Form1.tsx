
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormProgress } from "../FormProgress";
import { FormTooltip } from "../FormTooltip";
import { ApplicantSection } from "./ApplicantSection";
import { InventorSection } from "./InventorSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useGenerateDocument } from "@/hooks/useGenerateDocument";

const form1Schema = z.object({
  // Basic information
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  applicantType: z.enum(["individual", "organization"]),
  applicationType: z.enum(["ordinary", "convention", "pct-np", "pph"]).default("ordinary"),
  
  // This is a simplified schema - in a real implementation, 
  // we would have more detailed validation and nested objects
  applicantName: z.string().min(2),
  applicantAddress: z.string().min(5),
  applicantNationality: z.string().min(2),
  
  inventorName: z.string().min(2),
  inventorAddress: z.string().min(5),
  inventorNationality: z.string().min(2),
  
  claimPriority: z.boolean().default(false),
  priorityDetails: z.string().optional(),
  
  additionalInfo: z.string().optional(),
});

type Form1Values = z.infer<typeof form1Schema>;

export function Form1() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [activeTab, setActiveTab] = useState("fillForm");
  const { generateDocument, isGenerating } = useGenerateDocument();
  
  const form = useForm<Form1Values>({
    resolver: zodResolver(form1Schema),
    defaultValues: {
      title: "",
      applicantType: "individual",
      applicationType: "ordinary",
      applicantName: "",
      applicantAddress: "",
      applicantNationality: "Indian",
      inventorName: "",
      inventorAddress: "",
      inventorNationality: "Indian",
      claimPriority: false,
      priorityDetails: "",
      additionalInfo: "",
    },
  });

  function onSubmit(data: Form1Values) {
    console.log(data);
    // In a real implementation, this would save to a database
    setActiveTab("preview");
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleDownloadDocument = async () => {
    try {
      const data = form.getValues();
      
      // Format the data for the template
      const templateData = {
        application_no: `IN${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
        filing_date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        fee_paid: "₹9,000",
        cbr_no: `CBR-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
        applicant_name: data.applicantName,
        applicant_nationality: data.applicantNationality,
        applicant_address: data.applicantAddress,
        inventor_name: data.inventorName,
        inventor_nationality: data.inventorNationality,
        inventor_address: data.inventorAddress,
        application_type: data.applicationType,
        invention_title: data.title,
        additional_info: data.additionalInfo || "",
      };

      await generateDocument("form1", templateData);
      toast({
        title: "Document generated",
        description: "Your Form 1 document has been generated successfully",
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Form 1 - Application for Grant of Patent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fillForm">Fill Form</TabsTrigger>
              <TabsTrigger value="preview" disabled={!form.formState.isSubmitted}>Preview & Download</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fillForm" className="space-y-6 mt-6">
              <FormProgress currentStep={step} totalSteps={totalSteps} />
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Step 1: Basic Information */}
                  {step === 1 && (
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
                  )}
                  
                  {/* Step 2: Applicant Information */}
                  {step === 2 && (
                    <ApplicantSection form={form} />
                  )}
                  
                  {/* Step 3: Inventor Information */}
                  {step === 3 && (
                    <InventorSection form={form} />
                  )}
                  
                  {/* Step 4: Additional Details */}
                  {step === 4 && (
                    <div className="space-y-4 animate-slide-in">
                      <h3 className="text-lg font-medium">Additional Details</h3>
                      
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              Additional Information
                              <FormTooltip content="Any additional information that might be relevant for the patent application." />
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter any additional information (optional)"
                                {...field}
                                rows={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={step === 1}
                    >
                      Previous
                    </Button>
                    
                    {step < totalSteps ? (
                      <Button type="button" onClick={nextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit">
                        Complete Form
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-6 animate-fade-in">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Form 1 Preview</h3>
                <div className="space-y-4">
                  <div className="text-center border-b pb-4">
                    <h4 className="text-xl font-bold">THE PATENTS ACT, 1970</h4>
                    <h5>(39 OF 1970)</h5>
                    <h4 className="text-lg font-semibold mt-2">APPLICATION FOR GRANT OF PATENT</h4>
                    <p className="text-sm text-slate-500">[See Section 7, 54 & 135 and Rule 20 (1)]</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium">1. TITLE OF INVENTION</h5>
                      <p className="border p-2 bg-slate-50 rounded">{form.watch("title")}</p>
                    </div>

                    <div>
                      <h5 className="font-medium">2. TYPE OF APPLICATION</h5>
                      <div className="border p-2 bg-slate-50 rounded">
                        <p><strong>Application Type:</strong> {form.watch("applicationType").toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">3. APPLICANT</h5>
                      <div className="border p-2 bg-slate-50 rounded space-y-1">
                        <p><strong>Name:</strong> {form.watch("applicantName")}</p>
                        <p><strong>Address:</strong> {form.watch("applicantAddress")}</p>
                        <p><strong>Nationality:</strong> {form.watch("applicantNationality")}</p>
                        <p><strong>Type:</strong> {form.watch("applicantType") === "individual" ? "Natural Person" : "Organization"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">4. INVENTOR</h5>
                      <div className="border p-2 bg-slate-50 rounded space-y-1">
                        <p><strong>Name:</strong> {form.watch("inventorName")}</p>
                        <p><strong>Address:</strong> {form.watch("inventorAddress")}</p>
                        <p><strong>Nationality:</strong> {form.watch("inventorNationality")}</p>
                      </div>
                    </div>
                    
                    {form.watch("additionalInfo") && (
                      <div>
                        <h5 className="font-medium">5. ADDITIONAL INFORMATION</h5>
                        <p className="border p-2 bg-slate-50 rounded whitespace-pre-line">{form.watch("additionalInfo")}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center space-x-4">
                  <Button onClick={() => setActiveTab("fillForm")} variant="outline">
                    Edit Form
                  </Button>
                  <Button onClick={handleDownloadDocument} disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate Word Document"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
