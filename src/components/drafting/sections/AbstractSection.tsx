
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface AbstractSectionProps {
  content: string;
  onChange: (content: string) => void;
}

export function AbstractSection({ content, onChange }: AbstractSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Abstract</h3>
      <p className="text-sm text-muted-foreground">
        Provide a concise summary (150-250 words) of your invention's technical disclosure
      </p>
      <Textarea 
        placeholder="Enter abstract of your invention..."
        className="min-h-[200px]"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
