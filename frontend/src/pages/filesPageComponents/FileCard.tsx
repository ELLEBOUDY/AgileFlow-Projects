import { File, FileText, Image as ImageIcon, MoreVertical, Edit2, Trash2, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import type { FileItem } from "./types";

interface FileCardProps {
  file: FileItem;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
    case 'img': return <ImageIcon className="h-8 w-8 text-blue-500" />;
    case 'doc': return <FileText className="h-8 w-8 text-blue-700" />;
    default: return <File className="h-8 w-8 text-slate-500" />;
  }
};

export function FileCard({ file, openDropdownId, setOpenDropdownId, onEdit, onDelete }: FileCardProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all p-4 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-muted rounded-lg shrink-0">
          {getFileIcon(file.type)}
        </div>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setOpenDropdownId(openDropdownId === file.id ? null : file.id)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {openDropdownId === file.id && (
            <div className="absolute right-0 top-10 w-32 bg-popover text-popover-foreground border rounded-md shadow-md z-10 overflow-hidden animate-in fade-in zoom-in-95">
              <button
                onClick={() => onEdit(file.id, file.name)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => onDelete(file.id)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-destructive hover:text-destructive-foreground text-left text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <h3 className="font-semibold text-sm truncate" title={file.name}>{file.name}</h3>
        <p className="text-xs text-muted-foreground">{file.size} • Uploaded {file.date}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
            <img
              className="aspect-square h-full w-full"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${file.uploader.replace(' ', '')}`}
              alt={file.uploader}
            />
          </span>
          <span>{file.uploader}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(file.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
