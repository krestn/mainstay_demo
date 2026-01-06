from django.urls import path

from . import views

urlpatterns = [
    path("selected-countries/", views.selected_countries, name="selected-countries"),
    path(
        "selected-countries/<str:code>/",
        views.selected_country_detail,
        name="selected-country-detail",
    ),
]
