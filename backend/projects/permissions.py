from rest_framework import permissions
from .models import Team

class IsTeamMemberOrManagerOrAdmin(permissions.BasePermission):
    """
    Custom permission to ensure only team members, their manager, or admins
    can view or interact with project components (Tasks, Comments).
    """
    def has_object_permission(self, request, view, obj):
        # 1. Admin always has full access
        if request.user.role == 'admin':
            return True

        # 2. Extract the team based on the object type
        # If we are checking a Task, obj.project.team gives us the team
        # If we are checking a Comment, obj.task.project.team gives us the team
        try:
            if hasattr(obj, 'project'): # For Project or Task
                team = obj.team if hasattr(obj, 'team') else obj.project.team
            elif hasattr(obj, 'task'): # For Comment or File
                team = obj.task.project.team
            else:
                return False
        except AttributeError:
            return False

        # 3. Check if the user is the Manager of this team
        if team.manager == request.user:
            return True

        # 4. Check if the user is a Member in this team
        return team.members.filter(id=request.user.id).exists()