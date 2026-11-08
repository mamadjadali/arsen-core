# Catalog API (`/api/v1`)

Machine-to-machine endpoints for products and live-bundles. Auth uses Payload’s API-Key strategy on the `api-keys` collection.

## Setup

1. In Admin → **System / تنظیمات** → **API keys**, create a key.
2. Copy the generated secret once (Payload shows it after create).
3. Assign scopes (`products`, `bundles`) and leave **Enabled** on.

## Auth header

```http
Authorization: api-keys API-Key <generated-key>
Content-Type: application/json
```

Responses are JSON: `{ "ok": true, "data": ... }` or `{ "ok": false, "error": { "code", "message" } }`.

## Products

### Create or upsert

```bash
curl -sS -X POST "$BASE/api/v1/products" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "m140-iphone-16",
    "title": "iPhone 16",
    "printName": "آیفون ۱۶",
    "brandKey": "apple",
    "categoryKey": "phone",
    "active": true,
    "imageUrl": "https://cdn.example.com/iphone-16.jpg",
    "price": 85000000,
    "colors": [
      { "name": "مشکی", "sku": "IP16-BK", "b2bPrice": 82000000, "remains": 12 }
    ],
    "colorSwatches": [
      { "label": "مشکی", "hex": "#111111" },
      { "label": "سفید", "hex": "#FFFFFF" }
    ]
  }'
```

If `productId` already exists, the same endpoint updates that document.

Optional `colorSwatches` (create/upsert/PATCH): `{ label?, hex }` with 6-digit `#RRGGBB`. Used for live-bundle Mix/single-color circles; when provided, replaces existing swatches.

### Patch / get / publish / disable

```bash
# Update
curl -sS -X PATCH "$BASE/api/v1/products/m140-iphone-16" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "imageUrl": "https://cdn.example.com/iphone-16-v2.jpg", "active": true }'

# Read
curl -sS "$BASE/api/v1/products/m140-iphone-16" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY"

# Publish (_status: published)
curl -sS -X POST "$BASE/api/v1/products/m140-iphone-16/publish" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY"

# Unpublish (_status: draft)
curl -sS -X POST "$BASE/api/v1/products/m140-iphone-16/unpublish" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY"

# Soft-disable for live-bundle matching (active: false)
curl -sS -X POST "$BASE/api/v1/products/m140-iphone-16/disable" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY"

# Re-enable matching
curl -sS -X POST "$BASE/api/v1/products/m140-iphone-16/enable" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY"
```

## Bundles

### Create

```bash
curl -sS -X POST "$BASE/api/v1/bundles" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "پک پاییزه",
    "slug": "autumn-pack",
    "status": "draft",
    "notes": "آماده ارسال",
    "lines": [
      {
        "productId": "m140-iphone-16",
        "colorName": "مشکی",
        "quantity": 2,
        "unitPriceToman": 82000000
      }
    ]
  }'
```

### Patch / get / publish / disable

```bash
# Update by Payload id or slug
curl -sS -X PATCH "$BASE/api/v1/bundles/autumn-pack" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "notes": "به‌روز شد" }'

curl -sS "$BASE/api/v1/bundles/autumn-pack" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY"

# Publish (status: live)
curl -sS -X POST "$BASE/api/v1/bundles/autumn-pack/publish" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY"

# Hide from public view (status: archived)
curl -sS -X POST "$BASE/api/v1/bundles/autumn-pack/disable" \
  -H "Authorization: api-keys API-Key $CATALOG_API_KEY"
```

## Notes

- Keys do **not** unlock raw `/api/products` or `/api/live-bundles` writes; only `/api/v1/*`.
- Product `imageUrl` is preferred on the storefront over the featured image upload.
- Bundle line sync (product ↔ productId) runs through the normal LiveBundles hooks on create/update.
- Rate limiting and browser CORS for partners are out of scope for v1 (assume server-to-server).
