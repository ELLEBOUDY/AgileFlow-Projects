from rest_framework import permissions
from .models import Team

class IsTeamMemberOrManagerOrAdmin(permissions.BasePermission):
    """
    Custom permission to ensure only team members, their manager, or admins
    can view or interact with project components (Projects, Tasks, Comments).
    """
    def has_object_permission(self, request, view, obj):
        # 1. Admin always has full access
        if request.user.role == 'admin':
            return True

        # 2. Extract the team based on the object type (Project, Task, or Comment)
        team = None
        try:
            if hasattr(obj, 'team'):  # Object is a Project (has direct team field)
                team = obj.team
            elif hasattr(obj, 'project'):  # Object is a Task (go through project to get team)
                team = obj.project.team
            elif hasattr(obj, 'task'):  # Object is a Comment (go through task then project to get team)
                team = obj.task.project.team
        except AttributeError:
            return False

        # If team cannot be resolved for any reason, deny access
        if not team:
            return False

        # 3. Check if the user is the Manager of this team
        if team.manager == request.user:
            return True

        # 4. Check if the user is a Member in this team
        return team.members.filter(id=request.user.id).exists()