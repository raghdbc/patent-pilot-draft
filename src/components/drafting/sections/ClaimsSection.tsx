
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const claimsFormSchema = z.object({
  inventionName: z.string().min(5, {
    message: "Invention name must be at least 5 characters.",
  }),
  independentClaim: z.string().min(50, {
    message: "Independent claim must be at least 50 characters.",
  }),
  dependentClaims: z.array(
    z.object({
      claim: z.string().min(20, {
        message: "Dependent claim must be at least 20 characters.",
      }),
    })
  ),
});

type ClaimsFormValues = z.infer<typeof claimsFormSchema>;

export function ClaimsSection() {
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  
  const form = useForm<ClaimsFormValues>({
    resolver: zodResolver(claimsFormSchema),
    defaultValues: {
      inventionName: "",
      independentClaim: "",
      dependentClaims: [{ claim: "" }],
    },
  });
  
  const { fields, append, remove } = form.useFieldArray({
    name: "dependentClaims",
  });
  
  function onSubmit(data: ClaimsFormValues) {
    setGeneratingDraft(true);
    
    // Simulate AI draft generation
    setTimeout(() => {
      let generatedText = "CLAIMS\n\n";
      
      // Independent claim
      generatedText += `1. ${data.independentClaim}\n\n`;
      
      // Dependent claims
      data.dependentClaims.forEach((item, index) => {
        generatedText += `${index + 2}. The ${data.inventionName} as claimed in claim 1, wherein ${item.claim}\n\n`;
      });
      
      setDraftText(generatedText);
      setGeneratingDraft(false);
      setShowGenerated(true);
    }, 3000);
  }
  
  const handleRephrase = () => {
    setGeneratingDraft(true);
    
    // Simulate AI rephrasing
    setTimeout(() => {
      const rephrasedText = draftText + "\n\n[These claims have been rephrased to improve legal precision.]";
      setDraftText(rephrasedText);
      setGeneratingDraft(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Claims</CardTitle>
          <CardDescription>
            Define the legal scope of protection for your invention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertTitle>Claim Writing Guidelines</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Claims should be clear, concise, and define the novel aspects of your invention</li>
                <li>Independent claims stand alone and define the broadest scope</li>
                <li>Dependent claims refer back to an earlier claim and add further limitations</li>
                <li>Begin independent claims with "A method/system/apparatus for..." followed by the elements</li>
                <li>Begin dependent claims with "The method/system/apparatus as claimed in claim X, wherein..."</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          {!showGenerated ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="inventionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invention Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., method, system, device, apparatus"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be used in dependent claims (e.g., "The method as claimed in claim 1...")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="independentClaim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Independent Claim</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your primary independent claim that defines the core invention"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your broadest claim that defines the essential elements of your invention
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Dependent Claims</h4>
                  
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md bg-slate-50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Dependent Claim {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`dependentClaims.${index}.claim`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{`Claim ${index + 2}`}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add additional limitations to the independent claim"
                                className="min-h-20"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Start with "wherein..." to add features beyond the independent claim
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ claim: "" })}
                  >
                    Add Dependent Claim
                  </Button>
                </div>
                
                <Button type="submit" className="w-full" disabled={generatingDraft}>
                  {generatingDraft && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Claims
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="min-h-[400px] font-serif"
                disabled={generatingDraft}
              />
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRephrase} disabled={generatingDraft}>
                  {generatingDraft && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Rephrase
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowGenerated(false)}
                  disabled={generatingDraft}
                >
                  Edit Inputs
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
