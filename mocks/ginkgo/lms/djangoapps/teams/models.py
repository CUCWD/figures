
from django.db import models
from django.contrib.auth.models import User

class CourseTeam(models.Model):

    class Meta:
        app_label = 'teams'

    name = models.CharField(max_length=255, db_index=True)
    users = models.ManyToManyField(User,
        db_index=True, related_name='teams', through='CourseTeamMembership')

class CourseTeamMembership(models.Model):

    class Meta:
        app_label = "teams"
        unique_together = (('user', 'team'),)

    user = models.ForeignKey(User)
    team = models.ForeignKey(CourseTeam, related_name='membership')
