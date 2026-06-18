import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Users,
  FileText,
  BarChart2,
  Settings,
  ShieldAlert,
  KanbanSquare,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "My Tasks", href: "/my-tasks", icon: CheckSquare },
  { name: "Task Board", href: "/task-board", icon: KanbanSquare },
  { name: "Team", href: "/team", icon: Users },
  // { name: 'Files', href: '/files', icon: FileText },
  // { name: 'Reports', href: '/reports', icon: BarChart2 },
];

export function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <>
      {/* Overlay (mobile) */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "flex h-full w-64 flex-col bg-card border-r fixed inset-y-0 left-0 z-50 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:z-auto",
        )}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center px-6 justify-between">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              A
            </div>
            AgileFlow
          </h1>

          {/* Close button (mobile only) */}
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 space-y-1 px-3">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)} // close on mobile click
                className={({ isActive }) =>
                  cn(
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  )
                }
              >
                <item.icon className="mr-3 h-5 w-5 shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t space-y-1">
          <NavLink
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              cn(
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              )
            }
          >
            <Settings className="mr-3 h-5 w-5 shrink-0" />
            Settings
          </NavLink>

          {/* <NavLink
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              cn(
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              )
            }
          >
            <ShieldAlert className="mr-3 h-5 w-5 shrink-0" />
            Admin Console
          </NavLink> */}
        </div>
      </div>
    </>
  );
}
