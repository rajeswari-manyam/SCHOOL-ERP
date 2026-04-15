import { Card} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ReportCard = ({
  title,
  onGenerate,
}: {
  title: string;
  onGenerate: () => void;
}) => {
  return (
    <Card className="p-4 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-[#0B1C30]">{title}</h3>
        <p className="text-sm text-gray-500">
          Generate and export report
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <Button size="sm" onClick={onGenerate}>
          Generate
        </Button>
        <Button size="sm" variant="outline">
          PDF
        </Button>
        <Button size="sm" variant="outline">
          Excel
        </Button>
      </div>
    </Card>
  );
};