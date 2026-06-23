import { Bell, Menu, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { ProfileDropdown } from "../ProfileDropdown";

// shadcn
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("projects/notifications/");
      return data;
    },
  });

  // mutation لتحديث الإشعار كـ مقروء
  const markAsRead = useMutation({
    mutationFn: (id: number) =>
      api.patch(`projects/notifications/${id}/`, { is_read: true }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n: any) => !n.is_read).length
    : 0;

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
      <button
        onClick={onMenuClick}
        className="lg:hidden -m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              className="h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* إضافة الـ Popover للإشعارات */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 font-semibold border-b">Notifications</div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n: any) => (
                    <div
                      key={n.id}
                      onClick={() => !n.is_read && markAsRead.mutate(n.id)}
                      className={`p-4 border-b cursor-pointer transition-colors ${!n.is_read ? "bg-muted/50 hover:bg-muted" : "hover:bg-muted"}`}
                    >
                      <p
                        className={`text-sm ${!n.is_read ? "font-semibold" : "text-muted-foreground"}`}
                      >
                        {n.message}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(n.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <ProfileDropdown onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
