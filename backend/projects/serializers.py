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
    title = serializers.CharField(source='project_name')
    team_name = serializers.CharField(source='team.team_name', read_only=True)
    team_members = serializers.PrimaryKeyRelatedField(source='team.members', many=True, read_only=True)
    
    manager_name = serializers.CharField(source='team.manager.username', read_only=True)
    manager_email = serializers.CharField(source='team.manager.email', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date', 
            'status', 'progress', 'team', 'team_name', 'team_members', 
            'manager_name', 'manager_email', 'created_at' #
        ]

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=False)
        if not valid:
            print("❌ ENGINE VALIDATION ERRORS:", self.errors) 
        if raise_exception and not valid:
            raise serializers.ValidationError(self.errors)
        return valid

    def create(self, validated_data):
        if 'team' not in validated_data or validated_data['team'] is None:
            from .models import Team
            validated_data['team'] = Team.objects.first()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'team' not in validated_data or validated_data['team'] is None:
            validated_data['team'] = instance.team
        return super().update(instance, validated_data)


# 1. تحديث الـ TaskSerializer عشان نضمن شكل بيانات مريح للـ Dropdown والعرض
class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.project_name', read_only=True)
    assigned_to_email = serializers.CharField(source='assigned_to.email', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True) # زادت للعرض
    
    # حقل وهمي عشان لو الـ Frontend بيدور على title بدل task_title في الـ Dropdown
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


# 2. تحديث الـ FileSerializer عشان يرجع اسم وإيميل الشخص اللي رفع الملف
class FileSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.CharField(source='uploaded_by.email', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True) # ✨ الحل هنا لاسم الرافع!
    task_title = serializers.CharField(source='task.task_title', read_only=True) # عشان يظهر اسم التاسك جنب الملف لو حبيت

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