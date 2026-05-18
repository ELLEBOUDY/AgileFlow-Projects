import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";

interface FileSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function FileSearch({ value, onChange }: FileSearchProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search files by name..."
          className="pl-8"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
