import { useQuery } from "@tanstack/react-query";
import { Plus, Search, MoreVertical } from "lucide-react";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

export function ProjectsPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects');
      return data;
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">Manage and track all your ongoing projects.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search projects..." className="pl-8" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">All</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Active</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Planning</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Completed</Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12 animate-pulse">Loading projects...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <div key={project.id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={project.status === 'in_progress' ? 'default' : 'secondary'} className="capitalize">
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-lg leading-tight mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                  {project.description || "No description provided for this project. Update it to help your team understand the goal."}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${project.progress === 100 ? 'bg-green-500' : 'bg-primary'}`} 
                      style={{ width: `${project.progress}%` }} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-accent" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.id + i}`} alt="" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">Updated 2d ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
