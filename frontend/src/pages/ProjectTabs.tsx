import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  onDeleteFile: (id: string) => void; //
}

export default function ProjectTabs({
  project,
  tasks,
  users,
  files,
  onEditTask,
  onDeleteTask,
  onDeleteFile,
}: ProjectTabsProps) {
  // fetch only members working on this project
  const assignedUserIds = Array.from(
    new Set(tasks.map((t) => String(t.assigneeId))),
  );
  const projectTeam = users.filter(
    (u) => assignedUserIds.includes(String(u.id)) || u.role === "Manager",
  );

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

      {/*  Tasks Tab */}
      <TabsContent value="tasks">
        <TasksTab
          tasks={tasks}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      </TabsContent>

      {/*  Team Tab */}
      <TabsContent value="team">
        <TeamTab team={projectTeam} />
      </TabsContent>

      {/* Files Tab */}
      <TabsContent value="files">
        <FilesTab files={files} onDeleteFile={onDeleteFile} />
      </TabsContent>
    </Tabs>
  );
}
