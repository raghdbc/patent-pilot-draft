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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FormTooltip } from "../FormTooltip";
import { 
  calculateExcessSheetFee, 
  calculateExcessClaimFee, 
  calculateTotalSheets,
  formatCurrency
} from "@/utils/patentFormHelpers";

interface ApplicationDetailsSectionProps {
  form: UseFormReturn<any>;
}

export function ApplicationDetailsSection({ form }: ApplicationDetailsSectionProps) {
  const [totalSheets, setTotalSheets] = useState(0);
  const [excessSheetFeeInfo, setExcessSheetFeeInfo] = useState({ online: 0, offline: 0 });
  const [excessClaimFeeInfo, setExcessClaimFeeInfo] = useState({ online: 0, offline: 0 });
  
  const sheetCounts = form.watch('sheetCounts') || {
    patentDocumentSheets: 0,
    abstractSheets: 0,
    claimsSheets: 0,
    drawingSheets: 0
  };
  
  const numberOfClaims = form.watch('others.numberOfClaims') || 0;
  const applicants = form.watch('applicants');
  
  // Calculate applicant category for fee calculation
  const determineApplicantCategory = () => {
    // If Fixed applicant is set, use its category
    if (applicants?.fixed) {
      return applicants.fixed.category;
    } 
    
    // If there are additionalApplicants, use the highest fee category
    // (large_entity > small_entity > natural_person)
    if (applicants?.additionalApplicants?.length) {
      if (applicants.additionalApplicants.some(app => app.category === 'large_entity')) {
        return 'large_entity';
      }
      if (applicants.additionalApplicants.some(app => app.category === 'small_entity' || 
                                                       app.category === 'startup' ||
                                                       app.category === 'education_institute' ||
                                                       app.category === 'govt_entity')) {
        return 'small_entity';
      }
      return 'natural_person';
    }
    
    // Default to natural_person if no applicants defined yet
    return 'natural_person';
  };
  
  // Update sheet counts and fees whenever relevant form values change
  useEffect(() => {
    const newTotalSheets = calculateTotalSheets(sheetCounts);
    setTotalSheets(newTotalSheets);
    
    const category = determineApplicantCategory();
    
    const onlineExcessSheetFee = calculateExcessSheetFee(newTotalSheets, category, 'online');
    const offlineExcessSheetFee = calculateExcessSheetFee(newTotalSheets, category, 'offline');
    
    setExcessSheetFeeInfo({
      online: onlineExcessSheetFee,
      offline: offlineExcessSheetFee
    });
    
  }, [sheetCounts, applicants]);
  
  // Update claim fees whenever relevant form values change
  useEffect(() => {
    const category = determineApplicantCategory();
    
    const onlineExcessClaimFee = calculateExcessClaimFee(numberOfClaims, category, 'online');
    const offlineExcessClaimFee = calculateExcessClaimFee(numberOfClaims, category, 'offline');
    
    setExcessClaimFeeInfo({
      online: onlineExcessClaimFee,
      offline: offlineExcessClaimFee
    });
    
  }, [numberOfClaims, applicants]);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Application Details</h3>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Title of Invention
              <FormTooltip content="A concise title that clearly and specifically describes your invention" />
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter a descriptive title for your invention" 
                className="resize-none min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              The title should be clear, concise, and specific to your invention (5-15 words recommended)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Sheet Counts Section */}
      <div>
        <h4 className="text-base font-medium mb-3">Sheet Counts</h4>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Document Sheets
              <FormTooltip content="Enter the number of sheets for each part of your patent application" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sheetCounts.patentDocumentSheets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patent Document Sheets</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
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
                name="sheetCounts.abstractSheets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abstract Sheets</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
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
                    <FormLabel>Claims Sheets</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
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
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/50 border-t">
            <span className="font-medium">Total Sheets:</span>
            <span>{totalSheets}</span>
          </CardFooter>
        </Card>
        
        {totalSheets > 30 && (
          <div className="mt-2 p-3 bg-yellow-50 rounded-md border border-yellow-200">
            <p className="text-sm font-medium mb-1">Excess Sheet Fee Applicable</p>
            <p className="text-xs text-muted-foreground mb-2">
              Fee is charged for sheets exceeding 30 ({totalSheets - 30} excess sheets)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-xs">
                <span className="block text-muted-foreground">Online filing:</span>
                <span className="font-medium">{formatCurrency(excessSheetFeeInfo.online)}</span>
              </div>
              <div className="text-xs">
                <span className="block text-muted-foreground">Offline filing:</span>
                <span className="font-medium">{formatCurrency(excessSheetFeeInfo.offline)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Other Details Section */}
      <div>
        <h4 className="text-base font-medium mb-3">Other Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="others.numberOfClaims"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Number of Claims
                  <FormTooltip content="Enter the total number of claims in your patent application" />
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Each claim defines a specific aspect of your invention for legal protection
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
                <FormLabel className="flex items-center">
                  Number of Drawings
                  <FormTooltip content="Enter the total number of drawings in your patent application" />
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Visual representations that help explain your invention
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {numberOfClaims > 10 && (
          <div className="mt-2 p-3 bg-yellow-50 rounded-md border border-yellow-200">
            <p className="text-sm font-medium mb-1">Excess Claim Fee Applicable</p>
            <p className="text-xs text-muted-foreground mb-2">
              Fee is charged for claims exceeding 10 ({numberOfClaims - 10} excess claims)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-xs">
                <span className="block text-muted-foreground">Online filing:</span>
                <span className="font-medium">{formatCurrency(excessClaimFeeInfo.online)}</span>
              </div>
              <div className="text-xs">
                <span className="block text-muted-foreground">Offline filing:</span>
                <span className="font-medium">{formatCurrency(excessClaimFeeInfo.offline)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
