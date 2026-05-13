import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProjectsFiltersProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectsFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: ProjectsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative flex-1 w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "in_progress", "planning", "completed"].map(
          (status) => (
            <Badge
              key={status}
              variant={
                statusFilter === status
                  ? "secondary"
                  : "outline"
              }
              onClick={() => setStatusFilter(status)}
              className="cursor-pointer capitalize"
            >
              {status === "all"
                ? "All"
                : status.replace("_", " ")}
            </Badge>
          )
        )}
      </div>
    </div>
  );
};

export default ProjectsFilters;