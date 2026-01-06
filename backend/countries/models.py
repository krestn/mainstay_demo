from django.db import models


class SelectedCountry(models.Model):
    """
    Stores the countries a user has pinned so they persist across refreshes.
    """

    code = models.CharField(max_length=3, primary_key=True)
    name = models.CharField(max_length=128)
    flag_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.code})"
