
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const abstractFormSchema = z.object({
  problemStatement: z.string().min(20, {
    message: "Problem statement must be at least 20 characters.",
  }),
  solution: z.string().min(20, {
    message: "Solution description must be at least 20 characters.",
  }),
  mainElements: z.string().min(20, {
    message: "Main elements must be at least 20 characters.",
  }),
});

type AbstractFormValues = z.infer<typeof abstractFormSchema>;

export function AbstractSection() {
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  const form = useForm<AbstractFormValues>({
    resolver: zodResolver(abstractFormSchema),
    defaultValues: {
      problemStatement: "",
      solution: "",
      mainElements: "",
    },
  });
  
  function onSubmit(data: AbstractFormValues) {
    setGeneratingDraft(true);
    
    // Simulate AI draft generation
    setTimeout(() => {
      const generatedText = `
ABSTRACT

${data.problemStatement} ${data.solution} ${data.mainElements}
      `;
      
      setDraftText(generatedText);
      setWordCount(generatedText.trim().split(/\s+/).length);
      setGeneratingDraft(false);
      setShowGenerated(true);
    }, 2000);
  }
  
  const handleRephrase = () => {
    setGeneratingDraft(true);
    
    // Simulate AI rephrasing
    setTimeout(() => {
      const rephrasedText = draftText + "\n\n[Abstract rephrased to be more concise and technical.]";
      setDraftText(rephrasedText);
      setWordCount(rephrasedText.trim().split(/\s+/).length);
      setGeneratingDraft(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Abstract</CardTitle>
          <CardDescription>
            Create a concise summary of your invention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertTitle>Abstract Guidelines</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>The abstract should be 150-250 words</li>
                <li>It should summarize the invention, problem solved, and main elements</li>
                <li>Avoid using technical jargon and legalese</li>
                <li>Do not make claims about the novelty or merit of the invention</li>
                <li>Write in clear, simple language</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          {!showGenerated ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="problemStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe the problem that your invention addresses"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Concisely state what issue or limitation your invention solves
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="solution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solution</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe how your invention solves the problem"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain what your invention does to address the problem
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mainElements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Elements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the key components or steps of your invention"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Briefly outline the main features or parts that make up your invention
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={generatingDraft}>
                  {generatingDraft && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Abstract
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Abstract</span>
                <span className={`text-sm ${
                  wordCount > 250 ? "text-red-500" : wordCount < 150 ? "text-amber-500" : "text-green-500"
                }`}>
                  {wordCount} words {wordCount > 250 ? "(too long)" : wordCount < 150 ? "(too short)" : "(good)"}
                </span>
              </div>
              
              <Textarea
                value={draftText}
                onChange={(e) => {
                  setDraftText(e.target.value);
                  setWordCount(e.target.value.trim().split(/\s+/).length);
                }}
                className="min-h-[200px] font-serif"
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
