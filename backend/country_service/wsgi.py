"""WSGI config for the country selection service."""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "country_service.settings")

application = get_wsgi_application()
