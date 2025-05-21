
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormTooltip } from "../FormTooltip";
import { ApplicantCategory } from "@/models/patentApplication";
import { calculateExcessClaimFee, calculateExcessSheetFee } from "@/utils/patentFormHelpers";

interface SheetCountProps {
  sheetCounts: {
    patentDocumentSheets: number;
    abstractSheets: number;
    claimsSheets: number;
    drawingSheets: number;
  };
  form: UseFormReturn<any>;
  feeCategory: ApplicantCategory;
  feeMode: 'online' | 'offline';
}

export function ApplicationDetailsSection({ 
  form,
  feeCategory = 'natural_person',
  feeMode = 'online'
}: {
  form: UseFormReturn<any>;
  feeCategory?: ApplicantCategory;
  feeMode?: 'online' | 'offline';
}) {
  const sheetCounts = form.watch('sheetCounts');
  const others = form.watch('others');
  
  const [totalSheets, setTotalSheets] = useState(0);
  const [excessSheets, setExcessSheets] = useState(0);
  const [excessSheetFee, setExcessSheetFee] = useState('0');
  
  const [excessClaims, setExcessClaims] = useState(0);
  const [excessClaimFee, setExcessClaimFee] = useState('0');
  
  // Calculate total sheets and excess sheet fee
  useEffect(() => {
    const totalSheetCount = 
      (sheetCounts?.patentDocumentSheets || 0) + 
      (sheetCounts?.abstractSheets || 0) + 
      (sheetCounts?.claimsSheets || 0) + 
      (sheetCounts?.drawingSheets || 0);
    
    setTotalSheets(totalSheetCount);
    
    if (totalSheetCount > 30) {
      setExcessSheets(totalSheetCount - 30);
      setExcessSheetFee(calculateExcessSheetFee(totalSheetCount, feeCategory, feeMode));
    } else {
      setExcessSheets(0);
      setExcessSheetFee('0');
    }
  }, [sheetCounts, feeCategory, feeMode]);
  
  // Calculate excess claim fee
  useEffect(() => {
    const claims = others?.numberOfClaims || 0;
    
    if (claims > 10) {
      setExcessClaims(claims - 10);
      setExcessClaimFee(calculateExcessClaimFee(claims, feeCategory, feeMode));
    } else {
      setExcessClaims(0);
      setExcessClaimFee('0');
    }
  }, [others, feeCategory, feeMode]);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Application Details</h3>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Title of Invention
              <FormTooltip content="A clear and concise title that accurately describes your invention" />
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g., Method and Apparatus for..." {...field} />
            </FormControl>
            <FormDescription>
              The title should be brief but accurate technical description of the invention
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="space-y-4">
        <h4 className="font-medium">Sheet Count</h4>
        <Card className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="sheetCounts.patentDocumentSheets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patent Document</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    From title to end of detailed description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sheetCounts.abstractSheets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sheetCounts.claimsSheets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Claims</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sheetCounts.drawingSheets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drawing Sheets</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Sheets:</span>
              <span>{totalSheets}</span>
            </div>
            
            {excessSheets > 0 && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Excess Sheet Fee:</span>
                  <Badge variant="outline">₹{excessSheetFee}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  ({excessSheets} sheets over 30 × 
                  {feeMode === 'online' ? 
                    ` ₹${feeCategory === 'natural_person' ? '160' : feeCategory === 'small_entity' ? '400' : '800'}` : 
                    ` ₹${feeCategory === 'natural_person' ? '320' : feeCategory === 'small_entity' ? '800' : '1600'}`} 
                  per sheet)
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium">Other Details</h4>
        <Card className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="others.numberOfClaims"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Claims</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of claims in your application
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="others.numberOfDrawings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Drawings</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of drawings in your application
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {excessClaims > 0 && (
            <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Excess Claim Fee:</span>
                <Badge variant="outline">₹{excessClaimFee}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                ({excessClaims} claims over 10 × 
                {feeMode === 'online' ? 
                  ` ₹${feeCategory === 'natural_person' ? '320' : feeCategory === 'small_entity' ? '800' : '1600'}` : 
                  ` ₹${feeCategory === 'natural_person' ? '640' : feeCategory === 'small_entity' ? '1600' : '3200'}`} 
                per claim)
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
