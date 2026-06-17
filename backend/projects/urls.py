from django.urls import path
from .views import (
    TeamListCreateView, TeamDetailView,
    ProjectListCreateView, ProjectDetailView,
    TaskListCreateView, TaskDetailView,
    CommentListCreateView, CommentDetailView,
    FileListCreateView, NotificationListCreateView
)

urlpatterns = [
    path('teams/', TeamListCreateView.as_view(), name='team-list-create'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('files/', FileListCreateView.as_view(), name='file-list-create'),
    path('notifications/', NotificationListCreateView.as_view(), name='notification-list-create'),
    
    path('teams/<int:pk>/', TeamDetailView.as_view(), name='team-detail'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]