import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";

interface DeleteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteMemberModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteMemberModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Member">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this member? This action cannot be
          undone and will remove them from all teams and tasks.
        </p>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Member"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteMemberModal;