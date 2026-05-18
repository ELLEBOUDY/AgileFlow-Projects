import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Shield, LogOut, Settings, ChevronDown } from "lucide-react";

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    role: string;
    phone?: string;
    avatar?: string;
  };
  onLogout: () => void;
  width?: number; // Custom width in pixels (default: 320)
  position?: "left" | "right"; // Position relative to trigger (default: "right")
}

export function ProfileDropdown({ 
  user, 
  onLogout, 
  width = 320,
  position = "right" 
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleViewProfile = () => {
    setIsOpen(false);
    navigate("/settings");
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  const positionClass = position === "left" ? "left-0" : "right-0";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-3 hover:opacity-80 transition-opacity rounded-lg px-2 py-1 hover:bg-muted/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <img
          className="h-8 w-8 rounded-full bg-accent ring-2 ring-transparent hover:ring-primary transition-all"
          src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
          alt={user.name}
        />
        <span className="text-sm font-semibold text-foreground hidden sm:block">
          {user.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground hidden sm:block transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIsOpen(false)} />
          
          <div 
            className={`absolute ${positionClass} mt-2 origin-top-right rounded-lg border bg-popover shadow-lg z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200`}
            style={{ width: `${width}px` }}
          >
            {/* Header with Avatar */}
            <div className="flex flex-col items-center gap-3 p-4 border-b bg-gradient-to-b from-muted/50 to-transparent">
              <img
                className="h-16 w-16 rounded-full bg-accent ring-4 ring-primary/20"
                src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt={user.name}
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* User Info */}
            <div className="p-3 space-y-1">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-default">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium truncate">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-default">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-default">
                <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium truncate">{user.role}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-default">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium truncate">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-3 pt-2 space-y-1 border-t bg-muted/30">
              <button
                onClick={handleViewProfile}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-background transition-colors text-left"
              >
                <Settings className="h-4 w-4" />
                View Profile Settings
              </button>
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}