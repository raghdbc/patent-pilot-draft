
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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const backgroundFormSchema = z.object({
  fieldOfInvention: z.string().min(5, {
    message: "Field of invention must be at least 5 characters.",
  }),
  problemStatement: z.string().min(20, {
    message: "Problem statement must be at least 20 characters.",
  }),
  priorArt: z.string().min(20, {
    message: "Prior art description must be at least 20 characters.",
  }),
  limitationsOfPriorArt: z.string().min(20, {
    message: "Limitations description must be at least 20 characters.",
  }),
});

type BackgroundFormValues = z.infer<typeof backgroundFormSchema>;

export function BackgroundSection() {
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  
  const form = useForm<BackgroundFormValues>({
    resolver: zodResolver(backgroundFormSchema),
    defaultValues: {
      fieldOfInvention: "",
      problemStatement: "",
      priorArt: "",
      limitationsOfPriorArt: "",
    },
  });
  
  function onSubmit(data: BackgroundFormValues) {
    setGeneratingDraft(true);
    
    // Simulate AI draft generation
    setTimeout(() => {
      const generatedText = `
BACKGROUND

Field of Invention:
${data.fieldOfInvention}

Problem Addressed:
${data.problemStatement}

Prior Art:
${data.priorArt}

Limitations of Prior Art:
${data.limitationsOfPriorArt}

The present invention addresses these limitations by providing a novel solution that overcomes the drawbacks identified in the existing technologies. This invention offers significant improvements in efficiency, usability, and performance compared to the current state of the art.
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
      const rephrasedText = draftText + "\n\n[This section has been rephrased to improve clarity and technical precision.]";
      setDraftText(rephrasedText);
      setGeneratingDraft(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Background of the Invention</CardTitle>
          <CardDescription>
            Describe the field of invention, problems addressed, and prior art
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showGenerated ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fieldOfInvention"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Invention</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Machine Learning for Healthcare, IoT-based Agricultural Systems"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The technical domain or area to which your invention belongs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="problemStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the problem that your invention solves"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Clearly explain what problem exists that your invention addresses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priorArt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prior Art</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe existing technologies, methods, or systems related to your invention"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Discuss existing solutions and related technologies (what others have done before)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="limitationsOfPriorArt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limitations of Prior Art</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the drawbacks or limitations of existing solutions"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain why existing solutions are inadequate or have drawbacks
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={generatingDraft}>
                  {generatingDraft && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Background Draft
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
