import { createBrowserRouter, redirect } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import MainLayout from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { MyTasksPage } from "./pages/MyTasksPage";
import ProjectDetailsPage from "./pages/ProjectDetails";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TaskBoardPage } from "./pages/TaskBoardPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { VerifyCodePage } from "./pages/auth/VerifyCodePage";
// import { FilesPage } from "./pages/FilesPage";
import { MembersPage } from "./pages/MembersPage";
import { ReportsPage } from "./pages/ReportsPage";
import { TeamsPage } from "./pages/TeamsPage";

/**
 * Authentication loader guard to secure private routes
 * Redirects to login if tokens or flags are missing
 */
const protectedRouteLoader = () => {
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  const token = localStorage.getItem("access_token");

  if (!isAuth || !token) {
    return redirect("/login");
  }
  return null;
};

/**
 * Guest loader guard to prevent logged-in users from accessing auth pages
 */
const authRouteLoader = () => {
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  const token = localStorage.getItem("access_token");

  if (isAuth && token) {
    return redirect("/");
  }
  return null;
};

export const router = createBrowserRouter([
  // Guest & Authentication Public Routes
  {
    element: <AuthLayout />,
    loader: authRouteLoader,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "verify-code",
        element: <VerifyCodePage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
  // Protected Application Private Routes
  {
    path: "/",
    element: <MainLayout />,
    loader: protectedRouteLoader,
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
        path: "projects/:id",
        element: <ProjectDetailsPage />,
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
        path: "members",
        element: <MembersPage />,
      },
      {
        path: "teams",
        element: <TeamsPage />,
      },
      // {
      //   path: "files",
      //   element: <FilesPage />,
      // },
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
        element: (
          <div className="p-8 text-2xl font-bold">
            Admin Console (Coming Soon)
          </div>
        ),
      },
    ],
  },
]);
