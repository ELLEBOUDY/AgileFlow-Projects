import { type FileItem } from "./types";
import { FileCard } from "./FileCard";

interface FileGridProps {
  files: FileItem[];
  isLoading: boolean;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function FileGrid({ files, isLoading, openDropdownId, setOpenDropdownId, onEdit, onDelete }: FileGridProps) {
  if (isLoading) {
    return <div className="text-center py-10 text-muted-foreground">Loading files...</div>;
  }

  if (files.length === 0) {
    return <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">No files found.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {files.map((file) => (
        <FileCard 
          key={file.id} 
          file={file} 
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
