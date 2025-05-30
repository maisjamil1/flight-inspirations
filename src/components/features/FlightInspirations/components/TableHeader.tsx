import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface TableHeaderProps {
  onSaveChanges: () => void;
}

const TableHeader = ({ onSaveChanges }: TableHeaderProps) => (
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-semibold">Flight Data</h2>
    <Button onClick={onSaveChanges} variant="default">
      <Save className="mr-2 h-4 w-4" />
      Save Changes
    </Button>
  </div>
);

export default TableHeader;
