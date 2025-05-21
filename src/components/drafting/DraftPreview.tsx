
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SectionContent } from '@/models/draftTypes';

interface DraftPreviewProps {
  sections: SectionContent;
}

export function DraftPreview({ sections }: DraftPreviewProps) {
  const isEmpty = Object.values(sections).every(section => !section || section.trim() === '');
  
  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center p-8">
          Start filling in the sections to preview your patent document here
        </p>
      </div>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-4 px-6">
        <CardTitle className="text-xl font-bold">{sections.title || "Untitled Patent"}</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-6">
          {sections.abstract && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">ABSTRACT</h2>
              <p className="whitespace-pre-wrap">{sections.abstract}</p>
            </div>
          )}
          
          {sections.background && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">BACKGROUND</h2>
              <p className="whitespace-pre-wrap">{sections.background}</p>
              <Separator className="my-6" />
            </div>
          )}
          
          {sections.description && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">DETAILED DESCRIPTION</h2>
              <p className="whitespace-pre-wrap">{sections.description}</p>
              <Separator className="my-6" />
            </div>
          )}
          
          {sections.claims && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">CLAIMS</h2>
              <p className="whitespace-pre-wrap">{sections.claims}</p>
              <Separator className="my-6" />
            </div>
          )}
          
          {sections.drawings && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">DRAWINGS</h2>
              <p className="whitespace-pre-wrap">{sections.drawings}</p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
