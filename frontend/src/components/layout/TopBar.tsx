import { Search, Bell, Sun, Moon, LogOut, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false); 
  const navigate = useNavigate();
  

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
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
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
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

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />

          <div className="flex items-center gap-x-4">
            <img
              className="h-8 w-8 rounded-full bg-accent"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User"
            />
            <span className="hidden lg:flex lg:items-center">
              <span className="text-sm font-semibold text-foreground mr-4">
                Mahmoud
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}