import { X } from "lucide-react";
import { Button } from "../components/ui/button";
interface IModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
const Modal = ({ isOpen, onClose, title, children }: IModal) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg p-6 border animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};
export default Modal;