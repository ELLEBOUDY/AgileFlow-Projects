import {
  File,
  FileText,
  Image as ImageIcon,
  Search,
  Download,
  Trash2,
  Upload,
  MoreVertical,
  Edit3,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const MOCK_FILES = [
  {
    id: 1,
    name: "Q3_Financial_Report.pdf",
    type: "pdf",
    size: "2.4 MB",
    date: "Oct 12, 2026",
    uploader: "Sarah J.",
  },
  {
    id: 2,
    name: "UI_Design_Assets.zip",
    type: "zip",
    size: "145 MB",
    date: "Oct 10, 2026",
    uploader: "Mike T.",
  },
  {
    id: 3,
    name: "Project_Requirements.docx",
    type: "doc",
    size: "1.1 MB",
    date: "Oct 08, 2026",
    uploader: "Admin",
  },
  {
    id: 4,
    name: "Architecture_Diagram.png",
    type: "img",
    size: "4.2 MB",
    date: "Oct 05, 2026",
    uploader: "David W.",
  },
  {
    id: 5,
    name: "Sprint_Planning_Notes.txt",
    type: "txt",
    size: "12 KB",
    date: "Oct 01, 2026",
    uploader: "Admin",
  },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-8 w-8 text-red-500" />;
    case "img":
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    case "doc":
      return <FileText className="h-8 w-8 text-blue-700" />;
    default:
      return <File className="h-8 w-8 text-slate-500" />;
  }
};

export function FilesPage() {
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const filteredFiles = useMemo(() => {
    return MOCK_FILES.filter((file) =>
      file.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Files & Documents
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage and share project assets across your team.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files by name..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all p-4 group relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-muted rounded-lg shrink-0">
                {getFileIcon(file.type)}
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${openMenuId === file.id ? "bg-muted" : "opacity-0 group-hover:opacity-100"} transition-all`}
                  onClick={() =>
                    setOpenMenuId(openMenuId === file.id ? null : file.id)
                  }
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>

                {openMenuId === file.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 mt-1 w-36 bg-popover border rounded-md shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors font-medium text-left"
                        onClick={() => setOpenMenuId(null)}
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Name
                      </button>
                      <div className="h-px bg-border my-1" />
                      <button
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-destructive/10 text-destructive transition-colors font-medium text-left"
                        onClick={() => setOpenMenuId(null)}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete File
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="font-semibold text-sm truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {file.size} • Uploaded {file.date}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
                  <img
                    className="aspect-square h-full w-full"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${file.uploader}`}
                    alt={file.uploader}
                  />
                </span>
                <span>{file.uploader}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No files found matching "{search}"
          </p>
        </div>
      )}
    </div>
  );
}
