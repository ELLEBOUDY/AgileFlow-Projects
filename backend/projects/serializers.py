from rest_framework import serializers
from .models import Team, Project, Task, Comment, File, Notification
from django.contrib.auth import get_user_model

User = get_user_model()

class TeamSerializer(serializers.ModelSerializer):
    """
    Serializer to handle Team CRUD operations.
    """
    manager_email = serializers.CharField(source='manager.email', read_only=True)
    members_emails = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='email'
    )
    members = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.filter(role='member'),
        required=False
    )

    class Meta:
        model = Team
        fields = ['id', 'team_name', 'description', 'manager', 'members', 'manager_email', 'members_emails', 'created_at']


class ProjectSerializer(serializers.ModelSerializer): 
    """
    Serializer to handle Project CRUD operations tied to a specific Team.
    """
    team_name = serializers.CharField(source='team.team_name', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'project_name', 'description', 'start_date', 'end_date', 'team', 'team_name', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer to handle Task CRUD operations, with assignee and project details.
    """
    project_name = serializers.CharField(source='project.project_name', read_only=True)
    assigned_to_email = serializers.CharField(source='assigned_to.email', read_only=True)
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='member'),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = [
            'id', 'task_title', 'description', 'priority', 
            'status', 'deadline', 'project', 'project_name', 
            'assigned_to', 'assigned_to_email', 'created_at'
        ]


class CommentSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'content', 'task', 'user', 'user_email', 'created_at']


class FileSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.CharField(source='uploaded_by.email', read_only=True)
    class Meta:
        model = File
        fields = ['id', 'file_name', 'file_path', 'task', 'uploaded_by', 'uploaded_by_email', 'upload_date']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'timestamp']