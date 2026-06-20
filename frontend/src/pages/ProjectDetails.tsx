import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Users,
  CheckSquare,
  Paperclip,
  UserPlus,
  Search,
} from "lucide-react";
import api from "@/services/api";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import ProjectTabs from "./ProjectTabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  // States الخاصة بالتاسكات
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "todo",
    assigneeId: "",
  });

  // ➕ States الخاصة بإضافة الأعضاء الجدد المشروع
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  // تأكيد الحذف
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "task" | "file";
  } | null>(null);

  // 1. جلب تفاصيل المشروع
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data } = await api.get(`projects/${id}/`);
      return data;
    },
    enabled: !!id,
  });

  // 2. جلب تاسكات المشروع
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["projectTasks", id],
    queryFn: async () => {
      const { data } = await api.get(`projects/tasks/?project=${id}`);
      return data;
    },
    enabled: !!id,
  });

  // 3. جلب مستخدمين النظام
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("users/");
      return data;
    },
  });

  // 4. جلب ملفات المشروع الداينامك
  const { data: files = [] } = useQuery({
    queryKey: ["files", id],
    queryFn: async () => {
      const { data } = await api.get(`projects/files/?project=${id}`);
      return data;
    },
    enabled: !!id,
  });

  // 5. إضافة تاسك حقيقي مربوط بديجانجو
  const addTaskMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (!isAdmin) return;

      const formattedData = {
        task_title: formData.title || formData.task_title,
        description: formData.description,
        priority: formData.priority?.toLowerCase() || "medium",
        status: formData.status?.toLowerCase() || "todo",
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString().split("T")[0]
          : null,
        project: project.id,
        assigned_to: formData.assigneeId || null,
      };

      const response = await api.post(`projects/tasks/`, formattedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", id] });
      setIsAddOpen(false);
    },
  });

  // 6. تعديل تاسك حقيقي في الداتابيز
  const editTaskMutation = useMutation({
    mutationFn: async ({ id: taskId, data }: { id: string; data: any }) => {
      if (!isAdmin) return;

      const formattedData = {
        task_title: data.title || data.task_title,
        description: data.description,
        priority: data.priority?.toLowerCase() || "medium",
        status: data.status?.toLowerCase(),
        deadline: data.deadline
          ? new Date(data.deadline).toISOString().split("T")[0]
          : null,
        project: project.id,
        assigned_to: data.assigneeId || null,
      };

      const response = await api.put(
        `projects/tasks/${taskId}/`,
        formattedData,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", id] });
      setIsEditOpen(false);
      setEditingTask(null);
    },
  });

  // 7. حذف تاسك نهائياً
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!isAdmin) return;

      return await api.delete(`projects/tasks/${taskId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", id] });
    },
  });

  // 8. حذف ملف نهائياً
  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      return await api.delete(`projects/files/${fileId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", id] });
    },
  });

  // ➕ 9. Mutation مخصصة لإضافة عضو جديد لفريق المشروع في ديجانجو
  const addMemberMutation = useMutation({
    mutationFn: async (userId: number) => {
      const updatedMembers = [...(project.team_members || []), userId];
      // مأمنة لاستخدام الـ project.team أو كـ fallback معتمد على المسار الفعلي
      const teamId = project.team?.id || project.team;
      return await api.patch(`projects/teams/${teamId}/`, {
        members: updatedMembers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setMemberSearch("");
    },
  });

  const handleEditClick = (task: any) => {
    if (!isAdmin) return;

    setEditingTask(task);
    setTaskForm({
      title: task.task_title || task.title,
      description: task.description || "",
      status: task.status || "todo",
      assigneeId: task.assigned_to ? String(task.assigned_to) : "",
    });
    setIsEditOpen(true);
  };

  if (projectLoading || tasksLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-muted-foreground animate-pulse">
        Loading project dynamic workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Project not found.</p>
        <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
      </div>
    );
  }

  const projectMembers = users.filter((u: any) =>
    project.team_members?.some((mId: any) => String(mId) === String(u.id)),
  );
  const assignableMembers = projectMembers.filter((u: any) => {
    const role = String(u.role || "").toLowerCase();
    return role === "member";
  });

  const canAssignTask = isAdmin;

  // حساب الإحصائيات للشارتات
  const todoCount = tasks.filter(
    (t: any) => t.status?.toLowerCase() === "todo",
  ).length;
  const inProgressCount = tasks.filter(
    (t: any) => t.status?.toLowerCase() === "in_progress",
  ).length;
  const reviewCount = tasks.filter(
    (t: any) => t.status?.toLowerCase() === "review",
  ).length;
  const doneCount = tasks.filter(
    (t: any) => t.status?.toLowerCase() === "done",
  ).length;

  const pieData = [
    { name: "To Do", value: todoCount, color: "#64748b" },
    { name: "In Progress", value: inProgressCount, color: "#3b82f6" },
    { name: "Review", value: reviewCount, color: "#f59e0b" },
    { name: "Done", value: doneCount, color: "#10b981" },
  ].filter((item) => item.value > 0);

  const barData = [
    {
      name: "Metrics",
      "To Do": todoCount,
      "In Progress": inProgressCount,
      Review: reviewCount,
      Done: doneCount,
    },
  ];

  const availableUsersToAssign = users.filter((u: any) => {
    const isAlreadyMember = project.team_members?.some(
      (mId: any) => String(mId) === String(u.id),
    );
    const isManager = u.id === project.manager_id;
    const matchesSearch =
      u.username?.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(memberSearch.toLowerCase());
    return !isAlreadyMember && !isManager && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Button>
      </div>

      {/* تفاصيل المشروع العلوي */}
      <div className="border bg-card text-card-foreground rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name || project.title}
            </h1>
            <Badge className="capitalize bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10">
              {project.status?.replace("_", " ")}
            </Badge>
          </div>

          <p className="text-muted-foreground text-sm max-w-3xl leading-relaxed">
            {project.description ||
              "No description available for this project."}
          </p>

          <div className="space-y-1.5 pt-2 max-w-md">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Overall Project Progress
              </span>
              <span className="font-semibold text-primary">
                {project.progress || 0}%
              </span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="border bg-accent/40 rounded-xl p-4 min-w-[240px] h-fit space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Project Manager
          </span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border flex items-center justify-center font-bold text-sm">
              {project?.manager_name?.charAt(0).toUpperCase() || "M"}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                {project?.manager_name || "Manager"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Project Manager
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* العدادات الرقمية */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border bg-card rounded-xl p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              Total Tasks
            </p>
            <p className="text-2xl font-bold mt-0.5">{tasks.length}</p>
          </div>
        </div>

        <div className="border bg-card rounded-xl p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              Team Scale
            </p>
            <p className="text-2xl font-bold mt-0.5">
              {project.team_members?.length || 0} Members
            </p>
          </div>
        </div>

        <div className="border bg-card rounded-xl p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Paperclip className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              Attached Files
            </p>
            <p className="text-2xl font-bold mt-0.5">{files.length}</p>
          </div>
        </div>
      </div>

      {/* الشارتات والتحليلات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-card-foreground">
            Tasks State Distribution
          </h3>
          <div className="h-[260px] flex items-center justify-center">
            {tasks.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No workflow data available for visualization.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="40%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(15 23 42)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-xs text-muted-foreground">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="border bg-card rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-card-foreground">
            Task Workload Analytics
          </h3>
          <div className="h-[260px]">
            {tasks.length === 0 ? (
              <p className="text-xs text-muted-foreground flex h-full items-center justify-center">
                No analytic units recorded.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(15 23 42)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs text-muted-foreground">
                        {value}
                      </span>
                    )}
                  />
                  <Bar dataKey="To Do" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="In Progress"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar dataKey="Review" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Done" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* الـ Hub الأساسي والتّبويبات */}
      <div className="border bg-card rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight">Workspace Hub</h2>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddMemberOpen(true)}
              className="border-primary/30 text-primary hover:bg-primary/5 text-xs font-medium"
            >
              <UserPlus className="w-4 h-4 mr-1.5 shrink-0" />
              Add Member
            </Button>

            {isAdmin && (
              <Button
                size="sm"
                onClick={() => {
                  setTaskForm({
                    title: "",
                    description: "",
                    status: "todo",
                    assigneeId: "",
                  });
                  setIsAddOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 text-xs"
              >
                + New Task
              </Button>
            )}
          </div>
        </div>

        {/* 🚀 تمرير الـ Props الصح لـ ProjectTabs بما فيها دالة تحديث قائمة الفايلات الفورية */}
        <ProjectTabs
          project={project}
          tasks={tasks}
          users={users}
          files={files}
          onEditTask={handleEditClick}
          onDeleteTask={(taskId: string) =>
            isAdmin && setItemToDelete({ id: taskId, type: "task" })
          }
          onDeleteFile={(fileId: string) =>
            setItemToDelete({ id: fileId, type: "file" })
          }
          onRefreshFiles={() =>
            queryClient.invalidateQueries({ queryKey: ["files", id] })
          }
          canManageTasks={isAdmin}
        />
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#0b1329] text-slate-100 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Assign Team Member
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3 text-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full border border-slate-800 pl-9 pr-4 py-2.5 rounded-lg bg-slate-900/60 focus:outline-none focus:border-primary text-white text-xs"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
              />
            </div>

            <div className="max-h-[220px] overflow-y-auto space-y-1 pr-1 border border-slate-800/40 rounded-lg p-1 bg-slate-950/20">
              {availableUsersToAssign.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No matching users available.
                </p>
              ) : (
                availableUsersToAssign.map((u: any) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-900 transition border border-transparent hover:border-slate-800"
                  >
                    <div>
                      <p className="text-xs font-semibold">{u.username}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {u.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-primary text-[11px]"
                      onClick={() => addMemberMutation.mutate(u.id)}
                      disabled={addMemberMutation.isPending}
                    >
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={isAdmin && isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#0b1329] text-slate-100 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Create Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <input
              type="text"
              placeholder="Task Title"
              className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900/60 focus:outline-none focus:border-primary text-white"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
            />
            <textarea
              placeholder="Task Description"
              className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900/60 h-24 resize-none focus:outline-none focus:border-primary text-white"
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block">
                  Status
                </label>
                <select
                  className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900 focus:outline-none focus:border-primary text-slate-300 text-xs"
                  value={taskForm.status}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, status: e.target.value })
                  }
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {canAssignTask && (
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block">
                    Assign To
                  </label>
                  <select
                    className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900 focus:outline-none focus:border-primary text-slate-300 text-xs"
                    value={taskForm.assigneeId}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, assigneeId: e.target.value })
                    }
                  >
                    <option value="">Unassigned</option>
                    {assignableMembers.map((member: any) => (
                      <option key={member.id} value={member.id}>
                        {member.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <Button
              className="w-full mt-2"
              onClick={() => addTaskMutation.mutate(taskForm)}
              disabled={addTaskMutation.isPending}
            >
              {addTaskMutation.isPending ? "Saving Task..." : "Create Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isAdmin && isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#0b1329] text-slate-100 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Modify Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <input
              type="text"
              className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900/60 focus:outline-none focus:border-primary text-white"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
            />
            <textarea
              className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900/60 h-24 resize-none focus:outline-none focus:border-primary text-white"
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block">
                  Status
                </label>
                <select
                  className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900 focus:outline-none focus:border-primary text-slate-300 text-xs"
                  value={taskForm.status}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, status: e.target.value })
                  }
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {canAssignTask && (
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block">
                    Assign To
                  </label>
                  <select
                    className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900 focus:outline-none focus:border-primary text-slate-300 text-xs"
                    value={taskForm.assigneeId}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, assigneeId: e.target.value })
                    }
                  >
                    <option value="">Unassigned</option>
                    {assignableMembers.map((member: any) => (
                      <option key={member.id} value={member.id}>
                        {member.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <Button
              className="w-full mt-2"
              onClick={() =>
                editTaskMutation.mutate({
                  id: editingTask.id,
                  data: taskForm,
                })
              }
              disabled={editTaskMutation.isPending}
            >
              {editTaskMutation.isPending ? "Updating..." : "Submit Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent className="bg-[#0b1329] text-slate-100 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-200">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm">
              This action cannot be undone. This will permanently delete the
              selected {itemToDelete?.type} from the workspace server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (itemToDelete) {
                  if (itemToDelete.type === "task") {
                    deleteTaskMutation.mutate(itemToDelete.id);
                  } else {
                    deleteFileMutation.mutate(itemToDelete.id);
                  }
                  setItemToDelete(null);
                }
              }}
            >
              Delete {itemToDelete?.type === "task" ? "Task" : "File"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
