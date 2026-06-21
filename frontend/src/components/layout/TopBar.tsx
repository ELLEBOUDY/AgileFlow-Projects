import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "../ProfileDropdown";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Hamburger (mobile only) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden -m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground" />
            <input
              id="search-field"
              className="block h-10 w-full rounded-md border border-input bg-transparent py-1.5 pl-8 pr-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search tasks, projects, or people..."
              type="search"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {mounted && (
            <button
              type="button"
              className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}

          <button className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border border-background"></span>
          </button>

          <ProfileDropdown onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}