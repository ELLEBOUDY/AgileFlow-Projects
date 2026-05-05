import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export function AccountTab() {
  return (
    <>
      <section className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
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

      <section className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <h3 className="text-xl font-semibold text-destructive">Danger Zone</h3>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 space-y-4">
          <div>
            <h4 className="font-medium">Delete Account</h4>
            <p className="text-sm text-muted-foreground">Permanently remove your personal account and all of its contents.</p>
          </div>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </section>
    </>
  );
}
