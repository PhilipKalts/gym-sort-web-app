from django.db import models

class Trainee(models.Model):
    name = models.CharField(max_length=50)
    score = models.IntegerField(default=1)
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name