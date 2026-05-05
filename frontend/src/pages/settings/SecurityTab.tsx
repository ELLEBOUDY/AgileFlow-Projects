import { Smartphone, Monitor } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export function SecurityTab() {
  return (
    <section className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Change Password</h3>
        <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Current Password</label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Confirm New Password</label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <Button className="mt-2">Update Password</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Active Sessions</h3>
        <div className="rounded-xl border bg-card p-6 shadow-sm divide-y">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-secondary text-secondary-foreground rounded-md">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Windows PC - Chrome</h4>
                <p className="text-xs text-muted-foreground">Cairo, Egypt • Active now</p>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">Current</span>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-secondary text-secondary-foreground rounded-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">iPhone 13 - Safari</h4>
                <p className="text-xs text-muted-foreground">Cairo, Egypt • Last active 2 hours ago</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Revoke</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
