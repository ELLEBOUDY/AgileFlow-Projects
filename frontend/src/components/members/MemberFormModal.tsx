import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { memberSchema, memberEditSchema, type MemberFormType, type MemberEditFormType } from "@/validation";
import type { IUser } from "@/interfaces";

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember: IUser | null;
  onSubmit: (data: MemberFormType | MemberEditFormType) => void;
  isSubmitting: boolean;
}

const MemberFormModal = ({
  isOpen,
  onClose,
  editingMember,
  onSubmit,
  isSubmitting,
}: MemberFormModalProps) => {
  const isEditing = !!editingMember;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MemberFormType | MemberEditFormType>({
    resolver: zodResolver(isEditing ? memberEditSchema : memberSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "member",
      phone: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingMember) {
        reset({
          first_name: editingMember.first_name || "",
          last_name: editingMember.last_name || "",
          email: editingMember.email || "",
          role: editingMember.role || "member",
          phone: editingMember.phone || "",
          password: "",
        });
      } else {
        reset({
          first_name: "",
          last_name: "",
          email: "",
          role: "member",
          phone: "",
          password: "",
        });
      }
    }
  }, [isOpen, editingMember, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Member" : "Add Team Member"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              First Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              className={`flex h-10 w-full rounded-md border ${
                errors.first_name ? "border-destructive" : "border-input"
              } bg-transparent px-3 py-2 text-sm`}
              placeholder="John"
              {...register("first_name")}
            />
            {errors.first_name && (
              <p className="text-xs text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Last Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              className={`flex h-10 w-full rounded-md border ${
                errors.last_name ? "border-destructive" : "border-input"
              } bg-transparent px-3 py-2 text-sm`}
              placeholder="Doe"
              {...register("last_name")}
            />
            {errors.last_name && (
              <p className="text-xs text-destructive">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            className={`flex h-10 w-full rounded-md border ${
              errors.email ? "border-destructive" : "border-input"
            } bg-transparent px-3 py-2 text-sm`}
            placeholder="user@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone & Role */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Phone <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              maxLength={11}
              className={`flex h-10 w-full rounded-md border ${
                errors.phone ? "border-destructive" : "border-input"
              } bg-transparent px-3 py-2 text-sm`}
              placeholder="01012345678"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select
              className={`flex h-10 w-full rounded-md border ${
                errors.role ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm`}
              {...register("role")}
            >
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {isEditing ? (
              <>
                Password{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (leave blank to keep current)
                </span>
              </>
            ) : (
              <>
                Password <span className="text-destructive">*</span>
              </>
            )}
          </label>
          <input
            type="password"
            className={`flex h-10 w-full rounded-md border ${
              errors.password ? "border-destructive" : "border-input"
            } bg-transparent px-3 py-2 text-sm`}
            placeholder={isEditing ? "Leave blank to keep current" : "Min. 6 characters"}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Add Member"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberFormModal;