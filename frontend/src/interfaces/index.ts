export interface IUser {
  id?: string | number;
  name: string;
  email: string;
  role: "Admin" | "Member" | "Manager";
  phone: string;
}

export interface IProject {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in_progress" | "completed";
  progress: number;
  team?: number;
  team_name?: string;
  start_date?: string;
  end_date?: string;
}
export interface ITask {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  assigneeId: string | number;
  projectId: string;
}
