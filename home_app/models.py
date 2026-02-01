from django.db import models

class Information(models.Model):
    experience = models.IntegerField(default=0)
    customers = models.IntegerField(default=0)
    projects = models.IntegerField(default=1)
    admin = models.IntegerField(default=80)

    # class Meta:
    #     fields = "__all__"

    # def __str__(self):
    #     return self.experience

class Contact(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    subject = models.CharField(max_length=50)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"
