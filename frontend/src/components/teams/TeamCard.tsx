import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, Crown } from "lucide-react";
import type { ITeam } from "@/pages/TeamsPage";
import TeamActionsMenu from "./Teamactionsmenu";

interface TeamCardProps {
  team: ITeam;
  onEdit: (team: ITeam) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}

const TeamCard = ({ team, onEdit, onDelete, isAdmin }: TeamCardProps) => {
  const memberCount = team.members?.length ?? 0;

  return (
    <div className="group rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-all hover:border-slate-700">
      {/* Top row: badge + actions */}
      <div className="flex justify-between items-start">
        <Badge
          variant={team.has_projects ? "default" : "secondary"}
          className="capitalize"
        >
          {team.has_projects ? "Assigned to project" : "Unassigned"}
        </Badge>

        {isAdmin && (
          <div>
            <TeamActionsMenu
              onEdit={() => onEdit(team)}
              onDelete={() => onDelete(team.id)}
            />
          </div>
        )}
      </div>

      {/* Team name & description */}
      <div>
        <h3 className="font-semibold text-lg leading-tight mb-1">
          {team.team_name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {team.description || "No description provided for this team."}
        </p>
      </div>

      {/* Manager */}
      <div className="flex items-center gap-2">
        <Crown className="h-4 w-4 text-amber-500 shrink-0" />
        <span className="text-xs text-muted-foreground">Manager</span>
        <span className="text-xs font-medium ml-auto truncate max-w-[160px]">
          {team.manager_email || "—"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Members avatars */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {(team.members_emails ?? []).slice(0, 5).map((email, i) => (
            <img
              key={i}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-accent"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`}
              alt={email}
              title={email}
            />
          ))}
          {memberCount > 5 && (
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-medium text-muted-foreground">
              +{memberCount - 5}
            </div>
          )}
          {memberCount === 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> No members yet
            </span>
          )}
        </div>

        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </span>
      </div>

      {/* Created at */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t">
        <CalendarDays className="h-3.5 w-3.5" />
        Created{" "}
        {new Date(team.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    </div>
  );
};

export default TeamCard;