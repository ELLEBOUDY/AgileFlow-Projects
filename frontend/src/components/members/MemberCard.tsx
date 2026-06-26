import { Mail, Phone } from "lucide-react";
import type { IUser } from "@/interfaces";
import MemberActionsMenu from "./MemberActionsMenu";

interface MemberCardProps {
  user: IUser;
  onEdit: (user: IUser) => void;
  onDelete: (id: string | number) => void;
  isAdmin: boolean;
}

const formatRole = (role: string) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

const MemberCard = ({ user, onEdit, onDelete, isAdmin }: MemberCardProps) => {
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow overflow-hidden group relative">
      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5" />
      <div className="px-6 pb-6 relative">
        <div className="flex justify-between items-end -mt-10 mb-4">
          <span className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-card bg-muted">
            <img
              className="aspect-square h-full w-full object-cover"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.id}`}
              alt={fullName}
            />
          </span>

          {isAdmin && (
            <MemberActionsMenu
              onEdit={() => onEdit(user)}
              onDelete={() => onDelete(user.id!)}
            />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-tight">{fullName}</h3>
          <p className="text-sm text-primary font-medium">{formatRole(user.role)}</p>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-sm text-muted-foreground gap-3">
            <Mail className="w-4 h-4 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-3">
            <Phone className="w-4 h-4 shrink-0" />
            <span>{user.phone || "No phone number"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;