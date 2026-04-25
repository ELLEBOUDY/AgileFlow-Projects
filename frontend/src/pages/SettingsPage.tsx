import { User, Bell, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <nav className="flex flex-col gap-2">
            <a href="#" className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md font-medium text-sm">
              <User className="w-4 h-4" /> Account
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:bg-muted rounded-md font-medium text-sm transition-colors">
              <Bell className="w-4 h-4" /> Notifications
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:bg-muted rounded-md font-medium text-sm transition-colors">
              <Shield className="w-4 h-4" /> Security
            </a>
          </nav>
        </aside>

        <main className="md:w-3/4 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Profile Information</h3>
            <div className="rounded-xl border bg-card p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-6">
                <img className="h-20 w-20 rounded-full bg-accent" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="" />
                <Button variant="outline">Change Avatar</Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">First Name</label>
                  <Input defaultValue="Mahmoud" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Last Name</label>
                  <Input defaultValue="" placeholder="Enter last name" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium leading-none">Email</label>
                  <Input defaultValue="admin@agileflow.com" type="email" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-destructive">Danger Zone</h3>
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 space-y-4">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently remove your personal account and all of its contents.</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
