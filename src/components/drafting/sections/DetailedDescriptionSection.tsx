
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

const detailedDescriptionSchema = z.object({
  structure: z.string().min(50, {
    message: "Structure description must be at least 50 characters.",
  }),
  operation: z.string().min(50, {
    message: "Operation description must be at least 50 characters.",
  }),
  implementation: z.string().min(50, {
    message: "Implementation details must be at least 50 characters.",
  }),
  alternativeEmbodiments: z.string().optional(),
});

type DetailedDescriptionValues = z.infer<typeof detailedDescriptionSchema>;

export function DetailedDescriptionSection() {
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  
  const form = useForm<DetailedDescriptionValues>({
    resolver: zodResolver(detailedDescriptionSchema),
    defaultValues: {
      structure: "",
      operation: "",
      implementation: "",
      alternativeEmbodiments: "",
    },
  });
  
  function onSubmit(data: DetailedDescriptionValues) {
    setGeneratingDraft(true);
    
    // Simulate AI draft generation
    setTimeout(() => {
      const generatedText = `
DETAILED DESCRIPTION OF THE INVENTION

Structure and Components:
${data.structure}

Operation and Functionality:
${data.operation}

Implementation Details:
${data.implementation}

${data.alternativeEmbodiments ? `Alternative Embodiments and Variations:
${data.alternativeEmbodiments}

` : ''}The description provided herein is intended to be illustrative rather than limiting. Variations and modifications may be made without departing from the scope of the invention, which is defined by the appended claims.
      `;
      setDraftText(generatedText);
      setGeneratingDraft(false);
      setShowGenerated(true);
    }, 3000);
  }
  
  const handleRephrase = () => {
    setGeneratingDraft(true);
    
    // Simulate AI rephrasing
    setTimeout(() => {
      const rephrasedText = draftText + "\n\n[This section has been rephrased with more technical precision.]";
      setDraftText(rephrasedText);
      setGeneratingDraft(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detailed Description</CardTitle>
          <CardDescription>
            Provide comprehensive details about your invention's structure and operation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showGenerated ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="structure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Structure and Components</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the physical components, parts, or elements of your invention in detail"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include specific details about materials, dimensions, and configurations where relevant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="operation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operation and Functionality</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain how your invention works, functions, or operates"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe step-by-step how different parts interact and contribute to the functionality
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="implementation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Implementation Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide technical implementation details, methods, or processes involved"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include specific technical parameters, processes, or methodologies
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="alternativeEmbodiments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternative Embodiments (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any alternative versions, variations, or implementations of your invention"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include other possible configurations or variations to broaden protection
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={generatingDraft}>
                  {generatingDraft && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Detailed Description
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="min-h-[500px] font-serif"
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
