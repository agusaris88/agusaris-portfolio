# Agus Aris — Academic & Geospatial Portfolio

Responsive white editorial academic website with research locations WebGIS, publications, media, learning resources, and an authenticated content manager.

## Features
- White, understated editorial design.
- Interactive Leaflet map showing research locations and popups.
- Popup links for publications/outputs associated with each location.
- Searchable location list.
- Publications, media, and learning resource sections.
- Admin interface at `admin.html` to create, edit, and delete content.
- Supabase authentication, database, row-level security policies, and Realtime subscriptions.
- Static fallback demonstration data if Supabase is not configured.

## Important distinction
The site files are prepared, but real-time cross-device editing requires a Supabase project and configuration. Until those steps are complete, the public site shows demonstration locations and the admin interface warns that the database is not configured. Approximate demo coordinates are not validated survey coordinates.

## Publish with GitHub Pages
1. Create a GitHub repository such as `agus-aris-portfolio`.
2. Upload the contents of this folder to the repository root: `index.html`, `admin.html`, `assets/`, `README.md`, and `supabase_schema.sql`.
3. Open **Settings → Pages**. Select **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. The published site URL appears in Settings → Pages.

## Configure dynamic updates (Supabase)
1. Create a Supabase project.
2. Open **SQL Editor** and run the complete `supabase_schema.sql` file.
3. In **Authentication → Users**, create your administrator account with your own email and a strong password. Keep signup disabled if this is a single-admin CMS.
4. In **Project Settings → API**, copy the Project URL and the publishable/anon key. Do not use the `service_role` key.
5. Edit `assets/js/config.js` and set:
   ```js
   window.SITE_CONFIG = {
     supabaseUrl: "https://YOUR_PROJECT.supabase.co",
     supabaseAnonKey: "YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY",
     contactEmail: "YOUR_PUBLIC_EMAIL",
     refreshIntervalMs: 60000
   };
   ```
6. Commit and push the change. The public site can read public records; only authenticated users can write according to the included RLS policies.
7. Open `https://YOUR-USERNAME.github.io/YOUR-REPO/admin.html`, log in with the account created in Supabase, and add/edit/delete locations, publications, media, and learning resources.
8. Realtime subscriptions are enabled in the code. The SQL adds the four tables to `supabase_realtime`; if Supabase reports publication/permission differences, check **Database → Replication** and enable Realtime for the tables.
9. Replace approximate sample coordinates with verified study coordinates. Never publish sensitive field locations or data that should remain restricted.

## How to add a research location
In `admin.html`, select **Lokasi riset**, fill in name, region, latitude, longitude, topic, description, year, and optionally `outputs` JSON:
```json
[
  {
    "title": "Article title",
    "url": "https://doi.org/your-doi"
  }
]
```
Use decimal degrees (latitude and longitude), e.g. `-5.12345` and `119.12345`. A saved record appears as a map marker with a popup. The popup shows its associated output links.

## Add publications, media, and learning materials
Use the tabs in the admin panel. Use public URLs for DOI/publisher pages, video pages, or files. For images, `image_url` must be a publicly accessible image URL; avoid private drive links. Do not upload secrets or private data.

## Security and operational notes
- The Supabase anon/publishable key is designed for browser use; database security is enforced by RLS policies.
- Never publish the `service_role` key.
- Current policies allow any authenticated user to write. For a single-admin deployment, create only your admin account and disable public sign-ups. For institutional use, strengthen policies by restricting writes to a specific admin user ID or role.
- Static hosting itself has no private server-side credentials. Use Supabase Auth and RLS for protected editing.
- Leaflet basemap tiles use OpenStreetMap. Respect tile usage policies.
- The map is a research portfolio, not a substitute for validated GIS deliverables.
