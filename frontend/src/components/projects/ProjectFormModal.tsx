import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";

import type { IProject } from "@/interfaces";
import {
  projectSchema,
  type ProjectFormType,
} from "@/validation";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: IProject | null;
  onSubmit: (data: ProjectFormType) => void;
  isSubmitting: boolean;
}

const ProjectFormModal = ({
  isOpen,
  onClose,
  editingProject,
  onSubmit,
  isSubmitting,
}: ProjectFormModalProps) => {
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
    },
  });

  useEffect(() => {
    if (editingProject) {
      reset({
        title: editingProject.title,
        description: editingProject.description,
        status: editingProject.status,
        progress: editingProject.progress,
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "planning",
        progress: 0,
      });
    }
  }, [editingProject, reset, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingProject
          ? "Edit Project"
          : "Create New Project"
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Project Title
          </label>

          <input
            type="text"
            className={`flex h-10 w-full rounded-md border ${
              errors.title
                ? "border-destructive"
                : "border-input"
            } bg-transparent px-3 py-2 text-sm`}
            placeholder="e.g., Mobile App Launch"
            {...register("title")}
          />

          {errors.title && (
            <p className="text-xs text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Description
          </label>

          <textarea
            className={`flex min-h-[100px] w-full rounded-md border ${
              errors.description
                ? "border-destructive"
                : "border-input"
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Status
            </label>

            <select
              className={`flex h-10 w-full rounded-md border ${
                errors.status
                  ? "border-destructive"
                  : "border-input"
              } bg-background px-3 py-2 text-sm`}
              {...register("status")}
            >
              <option value="planning">Planning</option>
              <option value="in_progress">
                In Progress
              </option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Progress ({watch("progress")}%)
            </label>

            <input
              min="0"
              max="100"
              className={`flex h-10 w-full rounded-md border ${
                errors.progress
                  ? "border-destructive"
                  : "border-input"
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

        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
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