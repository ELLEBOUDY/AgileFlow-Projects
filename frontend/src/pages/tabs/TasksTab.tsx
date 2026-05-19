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
  // 🎨 تعديل دالة الألوان لتناسب الـ Light والـ Dark معاً باستخدام درجات متوازنة
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "todo":
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
      case "in_progress":
        return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "review":
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
    }
  };

  return (
    <div className="space-y-3 mt-4 animate-in fade-in-50">
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
          No tasks listed under this sprint.
        </p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            /* 🔄 تغيير الخلفية والحدود:
               في الـ Light: خلفية بيضاء ساطعة، حدود هادية، وهوفير رمادي خفيف جداً
               في الـ Dark: بيرجع لشياكة الـ Dark القديمة بتاعتك بالظبط
            */
            className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1329]/40 hover:bg-slate-50 dark:hover:bg-[#0b1329]/80 rounded-xl p-4 flex justify-between items-center transition shadow-sm hover:shadow dark:shadow-none group"
          >
            <div className="space-y-1 pr-4">
              {/* عنوان التاسك: رمادي داكن يقارب الأسود في الـ Light، وأبيض في الـ Dark */}
              <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                {task.title}
              </p>
              {/* الوصف: متباين وواضح في الوضعين */}
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                {task.description || "No core summary provided."}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Badge
                variant="outline"
                className={`capitalize tracking-wide text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-colors ${getStatusColor(task.status)}`}
              >
                {task.status?.replace("_", " ")}
              </Badge>

              {/* أزرار التحكم: متوافقة مع الخلفية البيضاء والخلفية الكحلي */}
              <div className="flex gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition duration-200">
                <button
                  onClick={() => onEditTask(task)}
                  className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  title="Edit Task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
                  title="Delete Task"
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
