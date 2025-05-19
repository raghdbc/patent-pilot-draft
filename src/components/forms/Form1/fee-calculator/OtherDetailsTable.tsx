
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface OtherDetailsTableProps {
  form: UseFormReturn<any>;
  fees: any;
  feeCategory: string;
  feeMode: 'online' | 'offline';
}

export function OtherDetailsTable({
  form,
  fees,
  feeCategory,
  feeMode
}: OtherDetailsTableProps) {
  const claimCount = parseInt(form.watch('claimCount') || '0');
  
  return (
    <Card className="p-4">
      <h4 className="font-medium mb-4">Other Details:</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-left">Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">No. of claims</td>
              <td className="border p-2">
                <Input
                  id="claimCount"
                  type="number"
                  min="0"
                  {...form.register('claimCount')}
                />
              </td>
            </tr>
            <tr>
              <td className="border p-2">No. of drawings</td>
              <td className="border p-2">
                <Input
                  id="drawingCount"
                  type="number"
                  min="0"
                  {...form.register('drawingCount')}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {claimCount > 10 && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm">
          <p className="font-medium">Excess claim fee: ₹{fees.excessClaimFee}</p>
          <p className="text-muted-foreground">
            ({fees.excessClaims} claims over 10 @ 
            {feeMode === 'online' ? 
              ` ₹${feeCategory === 'natural_person' ? '320' : feeCategory === 'small_entity' ? '800' : '1600'}` : 
              ` ₹${feeCategory === 'natural_person' ? '350' : feeCategory === 'small_entity' ? '880' : '1750'}`} 
            per claim for {feeCategory.replace('_', ' ')})
          </p>
        </div>
      )}
    </Card>
  );
}
