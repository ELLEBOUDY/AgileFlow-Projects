import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OverviewTab from "./tabs/OverviewTab";
import TasksTab from "./tabs/TasksTab";
import TeamTab from "./tabs/TeamTab";
import FilesTab from "./tabs/FilesTab";

interface ProjectTabsProps {
  project: any;
  tasks: any[];
  users: any[];
  files: any[];
  onEditTask: (task: any) => void;
  onDeleteTask: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onRefreshFiles?: () => void;
  canManageTasks?: boolean;
}

export default function ProjectTabs({
  project,
  tasks = [],
  users,
  files,
  onEditTask,
  onDeleteTask,
  onDeleteFile,
  onRefreshFiles,
  canManageTasks = false,
}: ProjectTabsProps) {
  //  الـ States الخاصة بالـ Pagination للتسكات (5 بـ 5)
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  //  الفلترة الحقيقية والذكية للمستخدمين لعرضهم في الـ Team Tab
  const teamMemberIds =
    project?.team_members?.map((id: any) => String(id)) || [];
  const assignedUserIds = tasks
    .map((t) => String(t.assigned_to))
    .filter((id) => id !== "undefined" && id !== "null");

  const allProjectUserIds = Array.from(
    new Set([...teamMemberIds, ...assignedUserIds]),
  );

  const projectTeam = users.filter(
    (u) =>
      allProjectUserIds.includes(String(u.id)) || u.id === project?.manager_id,
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage) || 1;

  const handleFileUpload = async (formData: FormData) => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        "";

      if (!token) {
        alert("You are not authenticated. Please log in again.");
        return;
      }

      const originalFile = formData.get("file") as File;
      const taskId = formData.get("task") || formData.get("task_id");

      const djangoFormData = new FormData();

      if (originalFile) {
        djangoFormData.append("file_path", originalFile);
        djangoFormData.append("file_name", originalFile.name);
      }

      // ربط الـ Task
      if (taskId) {
        djangoFormData.append("task", String(taskId));
      } else if (tasks && tasks.length > 0) {
        djangoFormData.append("task", String(tasks[0].id));
      } else {
        alert("Please link this file to a task. Django requires a task field.");
        return;
      }

      let currentUserId =
        localStorage.getItem("user_id") ||
        localStorage.getItem("userId") ||
        project?.manager_id ||
        project?.manager;

      if (!currentUserId && token) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join(""),
          );
          const decoded = JSON.parse(jsonPayload);
          currentUserId = decoded.user_id || decoded.id;
        } catch (e) {
          console.error("Failed to decode JWT Token:", e);
        }
      }

      // إرسال الـ uploaded_by بعد تأمينه
      if (currentUserId) {
        djangoFormData.append("uploaded_by", String(currentUserId));
      } else {
        console.warn(
          "uploaded_by not found locally, trying to let Django handle it via token.",
        );
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/projects/files/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: djangoFormData,
        },
      );

      if (response.status === 401) {
        throw new Error("Unauthorized: Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Django Error Response:", errorData);
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      console.log("Uploaded successfully:", data);

      if (onRefreshFiles) {
        onRefreshFiles();
      } else {
        alert("File uploaded successfully! 🎉");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Error uploading file.");
    }
  };

  return (
    <Tabs defaultValue="tasks" className="w-full space-y-4">
      <TabsList className="bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-1 rounded-lg grid grid-cols-4 max-w-md w-full">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-primary data-[state=active]:text-white text-slate-600 dark:text-slate-400 text-xs sm:text-sm"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="tasks"
          className="data-[state=active]:bg-primary data-[state=active]:text-white text-slate-600 dark:text-slate-400 text-xs sm:text-sm"
        >
          Tasks
        </TabsTrigger>
        <TabsTrigger
          value="team"
          className="data-[state=active]:bg-primary data-[state=active]:text-white text-slate-600 dark:text-slate-400 text-xs sm:text-sm"
        >
          Team
        </TabsTrigger>
        <TabsTrigger
          value="files"
          className="data-[state=active]:bg-primary data-[state=active]:text-white text-slate-600 dark:text-slate-400 text-xs sm:text-sm"
        >
          Files
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview">
        <OverviewTab
          project={project}
          tasks={tasks}
          teamCount={projectTeam.length}
          filesCount={files.length}
        />
      </TabsContent>

      {/* Tasks Tab -> تم تمرير الـ currentTasks المقصوصة (5 فقط) */}
      <TabsContent value="tasks" className="space-y-4">
        <TasksTab
          tasks={currentTasks}
          users={users}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          canManageTasks={canManageTasks}
        />

        {/* شريط الـ Pagination الخاص بالتنقل بين صفحات التسكات الـ 5 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 px-1 text-xs border-t border-slate-100 dark:border-slate-800/60">
            <p className="text-muted-foreground font-medium">
              Showing{" "}
              <span className="text-slate-700 dark:text-slate-200 font-bold">
                {indexOfFirstTask + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-700 dark:text-slate-200 font-bold">
                {indexOfLastTask > tasks.length
                  ? tasks.length
                  : indexOfLastTask}
              </span>{" "}
              of{" "}
              <span className="text-slate-700 dark:text-slate-200 font-bold">
                {tasks.length}
              </span>{" "}
              entries
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="w-7 h-7 rounded-md disabled:opacity-30"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    className={`w-7 h-7 text-xs rounded-md p-0 font-bold transition-all ${
                      currentPage === pageNumber
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:text-slate-700 dark:hover:text-slate-100"
                    }`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                size="icon"
                className="w-7 h-7 rounded-md disabled:opacity-30"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </TabsContent>

      {/* Team Tab */}
      <TabsContent value="team">
        <TeamTab team={projectTeam} />
      </TabsContent>

      {/* Files Tab */}
      <TabsContent value="files">
        <FilesTab
          files={files}
          tasks={tasks}
          onDeleteFile={onDeleteFile}
          onUploadFile={handleFileUpload}
        />
      </TabsContent>
    </Tabs>
  );
}
