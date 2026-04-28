import { BarChart2, Briefcase, CheckSquare, Users, ShieldCheck, ListTodo, Layers, UserCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from "../services/api";
import { Badge } from "../components/ui/badge";

export function DashboardPage() {
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects');
      return data;
    }
  });

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks');
      return data;
    }
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    }
  });

  const isLoading = isLoadingProjects || isLoadingTasks || isLoadingUsers;

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>;
  }

  const activeProjects = projects.filter((p: any) => p.status === 'in_progress').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.status === 'done').length;
  const teamMembers = users.length;

  const stats = [
    { title: "Active Projects", value: activeProjects.toString(), desc: "Currently in progress", icon: Briefcase, color: "text-blue-500" },
    { title: "Total Tasks", value: totalTasks.toString(), desc: `${tasks.filter((t: any) => t.status !== 'done').length} pending`, icon: CheckSquare, color: "text-orange-500" },
    { title: "Team Members", value: teamMembers.toString(), desc: "Active in the system", icon: Users, color: "text-green-500" },
    { title: "Completed Tasks", value: completedTasks.toString(), desc: "All time", icon: BarChart2, color: "text-purple-500" },
  ];

  const chartData = [
    { name: 'Mon', completed: 4, new: 6 },
    { name: 'Tue', completed: 7, new: 4 },
    { name: 'Wed', completed: 5, new: 8 },
    { name: 'Thu', completed: 12, new: 5 },
    { name: 'Fri', completed: 8, new: 7 },
    { name: 'Sat', completed: 3, new: 2 },
    { name: 'Sun', completed: 6, new: 4 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your projects and tasks.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">{stat.title}</h3>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-4 p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-4">Productivity Overview</h3>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="new" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-3 p-4">
          <h3 className="font-semibold leading-none tracking-tight mb-4">Project Status</h3>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={projects.map((p: any) => ({ name: p.title, progress: p.progress }))} 
                margin={{ top: 10, right: 30, bottom: 0 }} 
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  width={150} 
                  interval={0}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{fill: 'hsl(var(--muted))'}}
                />
                <Bar dataKey="progress" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Project Ecosystem</h3>
          <p className="text-sm text-muted-foreground mt-1">A detailed look at your workspace resources and activities.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Teams Section */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold">Teams</h4>
            </div>
            <div className="space-y-4">
              {users.slice(0, 4).map((user: any) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                    {user.name.split(' ').map((n: any) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Managers Section */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold">Project Managers</h4>
            </div>
            <div className="space-y-4">
              {users.filter((u: any) => u.role === 'Admin' || u.role === 'Developer').slice(0, 4).map((user: any) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Lead Oversight</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold">Active Projects Overview</h4>
            </div>
            <div className="space-y-3">
              {projects.map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-all">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{project.title}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{project.progress}%</span>
                    </div>
                  </div>
                  <Badge variant={project.status === 'in_progress' ? 'secondary' : 'outline'} className="capitalize text-[10px]">
                    {project.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold">Recent Task Activity</h4>
              </div>
              <Badge variant="outline" className="font-mono">{tasks.length} Total</Badge>
            </div>
          </div>
          <div className="p-0">
            <div className="divide-y">
              {tasks.slice(0, 6).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${task.status === 'done' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <p className="text-sm font-medium">{task.title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground italic">
                      Project ID: {task.projectId}
                    </span>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 text-center border-t">
              <button className="text-xs font-medium text-primary hover:underline">View all task activities</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
