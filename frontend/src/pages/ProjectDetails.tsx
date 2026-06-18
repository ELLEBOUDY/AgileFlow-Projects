import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Users, CheckSquare, Paperclip } from "lucide-react";
import { api } from "@/services/api"; // Updated to use the secure token-injected instance
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

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "todo",
  });

  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [fileForm, setFileForm] = useState({
    name: "",
    url: "",
    type: "",
    size: "",
    date: "",
    uploader: "",
  });
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "task" | "file";
  } | null>(null);

  // 1. Fetch live single project details from Django
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      // Points to: api/projects/projects/{id}/
      const { data } = await api.get(`projects/projects/${id}/`);
      return data;
    },
  });

  // 2. Fetch tasks filtered by project from Django
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["projectTasks", id],
    queryFn: async () => {
      // Points to: api/projects/tasks/?project={id}
      const { data } = await api.get(`projects/tasks/?project=${id}`);
      return data;
    },
  });

  // 3. Fetch core system users (Corrected path to match login app base)
  // تعديل سطر 73 تقريباً في الفرونت إند
  const { data: users = [] } = useQuery({
    queryKey: ["users"],

    queryFn: async () => {
      // Points to: api/users/

      // NOTE: If you don't have a list view in users/urls.py yet, this might 404 until you add it.

      const { data } = await api.get("users/");

      return data;
    },
  });

  // 4. Fetch dynamic files attached to this specific project
  const { data: files = [] } = useQuery({
    queryKey: ["files", id],
    queryFn: async () => {
      // Points to: api/projects/files/?project={id}
      const { data } = await api.get(`projects/files/?project=${id}`);
      return data;
    },
  });

  // 5. Create real task integrated with Django backend
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: typeof taskForm) => {
      // Points to: api/projects/tasks/
      return await api.post("projects/tasks/", {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        project: Number(id),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", id] });
      setIsAddOpen(false);
      setTaskForm({ title: "", description: "", status: "todo" });
    },
  });

  // 6. Update operational task details inside database
  const editTaskMutation = useMutation({
    mutationFn: async (updatedTask: any) => {
      // Points to: api/projects/tasks/{id}/
      return await api.put(`projects/tasks/${updatedTask.id}/`, {
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        project: Number(id),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", id] });
      setIsEditOpen(false);
      setEditingTask(null);
    },
  });

  // 7. Delete task permanently
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // Points to: api/projects/tasks/{id}/
      return await api.delete(`projects/tasks/${taskId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", id] });
    },
  });

  // 8. Upload file mapping database
  const addFileMutation = useMutation({
    mutationFn: async (newFile: any) => {
      // Points to: api/projects/files/
      return await api.post("projects/files/", {
        name: newFile.name,
        file_url: newFile.url,
        project: Number(id),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", id] });
      setIsAddFileOpen(false);
    },
  });

  // 9. Destroy document payload entry
  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      // Points to: api/projects/files/{id}/
      return await api.delete(`projects/files/${fileId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", id] });
    },
  });

  const handleEditClick = (task: any) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
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

  // Calculated metrics parsed matching backend statuses
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

  const projectManager =
    users.find((u: any) => u.role === "Manager" || u.id === project.manager) ||
    users[0];

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
              "No description standard available for this ongoing project."}
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
              {projectManager?.name?.charAt(0) || "M"}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                {projectManager?.name || "Manager"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {projectManager?.role || "Management"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* COUNTERS GRID */}
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
            <p className="text-2xl font-bold mt-0.5">{users.length} Members</p>
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

      {/* VISUAL CHARTS ANALYTICS */}
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

      {/* WORKSPACE HUB */}
      <div className="border bg-card rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight">Workspace Hub</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddFileOpen(true)}
              className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm shadow-sm transition"
            >
              <Paperclip className="w-4 h-4 mr-2 shrink-0" />
              Upload File
            </Button>

            <Button
              size="sm"
              onClick={() => {
                setTaskForm({ title: "", description: "", status: "todo" });
                setIsAddOpen(true);
              }}
              className="bg-primary hover:bg-primary/90 text-xs"
            >
              + New Task
            </Button>
          </div>
        </div>

        <ProjectTabs
          project={project}
          tasks={tasks}
          users={users}
          files={files}
          onEditTask={handleEditClick}
          onDeleteTask={(taskId: string) =>
            setItemToDelete({ id: taskId, type: "task" })
          }
          onDeleteFile={(fileId: string) =>
            setItemToDelete({ id: fileId, type: "file" })
          }
        />
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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
            <select
              className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900 focus:outline-none focus:border-primary text-slate-300"
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
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#0b1329] text-slate-100 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Modify Core Task
            </DialogTitle>
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
            <select
              className="w-full border border-slate-800 p-2.5 rounded-lg bg-slate-900 focus:outline-none focus:border-primary text-slate-300"
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
            <Button
              className="w-full mt-2"
              onClick={() =>
                editTaskMutation.mutate({ id: editingTask.id, ...taskForm })
              }
              disabled={editTaskMutation.isPending}
            >
              {editTaskMutation.isPending ? "Updating..." : "Submit Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add File Dialog */}
      <Dialog open={isAddFileOpen} onOpenChange={setIsAddFileOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#0b1329] text-slate-100 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Attach Project Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <div className="border-2 border-dashed border-slate-800 hover:border-primary/50 rounded-xl p-6 text-center cursor-pointer bg-slate-900/40 transition relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileForm({
                      name: file.name,
                      url: "https://mockstorage.local/files/" + file.name,
                      type: file.name.split(".").pop() || "unknown",
                      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                      date: new Date().toLocaleDateString("en-US"),
                      uploader: "Current User",
                    });
                  }
                }}
              />
              <Paperclip className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs font-medium text-slate-300">
                {fileForm.name
                  ? `Selected: ${fileForm.name}`
                  : "Click to browse any file from your device"}
              </p>
            </div>

            <Button
              className="w-full mt-2"
              onClick={() => addFileMutation.mutate(fileForm)}
              disabled={addFileMutation.isPending || !fileForm.name}
            >
              {addFileMutation.isPending ? "Uploading..." : "Attach Document"}
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
