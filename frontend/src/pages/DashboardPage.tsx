import {
  BarChart2,
  Briefcase,
  CheckSquare,
  Users,
  ShieldCheck,
  ListTodo,
  Layers,
  UserCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import type { IProject, ITask, IUser } from "../interfaces";

const chartData = [
  { name: "Mon", completed: 4, new: 6 },
  { name: "Tue", completed: 7, new: 4 },
  { name: "Wed", completed: 5, new: 8 },
  { name: "Thu", completed: 12, new: 5 },
  { name: "Fri", completed: 8, new: 7 },
  { name: "Sat", completed: 3, new: 2 },
  { name: "Sun", completed: 6, new: 4 },
];

const statusColorMap: Record<ITask["status"], string> = {
  done: "bg-green-500",
  in_progress: "bg-orange-500",
  review: "bg-yellow-500",
  todo: "bg-muted-foreground",
};

export function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // جلب المشاريع
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<
    IProject[]
  >({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/projects");
      return data;
    },
  });

  // 🔄 جلب التاسكات بالباجينيرشن الحقيقي
  const { data: tasksData, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["tasks", currentPage],
    queryFn: async () => {
      const { data } = await api.get(`projects/tasks?page=${currentPage}`);
      return data;
    },
  });

  // جلب المستخدمين
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });

  const isLoading = isLoadingProjects || isLoadingTasks || isLoadingUsers;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  const currentTasks: ITask[] = tasksData?.results || [];
  const totalTasksCount = tasksData?.count || 0;

  const activeProjects = projects.filter(
    (p) => p.status === "in_progress",
  ).length;
  const totalTasks = totalTasksCount;
  const completedTasks = currentTasks.filter((t) => t.status === "done").length;
  const pendingTasks = totalTasks - completedTasks;
  const teamMembers = users.length;

  const totalPages = Math.ceil(totalTasksCount / itemsPerPage) || 1;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + currentTasks.length;

  const stats = [
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      desc: "Currently in progress",
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      desc: `${pendingTasks} pending`,
      icon: CheckSquare,
      color: "text-orange-500",
    },
    {
      title: "Team Members",
      value: teamMembers.toString(),
      desc: "Active in the system",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Completed Tasks",
      value: completedTasks.toString(),
      desc: "On current view",
      icon: BarChart2,
      color: "text-purple-500",
    },
  ];

  const getUserInitials = (user: any) => {
    const displayName = user.name || user.username || "";
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .filter(Boolean)
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const managers = users.filter(
    (u: any) => u.role === "admin" || u.role === "manager" || u.is_staff,
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your projects and tasks.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
          >
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                {stat.title}
              </h3>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-7 p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-4">
            Productivity Overview
          </h3>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorCompleted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                {/* 🛠️ تم إصلاح الـ dx و الـ dy هنا */}
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
                <Area
                  type="monotone"
                  dataKey="new"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorNew)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Project Ecosystem */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Teams */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col h-80">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-green-500" />
            <h4 className="font-semibold">Teams</h4>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {users.map((user: any) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                  {getUserInitials(user)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {user.role || (user.is_staff ? "Admin" : "Member")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Managers */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col h-80">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold">Project Managers</h4>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {managers.map((user: any) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <UserCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lead Oversight
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects Overview */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-purple-500" />
            <h4 className="font-semibold">Active Projects Overview</h4>
          </div>
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-all"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {project.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {project.progress || 0}%
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    project.status === "in_progress" ? "secondary" : "outline"
                  }
                  className="capitalize text-[10px]"
                >
                  {(project.status || "todo").replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Table With Real Pagination */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-orange-500" />
              <h4 className="font-semibold">Recent Task Activity</h4>
            </div>
            <Badge variant="outline" className="font-mono">
              {totalTasksCount} Total
            </Badge>
          </div>
        </div>
        <div>
          <div className="divide-y">
            {currentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${statusColorMap[task.status] || "bg-slate-400"}`}
                  />
                  <p className="text-sm font-medium">{task.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground italic">
                    Project: {task.title || "Global"}
                  </span>
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))}
            {currentTasks.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No tasks available.
              </div>
            )}
          </div>

          <div className="p-4 flex items-center justify-between border-t gap-2 flex-wrap sm:flex-nowrap">
            <p className="text-xs text-muted-foreground">
              Showing {totalTasksCount ? indexOfFirstItem + 1 : 0} to{" "}
              {indexOfLastItem} of {totalTasksCount} tasks
            </p>

            <div className="flex items-center gap-1.5 ml-auto">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    className="h-8 w-8 text-xs"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
