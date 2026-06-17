from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.exceptions import PermissionDenied
from .models import Team, Project, Task, Comment, Notification, File
from .serializers import (TeamSerializer, ProjectSerializer, TaskSerializer, CommentSerializer
                          ,FileSerializer, NotificationSerializer)
from .permissions import IsTeamMemberOrManagerOrAdmin

class IsTeamManagerOrAdmin(permissions.BasePermission):
    """
    صلاحية مخصصة: تسمح بالـ GET للجميع، ولكن التعديل والمسح والإنشاء للأدمن والمدير فقط.
    """
    def has_object_permission(self, request, view, obj):
        # لو الطلب قراءة (GET, HEAD, OPTIONS)، مسموح للموظفين عادي
        if request.method in SAFE_METHODS:
            return True
        # لو تعديل أو مسح، لازم يكون أدمن أو هو مدير التيم نفسه
        return request.user.role == 'admin' or obj.manager == request.user


# ------------------ 1. TEAMS VIEWS ------------------
class TeamListCreateView(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'member':
            raise PermissionDenied("Members are not allowed to create teams.")
        serializer.save()

class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated, IsTeamManagerOrAdmin]


# ------------------ 2. PROJECTS VIEWS ------------------
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'member':
            raise PermissionDenied("Members are not allowed to create projects.")
        serializer.save()

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsTeamMemberOrManagerOrAdmin]


# ------------------ 3. TASKS VIEWS ------------------
class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'member':
            raise PermissionDenied("Members are not allowed to create tasks. Only Managers and Admins can.")
        serializer.save()
        
    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.all()
        
        if user.role != 'admin':
            queryset = Task.objects.filter(project__team__manager=user) | Task.objects.filter(project__team__members=user)
        
        project_id = self.request.query_params.get('project_id')
        if project_id is not None:
            queryset = queryset.filter(project_id=project_id)
            
        return queryset.distinct()

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsTeamMemberOrManagerOrAdmin]

    def perform_update(self, serializer):
        user = self.request.user
        if user.role == 'member' and set(serializer.validated_data.keys()) != {'status'}:
            raise PermissionDenied("You are only allowed to update the status of this task.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if user.role == 'member':
            raise PermissionDenied("Members are not allowed to delete tasks.")
        instance.delete()


# ------------------ 4. COMMENTS VIEWS ------------------
class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        task = serializer.validated_data['task']
        team = task.project.team
        
        is_member = team.members.filter(id=user.id).exists()
        is_manager = team.manager == user
        
        if not (is_member or is_manager or user.role == 'admin'):
            raise PermissionDenied("You cannot comment on this task. You are not a member of this project's team.")
        
        serializer.save(user=user)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsTeamMemberOrManagerOrAdmin]


# ------------------ 5. FILES & NOTIFICATIONS VIEWS ------------------
class FileListCreateView(generics.ListCreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

class NotificationListCreateView(generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]