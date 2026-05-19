import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";

interface TasksTabProps {
  tasks: any[];
  onEditTask: (task: any) => void;
  onDeleteTask: (id: string) => void;
}

export default function TasksTab({
  tasks,
  onEditTask,
  onDeleteTask,
}: TasksTabProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "todo":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "in_progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "review":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "done":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-3 mt-4 animate-in fade-in-50">
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-slate-800 rounded-xl">
          No tasks listed under this sprint.
        </p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="border border-slate-800/80 bg-[#0b1329]/40 hover:bg-[#0b1329]/80 rounded-xl p-4 flex justify-between items-center transition shadow-sm group"
          >
            <div className="space-y-1 pr-4">
              <p className="font-semibold text-sm sm:text-base text-slate-200">
                {task.title}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 line-clamp-1">
                {task.description || "No core summary provided."}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Badge
                variant="outline"
                className={`capitalize tracking-wide text-[11px] font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(task.status)}`}
              >
                {task.status?.replace("_", " ")}
              </Badge>

              <div className="flex gap-1.5 opacity-80 md:opacity-0 group-hover:opacity-100 transition duration-200">
                <button
                  onClick={() => onEditTask(task)}
                  className="p-2 rounded-lg hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
