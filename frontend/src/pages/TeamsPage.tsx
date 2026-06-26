import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useUser } from "@/hooks/useUser";
import TeamCard from "@/components/teams/TeamCard";
import TeamsFilters from "@/components/teams/TeamsFilters";
import TeamFormModal from "@/components/teams/Teamformmodal";
import DeleteTeamModal from "@/components/teams/Deleteteammodal";

export interface ITeam {
  id: number;
  team_name: string;
  description: string;
  manager: number;
  manager_email: string;
  members: number[];
  members_emails: string[];
  created_at: string;
  has_projects?: boolean;
}

export interface ITeamFormData {
  team_name: string;
  description: string;
  manager: number | null;
  members: number[];
  project_ids: number[];
}

export function TeamsPage() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);

  const { data: teams = [], isLoading } = useQuery<ITeam[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data } = await api.get("/projects/teams/");
      return data;
    },
  });

  const { data: projects = [] } = useQuery<{ id: number; title: string; team: number | null }[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/projects/");
      return data;
    },
  });

  const teamsWithProjectFlag = useMemo<ITeam[]>(() => {
    const assignedTeamIds = new Set(projects.map((p) => p.team).filter(Boolean));
    return teams.map((t) => ({
      ...t,
      has_projects: assignedTeamIds.has(t.id),
    }));
  }, [teams, projects]);

  const filteredTeams = useMemo(() => {
    return teamsWithProjectFlag.filter((team) => {
      if (filter === "assigned" && !team.has_projects) return false;
      if (filter === "unassigned" && team.has_projects) return false;
      if (search.trim() !== "") {
        const text = search.toLowerCase();
        return (
          team.team_name.toLowerCase().includes(text) ||
          team.description?.toLowerCase().includes(text) ||
          team.manager_email?.toLowerCase().includes(text)
        );
      }
      return true;
    });
  }, [teamsWithProjectFlag, search, filter]);

  const createTeamMutation = useMutation({
    mutationFn: async (formData: ITeamFormData) => {
      const payload = {
        team_name: formData.team_name,
        description: formData.description,
        manager: formData.manager,
        members: formData.members,
      };

      if (editingTeam) {
        const { data } = await api.put(`/projects/teams/${editingTeam.id}/`, payload);

        const currentTeamProjectIds = projects
          .filter((p) => p.team === editingTeam.id)
          .map((p) => p.id);

        const toAssign = formData.project_ids.filter((id) => !currentTeamProjectIds.includes(id));
        const toUnassign = currentTeamProjectIds.filter((id) => !formData.project_ids.includes(id));

        await Promise.all([
          ...toAssign.map((pid) => api.patch(`/projects/${pid}/`, { team: editingTeam.id })),
          ...toUnassign.map((pid) => api.patch(`/projects/${pid}/`, { team: null })),
        ]);

        return data;
      }

      const { data } = await api.post("/projects/teams/", payload);

      if (formData.project_ids.length > 0) {
        await Promise.all(
          formData.project_ids.map((pid) =>
            api.patch(`/projects/${pid}/`, { team: data.id })
          )
        );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
      setEditingTeam(null);
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      await api.delete(`/projects/teams/${teamId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsDeleteModalOpen(false);
      setTeamToDelete(null);
    },
  });

  const handleEdit = (team: ITeam) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleDelete = (teamId: number) => {
    setTeamToDelete(teamId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teams</h2>
          <p className="text-muted-foreground mt-1">
            Browse all teams, their members and project assignments.
          </p>
        </div>

        {isAdmin && (
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setEditingTeam(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            New Team
          </Button>
        )}
      </div>

      <TeamsFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12 animate-pulse">
          Loading teams...
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No teams found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      <TeamFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingTeam={editingTeam}
        allProjects={projects}
        onSubmit={(data) => createTeamMutation.mutate(data)}
        isSubmitting={createTeamMutation.isPending}
      />

      <DeleteTeamModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTeamToDelete(null);
        }}
        onConfirm={() => teamToDelete !== null && deleteTeamMutation.mutate(teamToDelete)}
        isLoading={deleteTeamMutation.isPending}
      />
    </div>
  );
}