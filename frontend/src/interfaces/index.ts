export interface IUser {
  id?: string | number;
  name: string;
  email: string;
  role: "Admin" | "Developer" | "Designer" | "Manager";
  phone: string;
}

export interface IProject {
  id: string;
  title: string;
  description: string;
  status: "in_progress" | "planning" | "completed";
  progress: number;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  assigneeId: string | number;
  projectId: string;
}