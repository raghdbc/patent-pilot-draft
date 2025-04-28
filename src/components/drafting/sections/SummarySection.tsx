
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

const summaryFormSchema = z.object({
  inventionPurpose: z.string().min(20, {
    message: "Purpose must be at least 20 characters.",
  }),
  mainFeatures: z.string().min(20, {
    message: "Main features must be at least 20 characters.",
  }),
  advantages: z.string().min(20, {
    message: "Advantages must be at least 20 characters.",
  }),
});

type SummaryFormValues = z.infer<typeof summaryFormSchema>;

export function SummarySection() {
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  
  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summaryFormSchema),
    defaultValues: {
      inventionPurpose: "",
      mainFeatures: "",
      advantages: "",
    },
  });
  
  function onSubmit(data: SummaryFormValues) {
    setGeneratingDraft(true);
    
    // Simulate AI draft generation
    setTimeout(() => {
      const generatedText = `
SUMMARY OF THE INVENTION

Purpose of the Invention:
${data.inventionPurpose}

Main Features:
${data.mainFeatures}

Advantages of the Invention:
${data.advantages}

The present invention substantially departs from the conventional concepts and designs of the prior art, and in doing so provides an apparatus and method that substantially fulfills the above-described needs and overcomes the disadvantages inherent in traditional approaches.
      `;
      setDraftText(generatedText);
      setGeneratingDraft(false);
      setShowGenerated(true);
    }, 2000);
  }
  
  const handleRephrase = () => {
    setGeneratingDraft(true);
    
    // Simulate AI rephrasing
    setTimeout(() => {
      const rephrasedText = draftText + "\n\n[This section has been rephrased for improved technical accuracy.]";
      setDraftText(rephrasedText);
      setGeneratingDraft(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Summary of the Invention</CardTitle>
          <CardDescription>
            Describe the purpose, key features, and advantages of your invention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showGenerated ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="inventionPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of the Invention</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is the main purpose or objective of your invention?"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Clearly state what your invention aims to accomplish
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mainFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Features</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the key features, components, or methods of your invention"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List the main elements or aspects that characterize your invention
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="advantages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advantages of the Invention</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What benefits or improvements does your invention provide over existing solutions?"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Highlight how your invention is better than prior art
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={generatingDraft}>
                  {generatingDraft && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Summary Draft
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
