import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

import type { IProject } from "@/interfaces";
import { projectSchema, type ProjectFormType } from "@/validation";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: IProject | null;
  onSubmit: (data: ProjectFormType) => void;
  isSubmitting: boolean;
}

interface ITeam {
  id: number;
  team_name: string;
}

const ProjectFormModal = ({
  isOpen,
  onClose,
  editingProject,
  onSubmit,
  isSubmitting,
}: ProjectFormModalProps) => {
  const { data: teams = [], isLoading: isLoadingTeams } = useQuery<ITeam[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data } = await api.get("/projects/teams/");
      return data;
    },
    enabled: isOpen,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProjectFormType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "planning",
      progress: 0,
      team: null,
      start_date: "", // ➕ قيمة افتراضية
      end_date: "", // ➕ قيمة افتراضية
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingProject) {
        const teamId =
          editingProject.team && typeof editingProject.team === "object"
            ? (editingProject.team as any).id
            : editingProject.team;

        reset({
          title: editingProject.title,
          description: editingProject.description,
          status: editingProject.status,
          progress: editingProject.progress,
          team: teamId ? Number(teamId) : null,
          start_date: editingProject.start_date || "", // ➕ تعبئة تاريخ البدء عند التعديل
          end_date: editingProject.end_date || "", // ➕ تعبئة تاريخ الانتهاء عند التعديل
        });
      } else {
        reset({
          title: "",
          description: "",
          status: "planning",
          progress: 0,
          team: null,
          start_date: "",
          end_date: "",
        });
      }
    }
  }, [editingProject, reset, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProject ? "Edit Project" : "Create New Project"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Project Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Title</label>
          <input
            type="text"
            className={`flex h-10 w-full rounded-md border ${
              errors.title ? "border-destructive" : "border-input"
            } bg-transparent px-3 py-2 text-sm`}
            placeholder="e.g., Mobile App Launch"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Team Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assign to Team</label>
          <select
            className={`flex h-10 w-full rounded-md border ${
              errors.team ? "border-destructive" : "border-input"
            } bg-background px-3 py-2 text-sm`}
            {...register("team", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
          >
            <option value="">-- Select a Team --</option>
            {isLoadingTeams ? (
              <option disabled>Loading teams...</option>
            ) : (
              teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.team_name}
                </option>
              ))
            )}
          </select>
          {errors.team && (
            <p className="text-xs text-destructive">{errors.team.message}</p>
          )}
        </div>

        {/* ➕ صف التواريخ الجديد بالكامل (Start Date & End Date) 📆 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("start_date")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <input
              type="date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("end_date")}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            className={`flex min-h-[100px] w-full rounded-md border ${
              errors.description ? "border-destructive" : "border-input"
            } bg-transparent px-3 py-2 text-sm`}
            placeholder="Provide a detailed description..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Status & Progress */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className={`flex h-10 w-full rounded-md border ${
                errors.status ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm`}
              {...register("status")}
            >
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Progress ({watch("progress") || 0}%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className={`flex h-10 w-full rounded-md border ${
                errors.progress ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm`}
              {...register("progress", {
                valueAsNumber: true,
              })}
            />
            {errors.progress && (
              <p className="text-xs text-destructive">
                {errors.progress.message}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : editingProject
                ? "Save Changes"
                : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;
