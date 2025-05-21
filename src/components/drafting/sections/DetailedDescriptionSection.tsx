
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface DetailedDescriptionSectionProps {
  content: string;
  onChange: (content: string) => void;
}

export function DetailedDescriptionSection({ content, onChange }: DetailedDescriptionSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Detailed Description</h3>
      <Textarea 
        placeholder="Enter detailed description of your invention..."
        className="min-h-[300px]"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
