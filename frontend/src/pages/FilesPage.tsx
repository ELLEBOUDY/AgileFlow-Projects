import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { 
  FileHeader, 
  FileSearch, 
  FileGrid, 
  DeleteConfirmDialog, 
  EditFileNameDialog,
  type FileItem 
} from "./filesPageComponents";

export function FilesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Modal states
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: files = [], isLoading } = useQuery<FileItem[]>({
    queryKey: ['files'],
    queryFn: async () => {
      const response = await api.get('/files');
      return response.data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (newFile: Omit<FileItem, 'id'>) => {
      const response = await api.post('/files', newFile);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setIsDeleteDialogOpen(false);
      setSelectedFile(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      const response = await api.patch(`/files/${id}`, { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setIsEditDialogOpen(false);
      setSelectedFile(null);
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let type = 'unknown';
    if (['pdf'].includes(ext)) type = 'pdf';
    else if (['zip', 'rar'].includes(ext)) type = 'zip';
    else if (['doc', 'docx'].includes(ext)) type = 'doc';
    else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) type = 'img';
    else if (['txt'].includes(ext)) type = 'txt';

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = Number(sizeInMB) > 1 ? `${sizeInMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;

    const newFile = {
      name: file.name,
      type,
      size: sizeStr,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      uploader: "Current User"
    };

    uploadMutation.mutate(newFile);
  };

  const handleEdit = (id: string) => {
    setOpenDropdownId(null);
    const file = files.find(f => f.id === id);
    if (file) {
      setSelectedFile(file);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setOpenDropdownId(null);
    const file = files.find(f => f.id === id);
    if (file) {
      setSelectedFile(file);
      setIsDeleteDialogOpen(true);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => setOpenDropdownId(null)}>
      <FileHeader
        onUpload={handleFileUpload}
        isUploading={uploadMutation.isPending}
      />

      <FileSearch
        value={search}
        onChange={setSearch}
      />

      <FileGrid
        files={filteredFiles}
        isLoading={isLoading}
        openDropdownId={openDropdownId}
        setOpenDropdownId={setOpenDropdownId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Popups */}
      {selectedFile && (
        <>
          <DeleteConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={() => deleteMutation.mutate(selectedFile.id)}
            fileName={selectedFile.name}
          />
          <EditFileNameDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onConfirm={(newName) => updateMutation.mutate({ id: selectedFile.id, name: newName })}
            currentName={selectedFile.name}
          />
        </>
      )}
    </div>
  );
}
