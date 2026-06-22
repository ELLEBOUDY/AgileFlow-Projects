import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckSquare,
  Edit3,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import api from "../services/api";
import { useUser } from "../hooks/useUser";
import { taskSchema, type TaskFormType } from "../validation";
import type { ITask } from "../interfaces";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "border-l-4 border-l-slate-400" },
  {
    id: "in_progress",
    title: "In Progress",
    color: "border-l-4 border-l-blue-500",
  },
  { id: "review", title: "In Review", color: "border-l-4 border-l-orange-500" },
  { id: "done", title: "Done", color: "border-l-4 border-l-green-500" },
];

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg p-6 border animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  color,
  onDelete,
  onEdit,
  onToggleDone,
  isOpen,
  onToggle,
  canDrag,
  canManage,
}: {
  task: any;
  color: string;
  onDelete?: (id: string) => void;
  onEdit?: (task: any) => void;
  onToggleDone?: (id: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  canDrag: boolean;
  canManage: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id.toString(),
      data: { task },
      disabled: !canDrag || isOpen,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card p-4 rounded-lg shadow-sm border ${color} hover:shadow-md transition-all group z-10 relative`}
    >
      <div className="flex justify-between items-start mb-2">
        <div
          {...listeners}
          {...attributes}
          className={`${canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-default"} flex-1 flex items-center gap-2`}
        >
          {canManage && onToggleDone && (
            <div
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDone(task.id);
              }}
            >
              {task.status === "done" ? (
                <CheckSquare className="w-4 h-4 text-primary fill-primary/10" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </div>
          )}
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-muted/50 border-none"
          >
            T-{task.id}
          </Badge>
        </div>
        {canManage && onToggle && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className={`h-5 w-5 ${isOpen ? "opacity-100 bg-muted" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                />
                <div className="absolute right-0 mt-1 w-36 bg-popover border rounded-md shadow-lg z-30 py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors text-left font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(task);
                      onToggle();
                    }}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Task
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-destructive/10 text-destructive transition-colors text-left font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(task.id);
                      onToggle();
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Task
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div
        {...listeners}
        {...attributes}
        className={
          canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }
      >
        <p
          className={`text-sm font-medium leading-snug mb-4 transition-all ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
        >
          {task.title}
        </p>

        <div className="flex justify-between items-center text-muted-foreground">
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{task.id * 2 || 0}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Paperclip className="w-3.5 h-3.5" />
              <span>1</span>
            </div>
          </div>

          <img
            className="h-6 w-6 rounded-full bg-accent pointer-events-none"
            src={`https:api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeId || task.id}`}
            alt="Assignee"
          />
        </div>
      </div>
    </div>
  );
}

function Column({
  column,
  tasks,
  onInlineAdd,
  onDelete,
  onEdit,
  onToggleDone,
  openMenuId,
  setOpenMenuId,
  canCreateTasks,
  canDragTasks,
  canManageTasks,
}: {
  column: any;
  tasks: any[];
  onInlineAdd: (status: string, title: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: any) => void;
  onToggleDone: (id: string) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  canCreateTasks: boolean;
  canDragTasks: boolean;
  canManageTasks: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSave = () => {
    if (newTaskTitle.trim()) {
      onInlineAdd(column.id, newTaskTitle);
      setNewTaskTitle("");
      setIsAdding(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-muted/30 rounded-xl p-4 h-full overflow-hidden transition-colors ${isOver ? "bg-muted/60 ring-2 ring-primary/20" : ""}`}
    >
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            {column.title}
          </h3>
          <Badge variant="secondary" className="text-xs h-5 px-1.5">
            {tasks.length}
          </Badge>
        </div>
        {canCreateTasks && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {isAdding && (
          <div className="bg-card p-3 rounded-lg shadow-sm border border-primary mb-3 animate-in fade-in zoom-in-95 duration-200">
            <input
              autoFocus
              className="w-full bg-transparent outline-none text-sm font-medium mb-2 placeholder:text-muted-foreground"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsAdding(false);
              }}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            color={column.color}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleDone={onToggleDone}
            isOpen={openMenuId === task.id.toString()}
            onToggle={() =>
              setOpenMenuId(
                openMenuId === task.id.toString() ? null : task.id.toString(),
              )
            }
            canDrag={canDragTasks}
            canManage={canManageTasks}
          />
        ))}
        {tasks.length === 0 && !isAdding && (
          <div className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-50">
            <p className="text-sm text-muted-foreground">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskBoardPage() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isAdmin = user?.role === "admin";
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TaskFormType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      assigneeId: "",
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("users/");
      return data;
    },
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await api.get("projects/tasks/?page_size=100");
      return data.results || [];
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({
      taskId,
      newStatus,
    }: {
      taskId: string;
      newStatus: string;
    }) => {
      await api.patch(`projects/tasks/${taskId}`, { status: newStatus });
    },
    onMutate: async ({ taskId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData(["tasks"], (old: any) =>
        old.map((task: any) =>
          task.id.toString() === taskId ? { ...task, status: newStatus } : task,
        ),
      );

      return { previousTasks };
    },
    onError: (err, newTodo, context: any) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`projects/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const createTask = useMutation({
    mutationFn: async (newTask: TaskFormType) => {
      if (editingTask) {
        const { data } = await api.put(`projects/tasks/${editingTask.id}`, {
          ...newTask,
          projectId: "1",
        });
        return data;
      } else {
        const { data } = await api.post("projects/tasks", {
          ...newTask,
          projectId: "1",
        });
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsModalOpen(false);
      setEditingTask(null);
      reset();
    },
  });

  const handleInlineAdd = (status: string, title: string) => {
    if (!isAdmin) return;

    createTask.mutate({
      title,
      status: status as TaskFormType["status"],
      description: "Added quickly from the board.",
      assigneeId:
        users
          .find((u: any) => {
            const role = String(u.role || "").toLowerCase();
            return role === "member";
          })
          ?.id?.toString() || "1",
    });
  };

  const onSubmit = (data: TaskFormType) => {
    if (!isAdmin) return;

    createTask.mutate(data);
  };

  const handleEditTask = (task: ITask) => {
    if (!isAdmin) return;

    setEditingTask(task);
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("status", task.status);
    setValue("assigneeId", task.assigneeId.toString());
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    reset();
  };

  useEffect(() => {
    if (isModalOpen && !editingTask) {
      reset({
        title: "",
        description: "",
        status: "todo",
        assigneeId: "",
      });
    }
  }, [isModalOpen, editingTask, reset]);

  const memberUsers = users.filter((u: any) => {
    const role = String(u.role || "").toLowerCase();
    return role === "member";
  });

  const handleDragStart = (event: any) => {
    if (!isAdmin) return;

    const { active } = event;
    const task = tasks.find((t: any) => t.id.toString() === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isAdmin) return;

    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id.toString();
    const newStatus = over.id.toString();

    const task = tasks.find((t: any) => t.id.toString() === taskId);

    if (task && task.status !== newStatus) {
      updateTaskStatus.mutate({ taskId, newStatus });
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Board</h2>
          <p className="text-muted-foreground mt-1">
            AgileFlow UI Revamp sprint.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex -space-x-2 mr-4">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-accent z-0"
                src={`https:api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                alt=""
              />
            ))}
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-medium text-muted-foreground z-0">
              +2
            </div>
          </div>
          {isAdmin && (
            <Button
              className="flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
            Loading board...
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
              {COLUMNS.map((column) => {
                const columnTasks = tasks.filter(
                  (t: any) => t.status === column.id,
                );
                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onInlineAdd={handleInlineAdd}
                    onDelete={(id) => {
                      if (isAdmin) deleteTaskMutation.mutate(id);
                    }}
                    onEdit={handleEditTask}
                    onToggleDone={(id) => {
                      if (!isAdmin) return;

                      const task = tasks.find(
                        (t: any) => t.id.toString() === id.toString(),
                      );
                      if (task) {
                        const newStatus =
                          task.status === "done" ? "todo" : "done";
                        updateTaskStatus.mutate({
                          taskId: id.toString(),
                          newStatus,
                        });
                      }
                    }}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    canCreateTasks={isAdmin}
                    canDragTasks={isAdmin}
                    canManageTasks={isAdmin}
                  />
                );
              })}
            </div>

            <DragOverlay>
              {activeTask ? (
                <TaskCard
                  task={activeTask}
                  color={
                    COLUMNS.find((c) => c.id === activeTask.status)?.color || ""
                  }
                  canDrag={isAdmin}
                  canManage={false}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Task Title
            </label>
            <input
              type="text"
              className={`flex h-10 w-full rounded-md border ${
                errors.title ? "border-destructive" : "border-input"
              } bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              placeholder="e.g., Update user profile schema"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Description
            </label>
            <textarea
              className={`flex min-h-[80px] w-full rounded-md border ${
                errors.description ? "border-destructive" : "border-input"
              } bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              placeholder="Provide a detailed description..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Status</label>
              <select
                className={`flex h-10 w-full rounded-md border ${
                  errors.status ? "border-destructive" : "border-input"
                } bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                {...register("status")}
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-xs text-destructive mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Assign To
              </label>
              <select
                className={`flex h-10 w-full rounded-md border ${
                  errors.assigneeId ? "border-destructive" : "border-input"
                } bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                {...register("assigneeId")}
                disabled={memberUsers.length === 0}
              >
                <option value="">
                  {memberUsers.length === 0
                    ? "No members available"
                    : "Select a member"}
                </option>
                {memberUsers.map((member: any) => (
                  <option key={member.id} value={member.id}>
                    {member.name || member.username || member.email}
                  </option>
                ))}
              </select>
              {errors.assigneeId && (
                <p className="text-xs text-destructive mt-1">
                  {errors.assigneeId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingTask
                  ? "Save Changes"
                  : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
