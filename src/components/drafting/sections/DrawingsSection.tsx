
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface DrawingsSectionProps {
  content: string;
  onChange: (content: string) => void;
}

export function DrawingsSection({ content, onChange }: DrawingsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Drawings</h3>
      <p className="text-sm text-muted-foreground">
        Describe any drawings to be included with your patent application
      </p>
      <Textarea 
        placeholder="Enter descriptions of drawings..."
        className="min-h-[200px]"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
