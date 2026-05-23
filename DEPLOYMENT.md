# Deploy SWMS (Vercel + Render)

The Vercel site is **frontend only**. All `/api` calls must be proxied to a running Spring Boot API.

## 1. Deploy the backend (Render)

1. Push this repo to GitHub.
2. On [Render](https://render.com), create a **Web Service** from the repo.
3. Use the `render.yaml` blueprint (Docker, `SPRING_PROFILES_ACTIVE=demo`).
4. Wait until the service is **Live** and copy the URL, e.g. `https://swms-backend.onrender.com` (no trailing slash).

Open `https://YOUR-API.onrender.com/api-docs` — you should see Swagger.

> **Note:** Free Render services sleep after inactivity. The first request may take 30–60 seconds.

## 2. Configure Vercel

In your Vercel project → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `BACKEND_URL` | `https://YOUR-API.onrender.com` |

Apply to **Production**, **Preview**, and **Development**.

**Root Directory** must be the **repository root** (not `frontend/`), so `middleware.js` and `api/[...path].js` are included.

Redeploy Vercel after saving the variable.

## 3. Verify

1. Visit your Vercel URL and log in: `admin@swms.com` / `admin123`
2. Dashboard should show stats; Projects should list 2 demo projects.
3. If it fails, open DevTools → Network → check `/api/dashboard/stats` response.

## Demo accounts

| Email | Password |
|-------|----------|
| admin@swms.com | admin123 |
| manager@swms.com | manager123 |
| dev@swms.com | dev123 |

Demo data is re-seeded when the API restarts (H2 in-memory on Render).
