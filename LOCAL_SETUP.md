# Private Market — Local Setup (Loom-ready)

Portugal real-estate portal: list, view, and manage property offers.

**Stack:** React + Vite (client) · Node.js + Express (server) · MongoDB

## Prerequisites

- Node.js 18+ (20/22 recommended)
- MongoDB running locally (`mongod` or Docker)
- npm

```bash
# Check MongoDB
mongosh --eval 'db.runCommand({ ping: 1 })'
# or
sudo systemctl start mongod
```

## Quick start

```bash
cd private-market

# 1) Server env
cp server/.env.example server/.env
# edit if needed — defaults already point to localhost

# 2) Client env
cp client/.env.example client/.env

# 3) Install
cd server && npm install && cd ..
cd client && npm install && cd ..

# 4) Seed demo users + Portugal districts + sample listings
cd server && npm run seed && cd ..

# 5) Run (two terminals)
cd server && npm start          # http://localhost:3059  (uses nodemon)
cd client && npm run dev        # http://localhost:2059

# If nodemon fails with ENOSPC (file watcher limit), start without watchers:
cd server && node ./bin/www
# Optional for Vite under the same limit:
CHOKIDAR_USEPOLLING=1 npm run dev -- --host 0.0.0.0 --port 2059
```

- **App:** http://localhost:2059  
- **API:** http://localhost:3059/api  
- **Public property list:** http://localhost:3059/api/property/propertyList  
- **Swagger:** http://localhost:3059/api/api-doc  

## How to log in

1. Open **http://localhost:2059/**
2. Use the **Login** control in the header (modal — there is no `/login` page).
3. Sign in with one of the demo accounts below. Same `POST /api/auth/signin` for all roles; redirect depends on role:
   - Admin → `/admin/dashboard`
   - Agent / Buyer → `/customer/*`

## Demo credentials (for Loom)

| Role | Who | Email | Password | Loom focus |
|------|-----|-------|----------|------------|
| Admin | **Ana** | `ana@privatemarket.local` | `Ana@123456` | dashboard, users, CMS, orders |
| Real estate agent | **Miguel** | `miguel@privatemarket.local` | `Miguel@123` | listings, properties, profile |
| Customer / buyer | **Sofia** | `sofia@privatemarket.local` | `Sofia@123` | browse listings, favourites, cart, files |

Seeded: 8 properties with photos (`PM-LIS-001` … `PM-AVE-008`) in MongoDB `privateMarketLocal` — live API, not static UI.

**Where listings appear**
- **Sofia (buyer):** `/customer/property-listing` (marketplace browse — 8 listings). `/customer/property-list` redirects here.
- **Miguel (agent):** `/customer/property-list` (his own 8 listings to manage).
- After login Sofia lands on `/customer/file-list`.

## Loom tip

1. Log in as **Sofia** → property-listing / favourites / cart / file-list.  
2. Log out, log in as **Miguel** → property-list (manage) / save-search / profile.  
3. Log out, log in as **Ana** → admin dashboard / users / CMS / orders.  

## Notes

- Data comes from Express + MongoDB (`privateMarketLocal`), not static frontend mocks.  
- Maps: leave `VITE_APP_MAP_KEY` empty to use OpenStreetMap (no Google billing). Set a valid Google key only if you want Google embeds / Places autocomplete.  
- Stripe/SMTP are stubbed for local demo; payments/email won’t send unless you add real keys.  
- Re-run `npm run seed` anytime; it skips existing emails/references.  
- Prefer `node ./bin/www` over `npm start` when the host hits `ENOSPC` / inotify watcher limits.  
- CMS/image uploads: GridFS (bson 5) + Mongoose 8 (bson 6) are normalized in `middleware/upload.js` (fixes `Unsupported BSON version`).  
- **Create Product (admin):**  
  - **Product spreadsheet** = `.xlsx` / `.xls` / `.csv` (not a photo). Use `/sample-product-data.xlsx`.  
  - **Product photo(s)** = at least one JPG/PNG via the **+** button.
