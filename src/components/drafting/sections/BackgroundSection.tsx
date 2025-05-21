
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface BackgroundSectionProps {
  content: string;
  onChange: (content: string) => void;
}

export function BackgroundSection({ content, onChange }: BackgroundSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Background</h3>
      <p className="text-sm text-muted-foreground">
        Describe the technical field, prior art, and problems solved by your invention
      </p>
      <Textarea 
        placeholder="Enter background information..."
        className="min-h-[300px]"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
