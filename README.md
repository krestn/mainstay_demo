# Country Search + Selection Service

This project is a single-page React app (UMD + Babel) backed by a small Django service
that persists selected countries. The frontend fetches search results from REST Countries
and uses the backend to remember the user's pinned list across refreshes.

## Backend design (Django)

### Data model
The backend persists only the data the UI needs to render selected items.

`SelectedCountry`
- `code` (string, primary key): ISO `cca3` code from REST Countries; makes duplicates impossible.
- `name` (string): Display name shown in the UI.
- `flag_url` (string): Flag image URL.
- `created_at` (datetime): Audit trail for when the pin happened.

### Endpoints
All routes are served under `/api/`.

- `GET /api/selected-countries/`
  - Returns all selected countries as a JSON array.
  - Response shape:
    ```json
    [{"code":"USA","name":"United States","flagUrl":"https://..."}]
    ```

- `POST /api/selected-countries/`
  - Adds (or updates) a selected country.
  - Request body:
    ```json
    {"code":"USA","name":"United States","flagUrl":"https://..."}
    ```
  - Returns the stored country payload.

- `DELETE /api/selected-countries/<code>/`
  - Removes a selected country by its ISO code.
  - Returns `204 No Content` on success.

### Persistence strategy
SQLite is configured in `backend/country_service/settings.py`. The database file is
`backend/db.sqlite3`, which is not cleared across restarts, so pinned countries persist
between app sessions and server restarts.

### CORS and CSRF
The backend enables `django-cors-headers` with `CORS_ALLOW_ALL_ORIGINS = True` to keep
local development friction-free. API views are marked `@csrf_exempt` because the frontend
is a static page and does not send Django's CSRF cookie. In production, you would tighten
CORS and add CSRF protection or token-based auth.

### Running the backend
From the repo root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The server will run at `http://localhost:8000` by default.

# Frontend

This folder contains the React + Vite frontend for the Country Search + Selection app.

## Structure
- `src/App.tsx`: Page layout and state orchestration.
- `src/components/`: UI components for search, results, and selected lists.
- `src/api.ts`: REST Countries + backend API helpers.
- `src/types.ts`: Shared TypeScript types.
- `public/`: Static assets served by Vite (e.g., `flag.png`).

## Frontend integration
The frontend uses `API_BASE_URL = "http://localhost:8000/api"` in `frontend/src/api.ts`.

- On page load, it fetches `GET /selected-countries/` and hydrates the pinned list.
- When a user clicks `+`, it sends `POST /selected-countries/` and updates the list on success.
- When a user clicks `x`, it sends `DELETE /selected-countries/<code>/` and removes the item.

The search results come directly from `https://restcountries.com/v3.1/name/{name}` and
are limited to five results for clarity and speed.

## Running the frontend
The frontend is a standard React app powered by Vite.

From the repo root:

```bash
cd frontend
npm install
npm run dev
```

Then visit `http://localhost:3000` in your browser.

### Environment overrides
If the backend runs on a different host, set `VITE_API_BASE_URL` before starting Vite:

```bash
VITE_API_BASE_URL="http://localhost:8000/api" npm run dev
```
