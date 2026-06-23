from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.exceptions import PermissionDenied
from .models import Team, Project, Task, Comment, Notification, File
from .serializers import (TeamSerializer, ProjectSerializer, TaskSerializer, CommentSerializer
                          ,FileSerializer, NotificationSerializer)
from .permissions import IsTeamMemberOrManagerOrAdmin
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination

# وظيفة مساعدة لإرسال الإشعارات
def send_task_notification(user, task_title):
    Notification.objects.create(
        user=user, 
        message=f"You have been assigned to a new task: '{task_title}'"
    )

class IsTeamManagerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
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

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only Admins are allowed to delete teams.")
        instance.delete()

# ------------------ 2. PROJECTS VIEWS ------------------
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only Admins are allowed to create projects.")
        serializer.save()

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsTeamMemberOrManagerOrAdmin]

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only Admins are allowed to delete projects.")
        instance.delete()

# ------------------ 3. TASKS VIEWS ------------------
class TasksDashboardPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all().order_by('-id')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TasksDashboardPagination

    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only Admins are allowed to create tasks.")
        
        task = serializer.save()
        # إرسال إشعار عند الإنشاء إذا كان هناك assignee
        if task.assigned_to:
            send_task_notification(task.assigned_to, task.task_title)
        
    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.all().order_by('-id')
        if user.role != 'admin':
            queryset = Task.objects.filter(project__team__manager=user) | Task.objects.filter(project__team__members=user)
        project_id = self.request.query_params.get('project') 
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset.distinct().order_by('-id')

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsTeamMemberOrManagerOrAdmin]

    def perform_update(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only Admins are allowed to update tasks.")
        
        old_task = self.get_object()
        old_assignee = old_task.assigned_to
        
        new_task = serializer.save()
        
        # إرسال إشعار فقط عند تغيير الـ Assignee
        if new_task.assigned_to and new_task.assigned_to != old_assignee:
            send_task_notification(new_task.assigned_to, new_task.task_title)

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only Admins are allowed to delete tasks.")
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
        if not (team.members.filter(id=user.id).exists() or team.manager == user or user.role == 'admin'):
            raise PermissionDenied("You cannot comment on this task.")
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
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = File.objects.all()
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(task__project_id=project_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class NotificationListCreateView(generics.ListCreateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-timestamp')

class NotificationUpdateView(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)