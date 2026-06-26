import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useUser } from "@/hooks/useUser";
import type { IProject } from "@/interfaces";
import type { ProjectFormType } from "@/validation";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectsFilters from "@/components/projects/ProjectsFilters";
import ProjectFormModal from "@/components/projects/ProjectFormModal";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/projects");
      return data;
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (project: ProjectFormType) => {
      if (editingProject) {
        const { data } = await api.put(`/projects/${editingProject.id}`, project);
        return data;
      }
      const { data } = await api.post("/projects", project);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
      setEditingProject(null);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      await api.delete(`/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project: IProject) => {
      // Status filter
      if (statusFilter !== "all" && project.status !== statusFilter) return false;

      // Team assignment filter
      if (teamFilter === "assigned" && !project.team) return false;
      if (teamFilter === "unassigned" && project.team) return false;

      // Search filter
      if (search.trim() !== "") {
        const text = search.toLowerCase();
        return (
          project.title.toLowerCase().includes(text) ||
          project.description?.toLowerCase().includes(text) ||
          project.team_name?.toLowerCase().includes(text)
        );
      }

      return true;
    });
  }, [projects, search, statusFilter, teamFilter]);

  const handleSubmitProject = (data: ProjectFormType) => {
    if (!isAdmin) return;
    createProjectMutation.mutate(data);
  };

  const handleEditProject = (project: IProject) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProject = () => {
    if (!projectToDelete) return;
    deleteProjectMutation.mutate(projectToDelete);
    setProjectToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track all your ongoing projects.
          </p>
        </div>

        {isAdmin && (
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        )}
      </div>

      <ProjectsFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        teamFilter={teamFilter}
        setTeamFilter={setTeamFilter}
      />

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12 animate-pulse">
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No projects found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: IProject) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingProject={editingProject}
        onSubmit={handleSubmitProject}
        isSubmitting={createProjectMutation.isPending}
      />

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={confirmDeleteProject}
        isLoading={deleteProjectMutation.isPending}
      />
    </div>
  );
}