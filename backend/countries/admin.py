from django.contrib import admin

from .models import SelectedCountry


@admin.register(SelectedCountry)
class SelectedCountryAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "flag_url", "created_at")
