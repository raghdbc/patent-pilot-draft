/**
 * Drafting Page Component
 * 
 * Provides an interface for AI-assisted patent drafting using Groq.
 * Allows users to generate patent claims and specification sections.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { generatePatentClaim, generateSpecificationSection } from "@/services/groq";
import { useToast } from "@/hooks/use-toast";

type ContentType = "claim" | "background" | "summary" | "detailed_description";

interface GeneratedContent {
  [key: string]: string;
}

export default function DraftingPage() {
  const [description, setDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  /**
   * Handles the generation of patent content
   * @param type The type of content to generate
   */
  const handleGenerate = async (type: ContentType) => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description of your invention first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, [type]: true }));
    try {
      let content;
      if (type === "claim") {
        content = await generatePatentClaim(description);
      } else {
        content = await generateSpecificationSection(description, type);
      }
      setGeneratedContent(prev => ({
        ...prev,
        [type]: content
      }));
      toast({
        title: "Success",
        description: "Content generated successfully!",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Patent Drafting Assistant</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Invention Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your invention in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="claim" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="claim">Claim</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed_description">Detailed Description</TabsTrigger>
        </TabsList>

        <TabsContent value="claim" className="space-y-4">
          <Button
            onClick={() => handleGenerate("claim")}
            disabled={isLoading["claim"]}
            className="w-full"
            type="button"
          >
            {isLoading["claim"] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading["claim"] ? "Generating..." : "Generate Claim"}
          </Button>
          {generatedContent.claim && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Claim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap font-mono text-sm">{generatedContent.claim}</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="background" className="space-y-4">
          <Button
            onClick={() => handleGenerate("background")}
            disabled={isLoading["background"]}
            className="w-full"
            type="button"
          >
            {isLoading["background"] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading["background"] ? "Generating..." : "Generate Background"}
          </Button>
          {generatedContent.background && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Background</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap font-mono text-sm">{generatedContent.background}</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Button
            onClick={() => handleGenerate("summary")}
            disabled={isLoading["summary"]}
            className="w-full"
            type="button"
          >
            {isLoading["summary"] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading["summary"] ? "Generating..." : "Generate Summary"}
          </Button>
          {generatedContent.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap font-mono text-sm">{generatedContent.summary}</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="detailed_description" className="space-y-4">
          <Button
            onClick={() => handleGenerate("detailed_description")}
            disabled={isLoading["detailed_description"]}
            className="w-full"
            type="button"
          >
            {isLoading["detailed_description"] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading["detailed_description"] ? "Generating..." : "Generate Detailed Description"}
          </Button>
          {generatedContent.detailed_description && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Detailed Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap font-mono text-sm">{generatedContent.detailed_description}</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 