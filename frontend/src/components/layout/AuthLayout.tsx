import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
            <span className="text-2xl font-bold">A</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AgileFlow</h1>
          <p className="text-sm text-muted-foreground mt-1">Project Management System</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
