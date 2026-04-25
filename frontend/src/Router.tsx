import { createBrowserRouter, redirect } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { MyTasksPage } from "./pages/MyTasksPage";
import { TaskBoardPage } from "./pages/TaskBoardPage";
import { TeamPage } from "./pages/TeamPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { FilesPage } from "./pages/FilesPage";
import { ReportsPage } from "./pages/ReportsPage";

const checkAuth = () => {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuth) {
    throw redirect("/login");
  }
  return null;
};

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    loader: checkAuth,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "my-tasks",
        element: <MyTasksPage />,
      },
      {
        path: "task-board",
        element: <TaskBoardPage />,
      },
      {
        path: "team",
        element: <TeamPage />,
      },
      {
        path: "files",
        element: <FilesPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "admin",
        element: <div className="p-8 text-2xl font-bold">Admin Console (Coming Soon)</div>,
      },
    ],
  },
]);
