from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.exceptions import PermissionDenied
from .models import Team, Project, Task, Comment, Notification, File
from .serializers import (TeamSerializer, ProjectSerializer, TaskSerializer, CommentSerializer
                          ,FileSerializer, NotificationSerializer)
from .permissions import IsTeamMemberOrManagerOrAdmin
from rest_framework.parsers import MultiPartParser, FormParser

class IsTeamManagerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # anyone can perform(GET)
        if request.method in SAFE_METHODS:
            return True
        
        #only admin and manager of the team can update    
        return request.user.role == 'admin' or obj.manager == request.user


# ------------------ 1. TEAMS VIEWS ------------------
class TeamListCreateView(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    # only admin and manager can create team
    def perform_create(self, serializer):
        if self.request.user.role == 'member':
            raise PermissionDenied("Members are not allowed to create teams. Only Managers and Admins can.")
        serializer.save()

class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated, IsTeamManagerOrAdmin]

    # only admin can delete team
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
        
        if 'team' not in self.request.data:
            first_team = Team.objects.first()
            if first_team:
                serializer.save(team=first_team)
                return
        serializer.save()

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsTeamMemberOrManagerOrAdmin]

    #  only admin can delete a project
    def perform_destroy(self, instance):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only Admins are allowed to delete projects.")
        instance.delete()


# ------------------ 3. TASKS VIEWS ------------------
class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    # only admin can add task
    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only Admins are allowed to create tasks.")
        serializer.save()
        
    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.all()
        
        if user.role != 'admin':
            queryset = Task.objects.filter(project__team__manager=user) | Task.objects.filter(project__team__members=user)
        
        project_id = self.request.query_params.get('project') 
        if project_id is not None:
            queryset = queryset.filter(project_id=project_id)
            
        return queryset.distinct()

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsTeamMemberOrManagerOrAdmin]

    def perform_update(self, serializer):
        user = self.request.user
        if user.role != 'admin':
            raise PermissionDenied("Only Admins are allowed to update tasks.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if user.role != 'admin':
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
    parser_classes = [MultiPartParser, FormParser] # 👈 ضروري عشان الـ FormData من الفرونتد

    def get_queryset(self):
        queryset = File.objects.all()
        project_id = self.request.query_params.get('project')
        
        if project_id is not None:
            queryset = queryset.filter(task__project_id=project_id)
            
        return queryset

    def perform_create(self, serializer):
        # دجانجو هيسيف الملف ويربطه باليوزر اللي رافع
        serializer.save(uploaded_by=self.request.user)

    

class NotificationListCreateView(generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
