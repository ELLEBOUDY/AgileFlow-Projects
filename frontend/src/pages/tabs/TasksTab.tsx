import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";

interface TasksTabProps {
  tasks: any[];
  users: any[]; // 👈 أضفنا الـ users هنا في الـ Interface
  onEditTask: (task: any) => void;
  onDeleteTask: (id: string) => void;
  canManageTasks?: boolean;
}

export default function TasksTab({
  tasks,
  users = [], // 👈 استقبلنا الـ users هنا مع قيمة افتراضية مأمنة
  onEditTask,
  onDeleteTask,
  canManageTasks = false,
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
        tasks.map((task) => {
          // 🔍 ربط الداتا: البحث عن العضو المسؤول عن هذا التاسك
          const assignedUser = users.find(
            (u) => String(u.id) === String(task.assigned_to),
          );

          return (
            <div
              key={task.id}
              className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1329]/40 hover:bg-slate-50 dark:hover:bg-[#0b1329]/80 rounded-xl p-4 flex justify-between items-center transition shadow-sm hover:shadow dark:shadow-none group"
            >
              {/* الجزء الأيسر: النصوص والبيانات */}
              <div className="space-y-2 pr-4 flex-1 min-w-0">
                <div className="space-y-0.5">
                  <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200 truncate">
                    {task.task_title || task.title}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                    {task.description || "No core summary provided."}
                  </p>
                </div>

                {/* 👤 عرض بيانات الشخص المسؤول (Username + Email) بالشكل الجديد والرايق */}
                {assignedUser ? (
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/50 max-w-fit">
                    {/* دائرة الـ Avatar الصغير */}
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-[9px] uppercase shrink-0">
                      {assignedUser.username?.charAt(0)}
                    </div>
                    {/* اسم المستخدم والإيميل جنب بعض بشكل ناعم */}
                    <div className="flex items-center gap-1.5 text-[11px] truncate">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {assignedUser.username}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 font-normal">
                        ({assignedUser.email})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 italic pt-1">
                    Unassigned Task
                  </div>
                )}
              </div>

              {/* الجزء الأيمن: الـ Badge وأزرار التحكم */}
              <div className="flex items-center gap-4 shrink-0">
                <Badge
                  variant="outline"
                  className={`capitalize tracking-wide text-[11px] font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
                    task.status,
                  )}`}
                >
                  {task.status?.replace("_", " ")}
                </Badge>

                {canManageTasks && (
                  <div className="flex gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition duration-200">
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
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
