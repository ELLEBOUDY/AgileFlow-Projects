import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "../../components/ui/button";

interface FileHeaderProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function FileHeader({ onUpload, isUploading }: FileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Files & Documents</h2>
        <p className="text-muted-foreground mt-1">Manage and share project assets across your team.</p>
      </div>
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            onUpload(e);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          className="hidden"
        />
        <Button
          className="flex items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </div>
    </div>
  );
}
