"""URL configuration for the country selection service."""
from django.urls import include, path

urlpatterns = [
    path("api/", include("countries.urls")),
]
