import type { IProject } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import ProjectActionsMenu from "./ProjectActionsMenu";

interface ProjectCardProps {
  project: IProject;
  onEdit: (project: IProject) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) => {
  return (
    <div className="group rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all relative">
      <div>
        <div className="flex justify-between items-start mb-4">
          <Badge
            variant={
              project.status === "in_progress"
                ? "default"
                : "secondary"
            }
            className="capitalize"
          >
            {project.status.replace("_", " ")}
          </Badge>

          <ProjectActionsMenu
            onEdit={() => onEdit(project)}
            onDelete={() => onDelete(project.id)}
          />
        </div>

        <h3 className="font-semibold text-lg leading-tight mb-2">
          {project.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
          {project.description ||
            "No description provided for this project."}
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
              className={`h-full ${
                project.progress === 100
                  ? "bg-green-500"
                  : "bg-primary"
              }`}
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
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                  project.id + i
                }`}
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
  );
};

export default ProjectCard;