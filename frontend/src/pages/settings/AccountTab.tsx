import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useUser } from "../../hooks/useUser";
import { userAPI } from "../../services/api";
import { useState, useEffect, useRef } from "react";

export function AccountTab() {
  const { user, loading, refetch } = useUser();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (user && !initializedRef.current) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
      });
      initializedRef.current = true;
    }
  }, [user?.id]);

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => {
        setSaveMessage(null);
      }, 3000); // Auto-hide message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);

      // Update user profile with new data
      await userAPI.updateUser({
        username: `${formData.firstName} ${formData.lastName}`.trim(),
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      await refetch(); // Refresh user data from backend
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save profile";
      setSaveMessage({ type: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center py-8">Please log in first</div>;
  }

  return (
    <>
      <section className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <h3 className="text-xl font-semibold">Profile Information</h3>
        <div className="rounded-xl border bg-card p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-6">
            <img
              className="h-20 w-20 rounded-full bg-accent"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'user'}`}
              alt={user.first_name || "Profile"}
            />
            <Button variant="outline">Change Avatar</Button>
          </div>

          {saveMessage && (
            <div className={`p-3 rounded-md text-sm ${saveMessage.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
              }`}>
              {saveMessage.text}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Full Name</label>
              <Input
                value={user?.username || ""}
                disabled
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Role</label>
              <Input
                value={user?.role || ""}
                disabled
                placeholder="Role"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">First Name</label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Last Name</label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                disabled
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
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
