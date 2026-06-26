import { MoreVertical, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TeamActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const TeamActionsMenu = ({ onEdit, onDelete }: TeamActionsMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 -mr-2 rounded-full ${
          open ? "bg-muted" : "opacity-0 group-hover:opacity-100"
        } transition-all`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 bg-popover border rounded-lg shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-100">
            <button
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
              onClick={() => { onEdit(); setOpen(false); }}
            >
              <Edit3 className="w-4 h-4" />
              Edit Team
            </button>
            <div className="h-px bg-border my-1" />
            <button
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors text-left"
              onClick={() => { onDelete(); setOpen(false); }}
            >
              <Trash2 className="w-4 h-4" />
              Delete Team
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamActionsMenu;