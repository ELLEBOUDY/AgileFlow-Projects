import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const VELOCITY_DATA = [
  { sprint: 'Sprint 1', points: 34 },
  { sprint: 'Sprint 2', points: 42 },
  { sprint: 'Sprint 3', points: 38 },
  { sprint: 'Sprint 4', points: 55 },
  { sprint: 'Sprint 5', points: 48 },
  { sprint: 'Sprint 6', points: 61 },
];

const TASK_DISTRIBUTION = [
  { name: 'To Do', value: 12, color: '#94a3b8' },
  { name: 'In Progress', value: 19, color: '#3b82f6' },
  { name: 'In Review', value: 8, color: '#f97316' },
  { name: 'Done', value: 35, color: '#22c55e' },
];

const PROJECT_HEALTH = [
  { name: 'Website Redesign', bugs: 4, features: 12 },
  { name: 'Mobile App', bugs: 8, features: 5 },
  { name: 'Backend API', bugs: 2, features: 18 },
  { name: 'Marketing Campaign', bugs: 0, features: 9 },
];

export function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
        <p className="text-muted-foreground mt-1">Deep dive into your team's performance and project metrics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sprint Velocity Chart */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-2 p-6">
          <div className="space-y-1 mb-6">
            <h3 className="font-semibold leading-none tracking-tight">Sprint Velocity</h3>
            <p className="text-sm text-muted-foreground">Story points completed per sprint.</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VELOCITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="sprint" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="points" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVelocity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution Pie Chart */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="space-y-1 mb-6">
            <h3 className="font-semibold leading-none tracking-tight">Task Distribution</h3>
            <p className="text-sm text-muted-foreground">Current state of all tasks.</p>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TASK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {TASK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {TASK_DISTRIBUTION.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        {/* Project Health Bar Chart */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-3 p-6">
          <div className="space-y-1 mb-6">
            <h3 className="font-semibold leading-none tracking-tight">Project Health</h3>
            <p className="text-sm text-muted-foreground">Comparison of new features vs reported bugs.</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROJECT_HEALTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{fill: 'hsl(var(--muted))'}}
                />
                <Bar dataKey="features" name="Features Delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bugs" name="Bugs Reported" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
