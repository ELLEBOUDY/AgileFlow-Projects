export interface IUser {
  id?: string | number;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "member" | "manager";
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