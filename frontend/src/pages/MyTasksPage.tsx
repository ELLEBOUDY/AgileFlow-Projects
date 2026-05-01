import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import api from "../services/api";
import { Badge } from "../components/ui/badge";
import type { ITask } from "@/interfaces";

export function MyTasksPage() {
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading } = useQuery<ITask[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await api.get("/tasks");
      return data;
    },
  });

  const toggleTaskStatus = useMutation({
    mutationFn: async ({
      taskId,
      currentStatus,
    }: {
      taskId: string;
      currentStatus: string;
    }) => {
      const newStatus = currentStatus === "done" ? "todo" : "done";
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
        <p className="text-muted-foreground mt-1">
          Here is a list of tasks assigned to you across all projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Completed
            </p>
            <h3 className="text-2xl font-bold">
              {tasks.filter((t: ITask) => t.status === "done").length}
            </h3>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              In Progress
            </p>
            <h3 className="text-2xl font-bold">
              {tasks.filter((t: ITask) => t.status === "in_progress").length}
            </h3>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">To Do</p>
            <h3 className="text-2xl font-bold">
              {tasks.filter((t: ITask) => t.status === "todo").length}
            </h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-4">
            Task List
          </h3>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading tasks...
            </div>
          ) : (
            <div className="divide-y">
              {tasks.map((task: ITask) => (
                <div
                  key={task.id}
                  className="py-4 flex items-center justify-between hover:bg-accent/30 px-4 -mx-4 rounded-lg transition-colors cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("clicked"); // Does this appear in console?
                    toggleTaskStatus.mutate({
                      taskId: task.id,
                      currentStatus: task.status,
                    });
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      {task.status === "done" ? (
                        <CheckSquare className="w-5 h-5 text-primary fill-primary/10" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium transition-all ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Project: AgileFlow UI Revamp
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={task.status === "done" ? "outline" : "secondary"}
                    className="capitalize"
                  >
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No tasks assigned to you.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
