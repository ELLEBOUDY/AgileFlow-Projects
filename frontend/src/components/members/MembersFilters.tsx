import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MembersFiltersProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  roleFilter: string;
  setRoleFilter: React.Dispatch<React.SetStateAction<string>>;
}

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
];

const MembersFilters = ({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
}: MembersFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative flex-1 w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or email..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {ROLE_OPTIONS.map((opt) => (
          <Badge
            key={opt.value}
            variant={roleFilter === opt.value ? "secondary" : "outline"}
            onClick={() => setRoleFilter(opt.value)}
            className="cursor-pointer"
          >
            {opt.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MembersFilters;