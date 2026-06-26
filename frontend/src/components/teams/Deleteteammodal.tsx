import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteTeamModal = ({ isOpen, onClose, onConfirm, isLoading }: DeleteTeamModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Team">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this team? All associated project
          assignments will be removed. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Team"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTeamModal;