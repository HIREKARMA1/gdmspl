# Office Locations API — backend prompt for `gdmspl-be`

Copy this into your Cursor chat inside the **gdmspl-be** repo.

---

## Goal

Add an **Office Locations** resource so the GDMSPL website admin can CRUD office locations shown on:

- About section (“Our Presence” chips)
- Contact section (map pins, chips, address / phone / email / website)

Match existing patterns used for `team-members` / `project-categories` (auth, pagination, `display_order`, soft publish flag).

---

## Data model: `office_locations`

| Column | Type | Notes |
|--------|------|--------|
| `id` | UUID PK | |
| `name` | string | Short label, e.g. `Delhi` (unique) |
| `slug` | string | Unique, e.g. `delhi` |
| `office` | text | Full address |
| `phone` | string | |
| `email` | string | |
| `website` | string | default `www.gdmspl.com` |
| `map_url` | string nullable | Google Maps / short link |
| `lat` | float nullable | Map pin latitude |
| `lng` | float nullable | Map pin longitude |
| `map_offset_x` | int | default `0` — label offset on dotted map |
| `map_offset_y` | int | default `0` |
| `map_label_width` | int | default `14` |
| `display_order` | int | default `0` — ascending sort |
| `is_published` | bool | default `true` |
| `created_at` / `updated_at` | timestamps | |

Seed the current 4 offices (Delhi, Mumbai, Nepal, Muscat) with the addresses already used on the site.

---

## Public endpoints (no auth)

Base path prefix: `/api/v1`

### `GET /office-locations`

Query: `page`, `page_size` (default page_size 50)

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Delhi",
      "slug": "delhi",
      "office": "A-58/8, top floor, ...",
      "phone": "+91 11 41025657",
      "email": "mail@gdmspl.com",
      "website": "www.gdmspl.com",
      "map_url": "https://maps.app.goo.gl/...",
      "lat": 28.6139,
      "lng": 77.209,
      "map_offset_x": -20,
      "map_offset_y": -8,
      "map_label_width": 14,
      "display_order": 1,
      "is_published": true
    }
  ],
  "total": 4
}
```

Rules:

- Return **only** `is_published=true`
- Sort by `display_order` ASC, then `name`

### `GET /office-locations/{id_or_slug}`

Public detail by UUID or slug. 404 if unpublished / missing.

---

## Admin endpoints (Bearer JWT, same as other admin routes)

### `GET /admin/office-locations`

Same pagination; return **all** (published + unpublished). Sort by `display_order`.

### `GET /admin/office-locations/{id}`

### `POST /admin/office-locations`

Body:

```json
{
  "name": "Delhi",
  "slug": "delhi",
  "office": "...",
  "phone": "...",
  "email": "...",
  "website": "www.gdmspl.com",
  "map_url": "...",
  "lat": 28.6139,
  "lng": 77.209,
  "map_offset_x": -20,
  "map_offset_y": -8,
  "map_label_width": 14,
  "display_order": 1,
  "is_published": true
}
```

Validate: `name`, `slug`, `office`, `phone`, `email` required. Unique `name` + `slug`.

### `PATCH /admin/office-locations/{id}`

Partial update of the same fields.

### `DELETE /admin/office-locations/{id}`

Hard delete (same as other CMS resources) or soft-delete if that’s your project convention — stay consistent with team-members.

### `PATCH /admin/office-locations/reorder`

Body:

```json
{
  "items": [
    { "id": "uuid-1", "display_order": 1 },
    { "id": "uuid-2", "display_order": 2 }
  ]
}
```

Update `display_order` for each id.

---

## Frontend already expects

The Next.js app (`GDMSPL-main`) already calls:

- `GET /office-locations`
- `GET|POST|PATCH|DELETE /admin/office-locations`
- `PATCH /admin/office-locations/reorder`

Admin UI: `/admin/locations`

Until these endpoints exist, the site falls back to hardcoded Delhi / Mumbai / Nepal / Muscat.

---

## Seed values (map coords)

| Name | lat | lng | offset_x | offset_y | w |
|------|-----|-----|----------|----------|---|
| Delhi | 28.6139 | 77.2090 | -20 | -8 | 14 |
| Mumbai | 19.0760 | 72.8777 | -7 | 8 | 14 |
| Nepal | 27.7172 | 85.3240 | 4 | -8 | 14 |
| Muscat | 23.5859 | 58.4059 | -20 | -2 | 14 |

Use existing contact addresses from the marketing site for `office` / `phone` / `email` / `map_url`.

---

## Done when

- [ ] Migration + model created
- [ ] Public list returns published locations ordered
- [ ] Admin CRUD + reorder works with JWT
- [ ] Seeded 4 default offices
- [ ] OpenAPI / route registered under `/api/v1`
