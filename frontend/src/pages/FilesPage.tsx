import { File, FileText, Image as ImageIcon, Search, Download, Trash2, Upload, MoreVertical } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const MOCK_FILES = [
  { id: 1, name: "Q3_Financial_Report.pdf", type: "pdf", size: "2.4 MB", date: "Oct 12, 2026", uploader: "Sarah J." },
  { id: 2, name: "UI_Design_Assets.zip", type: "zip", size: "145 MB", date: "Oct 10, 2026", uploader: "Mike T." },
  { id: 3, name: "Project_Requirements.docx", type: "doc", size: "1.1 MB", date: "Oct 08, 2026", uploader: "Admin" },
  { id: 4, name: "Architecture_Diagram.png", type: "img", size: "4.2 MB", date: "Oct 05, 2026", uploader: "David W." },
  { id: 5, name: "Sprint_Planning_Notes.txt", type: "txt", size: "12 KB", date: "Oct 01, 2026", uploader: "Admin" },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
    case 'img': return <ImageIcon className="h-8 w-8 text-blue-500" />;
    case 'doc': return <FileText className="h-8 w-8 text-blue-700" />;
    default: return <File className="h-8 w-8 text-slate-500" />;
  }
};

export function FilesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Files & Documents</h2>
          <p className="text-muted-foreground mt-1">Manage and share project assets across your team.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search files by name..." className="pl-8" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_FILES.map((file) => (
          <div key={file.id} className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all p-4 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-muted rounded-lg shrink-0">
                {getFileIcon(file.type)}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-1 mb-4">
              <h3 className="font-semibold text-sm truncate" title={file.name}>{file.name}</h3>
              <p className="text-xs text-muted-foreground">{file.size} • Uploaded {file.date}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
                  <img className="aspect-square h-full w-full" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${file.uploader}`} alt={file.uploader} />
                </span>
                <span>{file.uploader}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
