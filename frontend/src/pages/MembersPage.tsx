import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useUser } from "@/hooks/useUser";
import type { IUser } from "@/interfaces";
import type { MemberFormType, MemberEditFormType } from "@/validation";

import MemberCard from "@/components/members/MemberCard";
import MembersFilters from "@/components/members/MembersFilters";
import MemberFormModal from "@/components/members/MemberFormModal";
import DeleteMemberModal from "@/components/members/DeleteMemberModal";

export function MembersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();
  const isAdmin = currentUser?.role === "admin";

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<IUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | number | null>(null);

  const { data: users = [], isLoading } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users/");
      return data;
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: async (formData: MemberFormType) => {
      const fullName = `${formData.first_name.trim()} ${formData.last_name.trim()}`;
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        name: fullName,
        username: fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      };
      const { data } = await api.post("/users/register/", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      setEditingMember(null);
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async (formData: MemberEditFormType) => {
      // ✅ Never send username or name — backend rebuilds username safely
      const payload: Record<string, any> = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      };
      // ✅ Only send password if user actually typed one
      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password;
      }
      const { data } = await api.patch(`/users/${editingMember?.id}/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      setEditingMember(null);
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (userId: string | number) => {
      await api.delete(`/users/${userId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    },
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user: IUser) => {
      const userRole = (user.role || "").toLowerCase();
      if (roleFilter !== "all" && userRole !== roleFilter) return false;
      if (search.trim() !== "") {
        const text = search.toLowerCase();
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return (
          fullName.includes(text) ||
          user.email?.toLowerCase().includes(text)
        );
      }
      return true;
    });
  }, [users, search, roleFilter]);

  const handleSubmit = (data: MemberFormType | MemberEditFormType) => {
    if (editingMember) {
      updateMemberMutation.mutate(data as MemberEditFormType);
    } else {
      createMemberMutation.mutate(data as MemberFormType);
    }
  };

  const handleEdit = (user: IUser) => {
    setEditingMember(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string | number) => {
    setMemberToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Directory</h2>
          <p className="text-muted-foreground mt-1">
            Manage team members and their access roles.
          </p>
        </div>
        {isAdmin && (
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setEditingMember(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        )}
      </div>

      <MembersFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12 animate-pulse">
          Loading team members...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No members found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map((user: IUser) => (
            <MemberCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      <MemberFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingMember={editingMember}
        onSubmit={handleSubmit}
        isSubmitting={
          createMemberMutation.isPending || updateMemberMutation.isPending
        }
      />

      <DeleteMemberModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={() =>
          memberToDelete !== null && deleteMemberMutation.mutate(memberToDelete)
        }
        isLoading={deleteMemberMutation.isPending}
      />
    </div>
  );
}