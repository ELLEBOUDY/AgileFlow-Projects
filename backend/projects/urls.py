from django.urls import path
from .views import (
    TeamListCreateView, TeamDetailView,
    ProjectListCreateView, ProjectDetailView,
    TaskListCreateView, TaskDetailView,
    CommentListCreateView, CommentDetailView,
    FileListCreateView, NotificationListCreateView
)

urlpatterns = [
    # 1. الروابط الرئيسية للمشاريع (Projects)
    path('', ProjectListCreateView.as_view(), name='project-list-create'),
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),

    # 2. روابط الفرق (Teams)
    path('teams/', TeamListCreateView.as_view(), name='team-list-create'),
    path('teams/<int:pk>/', TeamDetailView.as_view(), name='team-detail'),

    # 3. روابط المهام (Tasks)
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),

    # 4. روابط التعليقات (Comments)
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),

    # 5. روابط الملفات والإشعارات (Files & Notifications)
    path('files/', FileListCreateView.as_view(), name='file-list-create'),
    path('notifications/', NotificationListCreateView.as_view(), name='notification-list-create'),
]