from django.db import models
from django.conf import settings

class Team(models.Model):
    """
    Model representing a distinct organization team led by a manager
    and containing multiple user members.
    """
    team_name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    
    # One manager leads this team (1:M)
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name='led_teams'
    )
    
    # A team contains multiple members (M:N)
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='joined_teams'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.team_name


class Project(models.Model):
    """
    Model representing a project that is assigned to a specific Team.
    """
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    project_name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    # ➕ الحقول الجديدة اللي ناقصة الداتابيز:
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    progress = models.IntegerField(default=0) # بيبدأ من 0% لحد 100%

    # Project is assigned to one Team (1:M)
    team = models.ForeignKey(
        Team,
        on_delete=models.RESTRICT,
        related_name='team_projects'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.project_name


class Task(models.Model):
    """
    Model representing sub-tasks assigned inside a project to a specific team member.
    """
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('review', 'Review'),
        ('done', 'Done'),
    ]

    task_title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=15, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='todo')
    deadline = models.DateField(blank=True, null=True)
    
    # Task belongs to a Project (1:M)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_tasks')
    
    # Task is assigned to a specific User (1:M)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        blank=True, 
        null=True, 
        related_name='assigned_tasks'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.task_title


class Comment(models.Model):
    """
    Model handling discussions and updates written by users under specific tasks.
    """
    content = models.TextField()
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_comments')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.task.task_title}"


class File(models.Model):
    """
    Model managing documents uploaded under a specific task.
    """
    file_name = models.CharField(max_length=255)
    file_path = models.FileField(upload_to='project_files/') # Django handles file paths beautifully via FileField
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_files')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_files')
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name


class Notification(models.Model):
    """
    Model tracking notifications dispatched to specific users.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}"