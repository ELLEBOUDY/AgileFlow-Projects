import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Archive,
  FileCode,
  Trash2,
  Upload,
  Loader2,
} from "lucide-react";

interface FilesTabProps {
  files: any[];
  tasks: any[];
  onDeleteFile: (id: string) => void;
  onUploadFile?: (formData: FormData) => Promise<void>;
}

export default function FilesTab({
  files,
  tasks = [],
  onDeleteFile,
  onUploadFile,
}: FilesTabProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "pdf":
      case "doc":
        return <FileText className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case "img":
      case "png":
      case "jpg":
      case "jpeg":
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedTaskId) {
      alert("Please select a task to link this file to first!");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("task", selectedTaskId);

      if (onUploadFile) {
        await onUploadFile(formData);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4 animate-in fade-in-50">
      {/* 📤 الـ Dropdown وفورم الرفع */}
      {onUploadFile && (
        <div className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1329]/20 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-auto flex-1">
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full sm:max-w-xs px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="" className="dark:bg-[#0f172a]">
                -- Select Task to Link File --
              </option>
              {tasks.map((task) => (
                <option
                  key={task.id}
                  value={task.id}
                  className="dark:bg-[#0f172a]"
                >
                  {/* 🛠️ التصليح هنا: ديجانجو بيبعت task_title أو title */}
                  {task.task_title || task.title}
                </option>
              ))}
            </select>
          </div>

          <label
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              !selectedTaskId
                ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "Uploading..." : "Upload Asset"}
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading || !selectedTaskId}
            />
          </label>
        </div>
      )}

      {/* 📁 عرض كروت الملفات المرفوعة */}
      <div className="grid gap-4 sm:grid-cols-2">
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
                  {getFileIcon(file.file_name?.split(".").pop() || "")}
                </div>

                <div className="min-w-0">
                  <a
                    href={file.file_path || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition truncate block max-w-[150px] sm:max-w-[200px]"
                  >
                    {file.file_name}
                  </a>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 space-y-0.5">
                    {/* 👤 عرض اسم الرافع الحقيقي القادم من الباك إند */}
                    <p className="truncate">
                      By:{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {file.uploaded_by_name ||
                          file.uploaded_by_email ||
                          "System"}
                      </span>
                    </p>
                    {/* 🎯 عرض اسم التاسك المربوط به الملف لو اتوجد */}
                    {file.task_title && (
                      <p className="text-[11px] text-primary truncate">
                        Task: {file.task_title}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium group-hover:hidden block">
                  {file.upload_date
                    ? new Date(file.upload_date).toLocaleDateString()
                    : "Just now"}
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
    </div>
  );
}
