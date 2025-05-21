
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface ClaimsSectionProps {
  content: string;
  onChange: (content: string) => void;
}

export function ClaimsSection({ content, onChange }: ClaimsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Claims</h3>
      <p className="text-sm text-muted-foreground">
        Define the legal scope of protection for your invention
      </p>
      <Textarea 
        placeholder="Enter claims for your invention..."
        className="min-h-[300px]"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
