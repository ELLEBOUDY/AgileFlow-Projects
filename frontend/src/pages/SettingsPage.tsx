import { useState } from "react";
import { User, Bell, Shield } from "lucide-react";
import { AccountTab } from "./settings/AccountTab";
import { SecurityTab } from "./settings/SecurityTab";
import { NotificationsTab } from "./settings/NotificationsTab";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'account' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <User className="w-4 h-4" /> Account
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'notifications' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'security' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Shield className="w-4 h-4" /> Security
            </button>
          </nav>
        </aside>

        <main className="md:w-3/4 space-y-8">
          {activeTab === "account" && <AccountTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </main>
      </div>
    </div>
  );
}
