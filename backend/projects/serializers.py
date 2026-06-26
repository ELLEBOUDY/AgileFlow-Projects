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
        fields = [
            'id', 'team_name', 'description', 'manager', 'members',
            'manager_email', 'members_emails', 'created_at'
        ]


class ProjectSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='project_name')
    team_name = serializers.SerializerMethodField()
    team_members = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()
    manager_email = serializers.SerializerMethodField()

    # ✅ Allow null so projects can exist without a team (and can be unassigned)
    team = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date',
            'status', 'progress', 'team', 'team_name', 'team_members',
            'manager_name', 'manager_email', 'created_at'
        ]

    def get_team_name(self, obj):
        if obj.team:
            return obj.team.team_name
        return None

    def get_team_members(self, obj):
        if obj.team:
            return list(obj.team.members.values_list('id', flat=True))
        return []

    def get_manager_name(self, obj):
        if obj.team:
            return obj.team.manager.username
        return None

    def get_manager_email(self, obj):
        if obj.team:
            return obj.team.manager.email
        return None

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=False)
        if not valid:
            print("❌ ENGINE VALIDATION ERRORS:", self.errors)
        if raise_exception and not valid:
            raise serializers.ValidationError(self.errors)
        return valid

    def create(self, validated_data):
        # ✅ team can be null — no fallback needed
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # ✅ Allows explicitly setting team to null (unassigning a project)
        return super().update(instance, validated_data)


class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.project_name', read_only=True)
    assigned_to_email = serializers.CharField(source='assigned_to.email', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    title = serializers.CharField(source='task_title', read_only=True)

    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='member'),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = [
            'id', 'task_title', 'title', 'description', 'priority',
            'status', 'deadline', 'project', 'project_name',
            'assigned_to', 'assigned_to_email', 'assigned_to_username', 'created_at'
        ]


class FileSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.CharField(source='uploaded_by.email', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    task_title = serializers.CharField(source='task.task_title', read_only=True)

    class Meta:
        model = File
        fields = [
            'id', 'file_name', 'file_path', 'task', 'task_title',
            'uploaded_by', 'uploaded_by_name', 'uploaded_by_email', 'upload_date'
        ]


class CommentSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'task', 'user', 'user_email', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'timestamp']