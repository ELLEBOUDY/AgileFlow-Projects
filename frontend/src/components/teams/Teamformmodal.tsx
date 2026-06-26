import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import api from "@/services/api";
import type { ITeam, ITeamFormData } from "@/pages/TeamsPage";

interface IUserOption {
  id: number;
  email: string;
  username: string;
  role: string;
}

interface IProjectOption {
  id: number;
  title: string;
  team: number | null;
}

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTeam: ITeam | null;
  allProjects: IProjectOption[];
  onSubmit: (data: ITeamFormData) => void;
  isSubmitting: boolean;
}

const TeamFormModal = ({
  isOpen,
  onClose,
  editingTeam,
  allProjects,
  onSubmit,
  isSubmitting,
}: TeamFormModalProps) => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [managerId, setManagerId] = useState<number | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<IUserOption[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<IProjectOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch all users
  const { data: allUsers = [] } = useQuery<IUserOption[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users/");
      return data;
    },
    enabled: isOpen,
  });

  const managers = allUsers.filter((u) => u.role === "manager" || u.role === "admin");
  const members = allUsers.filter((u) => u.role === "member");

  // Projects that are unassigned OR already assigned to this team (when editing)
  const availableProjects = allProjects.filter(
    (p) => p.team === null || (editingTeam && p.team === editingTeam.id)
  );

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      if (editingTeam) {
        setTeamName(editingTeam.team_name);
        setDescription(editingTeam.description || "");
        setManagerId(editingTeam.manager ?? null);

        const currentMembers = allUsers.filter((u) =>
          editingTeam.members.includes(u.id)
        );
        setSelectedMembers(currentMembers);

        const currentProjects = allProjects.filter((p) => p.team === editingTeam.id);
        setSelectedProjects(currentProjects);
      } else {
        setTeamName("");
        setDescription("");
        setManagerId(null);
        setSelectedMembers([]);
        setSelectedProjects([]);
      }
      setErrors({});
    }
  }, [isOpen, editingTeam, allUsers, allProjects]);

  const addMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    if (!id) return;
    const user = members.find((m) => m.id === id);
    if (user && !selectedMembers.find((m) => m.id === id)) {
      setSelectedMembers((prev) => [...prev, user]);
    }
    e.target.value = "";
  };

  const removeMember = (id: number) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addProject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    if (!id) return;
    const project = availableProjects.find((p) => p.id === id);
    if (project && !selectedProjects.find((p) => p.id === id)) {
      setSelectedProjects((prev) => [...prev, project]);
    }
    e.target.value = "";
  };

  const removeProject = (id: number) => {
    setSelectedProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!teamName.trim() || teamName.trim().length < 2)
      errs.team_name = "Team name must be at least 2 characters.";
    if (!description.trim() || description.trim().length < 10)
      errs.description = "Description must be at least 10 characters.";
    if (!managerId)
      errs.manager = "Please select a manager for this team.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      team_name: teamName.trim(),
      description: description.trim(),
      manager: managerId,
      members: selectedMembers.map((m) => m.id),
      project_ids: selectedProjects.map((p) => p.id),
    });
  };

  const unselectedMembers = members.filter(
    (m) => !selectedMembers.find((s) => s.id === m.id)
  );
  const unselectedProjects = availableProjects.filter(
    (p) => !selectedProjects.find((s) => s.id === p.id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTeam ? "Edit Team" : "Create New Team"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Team Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Team Name</label>
          <input
            type="text"
            className={`flex h-10 w-full rounded-md border ${
              errors.team_name ? "border-destructive" : "border-input"
            } bg-transparent px-3 py-2 text-sm`}
            placeholder="e.g., Frontend Squad"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          {errors.team_name && (
            <p className="text-xs text-destructive">{errors.team_name}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            className={`flex min-h-[80px] w-full rounded-md border ${
              errors.description ? "border-destructive" : "border-input"
            } bg-transparent px-3 py-2 text-sm`}
            placeholder="What does this team work on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description}</p>
          )}
        </div>

        {/* Manager — single select */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Manager</label>
          <select
            className={`flex h-10 w-full rounded-md border ${
              errors.manager ? "border-destructive" : "border-input"
            } bg-background px-3 py-2 text-sm`}
            value={managerId ?? ""}
            onChange={(e) => setManagerId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">-- Select a Manager --</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.username} ({m.email})
              </option>
            ))}
          </select>
          {errors.manager && (
            <p className="text-xs text-destructive">{errors.manager}</p>
          )}
        </div>

        {/* Members — multi-select via pills */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Members</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            onChange={addMember}
            defaultValue=""
          >
            <option value="">-- Add a member --</option>
            {unselectedMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.username} ({m.email})
              </option>
            ))}
          </select>

          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedMembers.map((m) => (
                <span
                  key={m.id}
                  className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.email}`}
                    className="h-4 w-4 rounded-full"
                    alt=""
                  />
                  {m.username}
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="ml-0.5 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {selectedMembers.length === 0 && (
            <p className="text-xs text-muted-foreground">No members selected yet.</p>
          )}
        </div>

        {/* Projects — multi-select via pills */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assign Projects</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            onChange={addProject}
            defaultValue=""
          >
            <option value="">-- Add a project --</option>
            {unselectedProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {selectedProjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProjects.map((p) => (
                <span
                  key={p.id}
                  className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full"
                >
                  {p.title}
                  <button
                    type="button"
                    onClick={() => removeProject(p.id)}
                    className="ml-0.5 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {selectedProjects.length === 0 && (
            <p className="text-xs text-muted-foreground">No projects assigned yet.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : editingTeam
              ? "Save Changes"
              : "Create Team"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamFormModal;