import { Smartphone, Monitor } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { userAPI } from "../../services/api";

export function SecurityTab() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getErrorMessage = (error: any) => {
    const data = error.response?.data;
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.current_password?.[0] === "string") return data.current_password[0];
    if (typeof data?.new_password?.[0] === "string") return data.new_password[0];
    if (typeof data?.confirm_password?.[0] === "string") return data.confirm_password[0];
    if (typeof data?.non_field_errors?.[0] === "string") return data.non_field_errors[0];
    return "Failed to update password.";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all password fields." });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    try {
      setSaving(true);
      await userAPI.changePassword({
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({ type: "success", text: "Password updated successfully. You can now sign in with the new password." });
    } catch (error: any) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Change Password</h3>
        <form className="rounded-xl border bg-card p-6 space-y-4 shadow-sm" onSubmit={handleSubmit}>
          {message && (
            <div className={`p-3 rounded-md text-sm ${message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
              }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Current Password</label>
            <Input
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">New Password</label>
              <Input
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Confirm New Password</label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>
          <Button className="mt-2" type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </form>
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
