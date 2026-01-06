import json
from typing import Any, Dict

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import SelectedCountry


def _parse_json(request: HttpRequest) -> Dict[str, Any]:
    try:
        return json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}


@csrf_exempt
def selected_countries(request: HttpRequest) -> HttpResponse:
    """
    GET returns all selected countries.
    POST upserts a selected country.
    """
    if request.method == "GET":
        data = [
            {"code": item.code, "name": item.name, "flagUrl": item.flag_url}
            for item in SelectedCountry.objects.all()
        ]
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        payload = _parse_json(request)
        code = payload.get("code")
        name = payload.get("name")
        flag_url = payload.get("flagUrl")

        if not code or not name or not flag_url:
            return JsonResponse({"error": "code, name, and flagUrl are required."}, status=400)

        country, _created = SelectedCountry.objects.update_or_create(
            code=code, defaults={"name": name, "flag_url": flag_url}
        )
        return JsonResponse(
            {"code": country.code, "name": country.name, "flagUrl": country.flag_url},
            status=201,
        )

    return JsonResponse({"error": "Method not allowed."}, status=405)


@csrf_exempt
def selected_country_detail(request: HttpRequest, code: str) -> HttpResponse:
    """
    DELETE removes a selected country by its code.
    """
    if request.method != "DELETE":
        return JsonResponse({"error": "Method not allowed."}, status=405)

    SelectedCountry.objects.filter(code=code).delete()
    return HttpResponse(status=204)
