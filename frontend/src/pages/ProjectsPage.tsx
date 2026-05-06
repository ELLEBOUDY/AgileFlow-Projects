import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, MoreVertical, Edit3, Trash2 } from "lucide-react";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useState, useMemo } from "react";

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/projects");
      return data;
    },
  });

  // Mutation
  // const deleteProjectMutation = useMutation({
  //   mutationFn: async (projectId: string) => {
  //     await api.delete(`/projects/${projectId}`);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["projects"] });
  //   },
  // });

  const filteredProjects = useMemo(() => {
    return projects.filter((project: any) => {
      if (statusFilter !== "all" && project.status !== statusFilter)
        return false;
      if (search.trim() !== "") {
        const text = search.toLowerCase();
        return (
          project.title.toLowerCase().includes(text) ||
          project.description?.toLowerCase().includes(text)
        );
      }
      return true;
    });
  }, [projects, search, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track all your ongoing projects.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "in_progress", "planning", "completed"].map((status) => (
            <Badge
              key={status}
              variant={statusFilter === status ? "secondary" : "outline"}
              onClick={() => setStatusFilter(status)}
              className="cursor-pointer capitalize"
            >
              {status === "all" ? "All" : status.replace("_", " ")}
            </Badge>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-center text-muted-foreground py-12 animate-pulse">
          Loading projects...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: any) => (
            <div
              key={project.id}
              className="group rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all relative"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <Badge
                    variant={
                      project.status === "in_progress" ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {project.status.replace("_", " ")}
                  </Badge>

                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 -mr-2 rounded-full ${openMenuId === project.id ? "bg-muted" : "opacity-0 group-hover:opacity-100"} transition-all`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === project.id ? null : project.id,
                        );
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>

                    {openMenuId === project.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />

                        <div className="absolute right-0 mt-2 w-40 bg-popover border rounded-lg shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                            onClick={() => {
                              setOpenMenuId(null);
                            }}
                          >
                            <Edit3 className="w-4 h-4" /> Edit Project
                          </button>
                          <div className="h-px bg-border my-1" />
                          <button
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors text-left"
                            onClick={() => {
                              setOpenMenuId(null);
                            }}
                          >
                            <Trash2 className="w-4 h-4" /> Delete Project
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-lg leading-tight mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                  {project.description ||
                    "No description provided for this project."}
                </p>
              </div>

              {/* Progress and Footer */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${project.progress === 100 ? "bg-green-500" : "bg-primary"}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-accent"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.id + i}`}
                        alt="Avatar"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Updated 2d ago
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
