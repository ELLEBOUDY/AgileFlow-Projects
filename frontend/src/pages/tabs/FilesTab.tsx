import {
  FileText,
  Image as ImageIcon,
  Archive,
  FileCode,
  Trash2,
} from "lucide-react";

interface FilesTabProps {
  files: any[];
  onDeleteFile: (id: string) => void;
}

export default function FilesTab({ files, onDeleteFile }: FilesTabProps) {
  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "pdf":
      case "doc":
        return <FileText className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case "img":
      case "png":
      case "jpg":
        return (
          <ImageIcon className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
        );
      case "zip":
      case "rar":
        return (
          <Archive className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        );
      default:
        return (
          <FileCode className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        );
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 mt-4 animate-in fade-in-50">
      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 col-span-full border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          No assets linked to this project node.
        </p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1329]/40 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#0b1329]/80 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm dark:shadow-none group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shrink-0">
                {getFileIcon(file.type || file.name?.split(".").pop())}{" "}
              </div>

              <div className="min-w-0">
                <a
                  href={file.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition truncate block max-w-[150px] sm:max-w-[200px]"
                >
                  {file.name}
                </a>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {file.size || "Unknown size"} • Up:{" "}
                  {file.uploader || "System"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium group-hover:hidden block">
                {file.date || file.uploadedAt}
              </span>

              <button
                onClick={() => onDeleteFile(file.id)}
                className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group-hover:block hidden"
                title="Delete File"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
