"""ASGI config for the country selection service."""
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "country_service.settings")

application = get_asgi_application()
