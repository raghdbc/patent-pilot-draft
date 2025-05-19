
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SheetCountTableProps {
  sheetCount: {
    description: number;
    abstract: number;
    claims: number;
    drawings: number;
  };
  handleSheetCountChange: (type: keyof typeof sheetCount, value: string) => void;
  totalSheetCount: number;
  fees: any;
  feeCategory: string;
  feeMode: 'online' | 'offline';
}

export function SheetCountTable({
  sheetCount,
  handleSheetCountChange,
  totalSheetCount,
  fees,
  feeCategory,
  feeMode
}: SheetCountTableProps) {
  return (
    <Card className="p-4">
      <h4 className="font-medium mb-4">Sheet Count:</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-left">Number of sheets</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">
                Patent document (from title to end of detailed description)
              </td>
              <td className="border p-2">
                <Input
                  type="number"
                  min="0"
                  value={sheetCount.description}
                  onChange={(e) => handleSheetCountChange('description', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border p-2">Abstract</td>
              <td className="border p-2">
                <Input
                  type="number"
                  min="0"
                  value={sheetCount.abstract}
                  onChange={(e) => handleSheetCountChange('abstract', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border p-2">Claims</td>
              <td className="border p-2">
                <Input
                  type="number"
                  min="0"
                  value={sheetCount.claims}
                  onChange={(e) => handleSheetCountChange('claims', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border p-2">Drawing sheets</td>
              <td className="border p-2">
                <Input
                  type="number"
                  min="0"
                  value={sheetCount.drawings}
                  onChange={(e) => handleSheetCountChange('drawings', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Total sheets:</td>
              <td className="border p-2 font-medium">{totalSheetCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {totalSheetCount > 30 && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm">
          <p className="font-medium">Excess sheet fee: ₹{fees.excessSheetFee}</p>
          <p className="text-muted-foreground">
            ({fees.excessSheets} sheets over 30 @ 
            {feeMode === 'online' ? 
              ` ₹${feeCategory === 'natural_person' ? '160' : feeCategory === 'small_entity' ? '400' : '800'}` : 
              ` ₹${feeCategory === 'natural_person' ? '180' : feeCategory === 'small_entity' ? '440' : '880'}`} 
            per sheet for {feeCategory.replace('_', ' ')})
          </p>
        </div>
      )}
    </Card>
  );
}
