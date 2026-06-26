import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProjectsFiltersProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  teamFilter: string;
  setTeamFilter: React.Dispatch<React.SetStateAction<string>>;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "in_progress", label: "In Progress" },
  { value: "planning", label: "Planning" },
  { value: "completed", label: "Completed" },
];

const TEAM_OPTIONS = [
  { value: "all", label: "All Teams" },
  { value: "assigned", label: "Assigned" },
  { value: "unassigned", label: "Unassigned" },
];

const ProjectsFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  teamFilter,
  setTeamFilter,
}: ProjectsFiltersProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Status:</span>
          {STATUS_OPTIONS.map((opt) => (
            <Badge
              key={opt.value}
              variant={statusFilter === opt.value ? "secondary" : "outline"}
              onClick={() => setStatusFilter(opt.value)}
              className="cursor-pointer"
            >
              {opt.label}
            </Badge>
          ))}
        </div>

        <div className="hidden sm:block w-px bg-border" />

        {/* Team assignment filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Team:</span>
          {TEAM_OPTIONS.map((opt) => (
            <Badge
              key={opt.value}
              variant={teamFilter === opt.value ? "secondary" : "outline"}
              onClick={() => setTeamFilter(opt.value)}
              className="cursor-pointer"
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsFilters;