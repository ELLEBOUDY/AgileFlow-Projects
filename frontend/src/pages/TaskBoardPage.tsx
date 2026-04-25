import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MoreHorizontal, MessageSquare, Paperclip, X, Trash2, Copy, Edit3, CheckSquare, Square } from "lucide-react";
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCorners } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-l-4 border-l-slate-400' },
  { id: 'in_progress', title: 'In Progress', color: 'border-l-4 border-l-blue-500' },
  { id: 'review', title: 'In Review', color: 'border-l-4 border-l-orange-500' },
  { id: 'done', title: 'Done', color: 'border-l-4 border-l-green-500' }
];

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg p-6 border animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full"><X className="h-4 w-4" /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TaskCard({ task, color, onDelete, onEdit, onToggleDone, isOpen, onToggle }: { task: any, color: string, onDelete?: (id: string) => void, onEdit?: (task: any) => void, onToggleDone?: (id: string) => void, isOpen?: boolean, onToggle?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id.toString(),
    data: { task },
    disabled: isOpen, // Disable dragging when menu is open
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-card p-4 rounded-lg shadow-sm border ${color} hover:shadow-md transition-all group z-10 relative`}
    >
      <div className="flex justify-between items-start mb-2">
        <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing flex-1 flex items-center gap-2">
          {onToggleDone && (
            <div 
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDone(task.id);
              }}
            >
              {task.status === 'done' ? (
                <CheckSquare className="w-4 h-4 text-primary fill-primary/10" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </div>
          )}
          <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-muted/50 border-none">
            T-{task.id}
          </Badge>
        </div>
        {onToggle && (
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-5 w-5 ${isOpen ? 'opacity-100 bg-muted' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            
            {isOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); onToggle(); }} />
                <div className="absolute right-0 mt-1 w-36 bg-popover border rounded-md shadow-lg z-30 py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button 
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors text-left font-medium"
                    onClick={(e) => { e.stopPropagation(); onEdit?.(task); onToggle(); }}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Task
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button 
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-destructive/10 text-destructive transition-colors text-left font-medium"
                    onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); onToggle(); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Task
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
        <p className={`text-sm font-medium leading-snug mb-4 transition-all ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </p>
        
        <div className="flex justify-between items-center text-muted-foreground">
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{task.id * 2 || 0}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Paperclip className="w-3.5 h-3.5" />
              <span>1</span>
            </div>
          </div>
          
          <img className="h-6 w-6 rounded-full bg-accent pointer-events-none" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeId || task.id}`} alt="Assignee" />
        </div>
      </div>
    </div>
  );
}

function Column({ column, tasks, onInlineAdd, onDelete, onEdit, onToggleDone, openMenuId, setOpenMenuId }: { column: any, tasks: any[], onInlineAdd: (status: string, title: string) => void, onDelete: (id: string) => void, onEdit: (task: any) => void, onToggleDone: (id: string) => void, openMenuId: string | null, setOpenMenuId: (id: string | null) => void }) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSave = () => {
    if (newTaskTitle.trim()) {
      onInlineAdd(column.id, newTaskTitle);
      setNewTaskTitle("");
      setIsAdding(false);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col bg-muted/30 rounded-xl p-4 h-full overflow-hidden transition-colors ${isOver ? 'bg-muted/60 ring-2 ring-primary/20' : ''}`}
    >
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm uppercase tracking-wider">{column.title}</h3>
          <Badge variant="secondary" className="text-xs h-5 px-1.5">{tasks.length}</Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {isAdding && (
          <div className="bg-card p-3 rounded-lg shadow-sm border border-primary mb-3 animate-in fade-in zoom-in-95 duration-200">
            <input 
              autoFocus
              className="w-full bg-transparent outline-none text-sm font-medium mb-2 placeholder:text-muted-foreground" 
              placeholder="What needs to be done?" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setIsAdding(false);
              }}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleSave}>Save</Button>
            </div>
          </div>
        )}
        
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            color={column.color} 
            onDelete={onDelete} 
            onEdit={onEdit} 
            onToggleDone={onToggleDone}
            isOpen={openMenuId === task.id.toString()}
            onToggle={() => setOpenMenuId(openMenuId === task.id.toString() ? null : task.id.toString())}
          />
        ))}
        {tasks.length === 0 && !isAdding && (
          <div className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-50">
            <p className="text-sm text-muted-foreground">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskBoardPage() {
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", status: "todo", assigneeId: "1" });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks');
      return data;
    }
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, newStatus }: { taskId: string, newStatus: string }) => {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
    },
    onMutate: async ({ taskId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (old: any) => 
        old.map((task: any) => task.id.toString() === taskId ? { ...task, status: newStatus } : task)
      );
      
      return { previousTasks };
    },
    onError: (err, newTodo, context: any) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const createTask = useMutation({
    mutationFn: async (newTask: any) => {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask.id}`, newTask);
        return data;
      } else {
        const { data } = await api.post('/tasks', newTask);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
      setEditingTask(null);
      setFormData({ title: "", description: "", status: "todo", assigneeId: "1" });
    }
  });

  const handleInlineAdd = (status: string, title: string) => {
    createTask.mutate({
      title,
      status,
      description: "Added quickly from the board.",
      assigneeId: Math.floor(Math.random() * 5) + 1, // Random assignee for demo
      projectId: "1"
    });
  };

  const handleGlobalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask.mutate({
      ...formData,
      projectId: "1"
    });
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      assigneeId: task.assigneeId.toString()
    });
    setIsModalOpen(true);
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = tasks.find((t: any) => t.id.toString() === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    
    if (!over) return;

    const taskId = active.id.toString();
    const newStatus = over.id.toString();
    
    const task = tasks.find((t: any) => t.id.toString() === taskId);
    
    if (task && task.status !== newStatus) {
      updateTaskStatus.mutate({ taskId, newStatus });
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Board</h2>
          <p className="text-muted-foreground mt-1">AgileFlow UI Revamp sprint.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex -space-x-2 mr-4">
            {[1, 2, 3].map((i) => (
              <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-accent z-0" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="" />
            ))}
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-medium text-muted-foreground z-0">+2</div>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">Loading board...</div>
        ) : (
          <DndContext 
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
              {COLUMNS.map((column) => {
                const columnTasks = tasks.filter((t: any) => t.status === column.id);
                return (
                  <Column 
                    key={column.id} 
                    column={column} 
                    tasks={columnTasks} 
                    onInlineAdd={handleInlineAdd} 
                    onDelete={(id) => deleteTaskMutation.mutate(id)}
                    onEdit={handleEditTask}
                    onToggleDone={(id) => {
                      const task = tasks.find((t: any) => t.id.toString() === id.toString());
                      if (task) {
                        const newStatus = task.status === 'done' ? 'todo' : 'done';
                        updateTaskStatus.mutate({ taskId: id.toString(), newStatus });
                      }
                    }}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                  />
                );
              })}
            </div>

            <DragOverlay>
              {activeTask ? (
                <TaskCard 
                  task={activeTask} 
                  color={COLUMNS.find(c => c.id === activeTask.status)?.color || ''} 
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }} 
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <form onSubmit={handleGlobalSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Task Title</label>
            <input 
              required
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g., Update user profile schema"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Description</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Provide a detailed description..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Status</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                {COLUMNS.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Assign To</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.assigneeId}
                onChange={(e) => setFormData({...formData, assigneeId: e.target.value})}
              >
                <option value="1">Sarah Jenkins</option>
                <option value="2">Mike Thompson</option>
                <option value="3">David Wright</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t mt-6">
            <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setEditingTask(null); }}>Cancel</Button>
            <Button type="submit">{editingTask ? "Save Changes" : "Create Task"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
