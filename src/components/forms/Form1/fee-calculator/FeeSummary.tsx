
import { Card } from "@/components/ui/card";

interface FeeDetails {
  baseFee: number;
  excessClaimFee: number;
  excessSheetFee: number;
  totalFee: number;
}

interface FeeSummaryProps {
  fees: FeeDetails;
}

export function FeeSummary({ fees }: FeeSummaryProps) {
  return (
    <Card className="p-4 bg-slate-50">
      <h4 className="font-medium mb-2">Fee Summary:</h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Basic filing fee:</span>
          <span>₹{fees.baseFee}</span>
        </div>
        {fees.excessClaimFee > 0 && (
          <div className="flex justify-between">
            <span>Excess claim fee:</span>
            <span>₹{fees.excessClaimFee}</span>
          </div>
        )}
        {fees.excessSheetFee > 0 && (
          <div className="flex justify-between">
            <span>Excess sheet fee:</span>
            <span>₹{fees.excessSheetFee}</span>
          </div>
        )}
        <div className="flex justify-between font-medium pt-2 border-t">
          <span>Total fee:</span>
          <span>₹{fees.totalFee}</span>
        </div>
      </div>
    </Card>
  );
}
