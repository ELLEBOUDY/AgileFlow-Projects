import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, MoreVertical, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg p-6 border animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full"><X className="h-4 w-4" /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function TeamPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Developer", phone: "" });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    }
  });

  const createMember = useMutation({
    mutationFn: async (newUser: any) => {
      const { data } = await api.post('/users', newUser);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setFormData({ name: "", email: "", role: "Developer", phone: "" });
    }
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const selectedEmail = e.target.value;
    const existingUser = users.find((u: any) => u.email === selectedEmail);
    
    if (existingUser) {
      setFormData({
        email: selectedEmail,
        name: existingUser.name,
        role: existingUser.role,
        phone: existingUser.phone || "+1 (555) 000-0000"
      });
    } else {
      setFormData({ ...formData, email: selectedEmail });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMember.mutate(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Directory</h2>
          <p className="text-muted-foreground mt-1">Manage team members and their access roles.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search members by name or email..." className="pl-8" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">All Roles</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Admin</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Manager</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Developer</Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12 animate-pulse">Loading team members...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((user: any) => (
            <div key={user.id} className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between items-end -mt-10 mb-4">
                  <span className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-card bg-muted">
                    <img className="aspect-square h-full w-full object-cover" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || user.id}`} alt={user.name} />
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 mb-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg leading-tight">{user.name}</h3>
                  <p className="text-sm text-primary font-medium">{user.role}</p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground gap-3">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-3">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone || "+1 (555) 000-0000"}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="w-full text-xs" size="sm">Message</Button>
                  <Button variant="outline" className="w-full text-xs" size="sm">Profile</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 relative">
            <label className="text-sm font-medium leading-none">Email Address</label>
            <input 
              required
              type="email"
              list="existing-emails"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g., user@agileflow.com"
              value={formData.email}
              onChange={handleEmailChange}
            />
            <datalist id="existing-emails">
              {users.map((u: any) => (
                <option key={u.id} value={u.email} />
              ))}
            </datalist>
            <p className="text-xs text-muted-foreground">Select an existing email to auto-fill details, or type a new one.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Full Name</label>
            <input 
              required
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Role</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Phone Number</label>
              <input 
                type="text" 
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
