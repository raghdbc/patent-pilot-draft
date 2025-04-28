
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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

const drawingsFormSchema = z.object({
  figureDescriptions: z.array(
    z.object({
      figureNumber: z.string(),
      description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
      }),
    })
  ).min(1, {
    message: "At least one figure description is required.",
  }),
});

type DrawingsFormValues = z.infer<typeof drawingsFormSchema>;

export function DrawingsSection() {
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  
  const form = useForm<DrawingsFormValues>({
    resolver: zodResolver(drawingsFormSchema),
    defaultValues: {
      figureDescriptions: [
        { figureNumber: "Figure 1", description: "" },
      ],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "figureDescriptions",
  });
  
  function onSubmit(data: DrawingsFormValues) {
    setGeneratingDraft(true);
    
    // Simulate AI draft generation
    setTimeout(() => {
      let generatedText = "BRIEF DESCRIPTION OF THE DRAWINGS\n\n";
      
      data.figureDescriptions.forEach((figure) => {
        generatedText += `${figure.figureNumber}: ${figure.description}\n\n`;
      });
      
      generatedText += "The above-described drawing figures illustrate the general manner of implementing the invention and are not intended to limit the invention to the specific embodiments described herein.";
      
      setDraftText(generatedText);
      setGeneratingDraft(false);
      setShowGenerated(true);
    }, 2000);
  }
  
  const handleRephrase = () => {
    setGeneratingDraft(true);
    
    // Simulate AI rephrasing
    setTimeout(() => {
      const rephrasedText = draftText + "\n\n[This section has been rephrased for improved clarity.]";
      setDraftText(rephrasedText);
      setGeneratingDraft(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brief Description of Drawings</CardTitle>
          <CardDescription>
            Provide descriptions for each figure/drawing in your patent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertTitle>Drawing Guidelines</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Drawings should be in black and white, clear line drawings</li>
                <li>Each figure should be numbered (e.g., Figure 1, Figure 2, etc.)</li>
                <li>Use reference numerals to identify different parts in your drawings</li>
                <li>Include flowcharts, block diagrams, or schematics as needed</li>
                <li>Photographs are generally not accepted unless they are the only practical medium</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          {!showGenerated ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-md bg-slate-50">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Drawing {index + 1}</h4>
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
                      name={`figureDescriptions.${index}.figureNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Figure Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            E.g., "Figure 1", "Fig. 2A", etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`figureDescriptions.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what this figure illustrates"
                              className="min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Briefly explain what the drawing shows (e.g., "A perspective view of the device")
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
                  onClick={() => append({ figureNumber: `Figure ${fields.length + 1}`, description: "" })}
                >
                  Add Another Figure
                </Button>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={generatingDraft}>
                    {generatingDraft && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Drawings Description
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Upload Drawings</h3>
                <Input type="file" multiple accept="image/*" />
                <p className="text-sm text-muted-foreground mt-2">
                  Upload clear, well-labeled technical drawings of your invention
                </p>
              </div>
              
              <Textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="min-h-[300px] font-serif"
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
