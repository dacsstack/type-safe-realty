# FortHub Realty — Frontend Documentation

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Configuration](#environment-configuration)
5. [Application Entry Points](#application-entry-points)
6. [Routing & Navigation](#routing--navigation)
7. [Authentication Flow](#authentication-flow)
8. [Service Layer](#service-layer)
9. [Shared Types](#shared-types)
10. [Pages (Public)](#pages-public)
11. [Pages (Detail Views)](#pages-detail-views)
12. [Components (Admin)](#components-admin)
13. [Components (Shared)](#components-shared)
14. [Layouts](#layouts)
15. [State Management](#state-management)
16. [How API Calls Are Made](#how-api-calls-are-made)
17. [How to Run](#how-to-run)

---

## Overview

This is the **React 18 TypeScript frontend** for FortHub Realty — a real estate listing and admin management platform. It has two distinct areas:

1. **Public site** — Landing page, project listings, blog posts, about pages
2. **Admin dashboard** — Protected CRUD management for all content

---

## Tech Stack

| Package                          | Purpose                               |
| -------------------------------- | ------------------------------------- |
| `react` + `react-dom` v19        | UI rendering                          |
| `typescript`                     | Type safety                           |
| `vite`                           | Dev server and production bundler     |
| `react-router-dom` v7            | Client-side routing                   |
| `axios`                          | HTTP client (used in some components) |
| `tailwindcss`                    | Utility-first CSS framework           |
| `react-slick` + `slick-carousel` | Carousel/slider component             |
| `@react-google-maps/api`         | Google Maps integration               |
| `react-player`                   | YouTube/video embed player            |

---

## Project Structure

```
ui/my-app/
├── index.html                  ← HTML shell, loads src/main.tsx
├── vite.config.js              ← Vite bundler config
├── tailwind.config.js          ← Tailwind CSS setup
├── .env                        ← Local dev API URLs
├── .env.production             ← Production API URLs (Railway)
├── src/
│   ├── main.tsx                ← ReactDOM.render entry, mounts <App />
│   ├── App.tsx                 ← Root component: router + route definitions
│   ├── vite-env.d.ts           ← TypeScript declarations for import.meta.env
│   ├── Variables.ts            ← Exported API_URL, PHOTO_URL, UPLOADS_URL constants
│   ├── ProtectedRoute.tsx      ← Guards admin routes, redirects to /login if no token
│   ├── types.ts                ← Shared domain TypeScript interfaces
│   ├── index.css               ← Global styles + Tailwind directives
│   │
│   ├── types/
│   │   └── api.ts              ← API response shape interfaces
│   │
│   ├── utils/
│   │   └── env.ts              ← Vite env var helpers for httpClient
│   │
│   ├── store/
│   │   └── authStore.ts        ← localStorage token read/write/clear
│   │
│   ├── services/
│   │   ├── httpClient.ts       ← Generic fetch wrapper (GET/POST/PUT/DELETE)
│   │   ├── authService.ts      ← Login API call
│   │   └── propertyService.ts  ← Property API calls
│   │
│   ├── hooks/
│   │   ├── useAuth.ts          ← Hook for auth state
│   │   └── useProperties.ts    ← Hook for properties data
│   │
│   ├── layouts/
│   │   └── Layout.tsx          ← Public header + footer wrapper
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx     ← Home page (hero, projects, about, blogs)
│   │   ├── ProjectDetails.tsx  ← Single project detail view
│   │   ├── BlogDetails.tsx     ← Single blog post view
│   │   └── AboutDetails.tsx    ← Single about/service entry view
│   │
│   └── components/
│       ├── AdminLayout.tsx     ← Admin sidebar + outlet wrapper
│       ├── Login.tsx           ← Login form
│       ├── Dashboard.tsx       ← Admin stats overview
│       ├── Developer.tsx       ← Developer company CRUD
│       ├── Project.tsx         ← Property CRUD with photo upload
│       ├── Feature.tsx         ← Feature profile CRUD
│       ├── Banner.tsx          ← Hero slider banner CRUD
│       ├── About.tsx           ← About section CRUD
│       ├── Blog.tsx            ← Blog post CRUD
│       ├── HeroSlider.tsx      ← Animated banner slider + inquiry form
│       ├── WhatsAppChat.tsx    ← Floating WhatsApp chat button
│       └── ui/
│           ├── Button.tsx      ← Reusable button component
│           └── Card.tsx        ← Reusable card component
```

---

## Environment Configuration

### `src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />
// Tells TypeScript that import.meta.env exists and has these typed properties:
interface ImportMetaEnv {
  readonly VITE_API_URL: string; // Base API URL
  readonly VITE_PHOTO_URL: string; // Photos path
  readonly VITE_UPLOADS_URL: string; // Blog image uploads path
}
```

### `src/Variables.ts`

```typescript
// Central place for all external URL constants.
// Reads from .env (local) or .env.production (build), with localhost fallbacks.
export const variables = {
  API_URL: (import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/",
  PHOTO_URL:
    (import.meta.env.VITE_PHOTO_URL || "http://localhost:5000/Photos") + "/",
  UPLOADS_URL:
    (import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000/uploads") + "/",
};
```

**Usage:** Import `variables` and use `variables.API_URL + "endpoint"` anywhere you make API calls.

### `.env` (local development)

```env
VITE_API_URL=http://localhost:5000/api
VITE_PHOTO_URL=http://localhost:5000/Photos
VITE_UPLOADS_URL=http://localhost:5000/uploads
```

### `.env.production` (production build)

```env
VITE_API_URL=https://forthubapi-backend-production.up.railway.app/api
VITE_PHOTO_URL=https://forthubapi-backend-production.up.railway.app/Photos
VITE_UPLOADS_URL=https://forthubapi-backend-production.up.railway.app/uploads
```

> Vite automatically loads `.env.production` when running `npm run build`.

---

## Application Entry Points

### `index.html`

```html
<!-- Vite dev server serves this file -->
<!-- The root div is where React mounts -->
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

### `src/main.tsx`

```typescript
// Finds the #root element in index.html
// Wraps the entire app in React.StrictMode (catches development issues)
// Mounts the <App /> component into it
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## Routing & Navigation

### `src/App.tsx`

The root component. Defines all routes and manages the auth token state.

```typescript
const App: FC = () => {
  // 1. Load token from localStorage on first render
  //    If user previously logged in, they stay logged in after page refresh
  const [token, setToken] = useState<string | null>(authStore.getToken());

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES — anyone can visit */}
        <Route path="/"          element={<LandingPage />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />    {/* :id = blog ID from URL */}
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/about/:id"  element={<AboutDetails />} />
        <Route path="/login"     element={<Login setToken={setToken} />} />

        {/* PROTECTED ROUTES — wrapped in ProtectedRoute guard */}
        {/* If no token → redirected to /login */}
        {/* AdminLayout renders a sidebar with <Outlet /> for child routes */}
        <Route element={
          <ProtectedRoute token={token}>
            <AdminLayout setToken={setToken} />
          </ProtectedRoute>
        }>
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/developer"  element={<Developer />} />
          <Route path="/project"    element={<Project />} />   {/* Admin CRUD, not public detail */}
          <Route path="/banner"     element={<Banner />} />
          <Route path="/features"   element={<Feature />} />
          <Route path="/about"      element={<About />} />
          <Route path="/blogs"      element={<Blog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

**Route table summary:**

| URL            | Component        | Access     |
| -------------- | ---------------- | ---------- |
| `/`            | `LandingPage`    | Public     |
| `/blogs/:id`   | `BlogDetails`    | Public     |
| `/project/:id` | `ProjectDetails` | Public     |
| `/about/:id`   | `AboutDetails`   | Public     |
| `/login`       | `Login`          | Public     |
| `/dashboard`   | `Dashboard`      | Admin only |
| `/developer`   | `Developer`      | Admin only |
| `/project`     | `Project`        | Admin only |
| `/banner`      | `Banner`         | Admin only |
| `/features`    | `Feature`        | Admin only |
| `/about`       | `About`          | Admin only |
| `/blogs`       | `Blog`           | Admin only |

---

## Authentication Flow

```
1. User visits /login
2. Enters username + password → hits handleLogin()
3. authService.login() → POST /api/login → returns { token }
4. Token saved to localStorage via authStore.setToken()
5. setToken(token) updates App.tsx state → ProtectedRoute now allows access
6. navigate("/dashboard") → user lands on admin dashboard

7. On page refresh:
   → App.tsx calls authStore.getToken() on mount
   → Reads token from localStorage
   → ProtectedRoute stays open (no redirect)

8. Logout:
   → AdminLayout calls logout()
   → localStorage.removeItem("token")
   → setToken(null) → App.tsx state clears
   → ProtectedRoute redirects to /login
```

### `src/store/authStore.ts`

```typescript
const TOKEN_KEY = "token"; // localStorage key name

export const authStore = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY); // Read JWT from browser storage
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token); // Save JWT — persists across page refreshes
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY); // Remove JWT on logout
  },
};
```

### `src/ProtectedRoute.tsx`

```typescript
// Receives: token (string | null), children (React elements)
// If no token → redirects to /login (replaces history so user can't go back)
// If token exists → renders children normally
export default function ProtectedRoute({ token, children }: ProtectedRouteProps) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
```

---

## Service Layer

The service layer abstracts all HTTP calls away from components.

### `src/services/httpClient.ts`

```typescript
// Base HTTP client — wraps fetch() with consistent error handling and auth headers

const buildUrl = (path: string): string => {
  // Joins the base API URL with the endpoint path
  // e.g. buildUrl("/developers") → "http://localhost:5000/api/developers"
  return `${env.apiUrl}${path.startsWith("/") ? path : "/" + path}`;
};

export const httpClient = {
  async get<T>(path: string, token?: string): Promise<T> {
    // Makes GET request, adds Bearer token header if provided
    // Throws Error if response status is not 2xx
    const response = await fetch(buildUrl(path), {
      headers: { "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (!response.ok) throw new Error(`GET ${path} failed: ${response.status}`);
    return response.json();
  },
  async post<TReq, TRes>(path, body, token?): Promise<TRes> { ... },
  async put<TReq, TRes>(path, body, token?): Promise<TRes> { ... },
  async delete<T>(path, token?): Promise<T> { ... },
};
```

### `src/services/authService.ts`

```typescript
// Calls POST /api/login with { username, password }
// Returns Promise<AuthResponse> which contains { token, message }
export const authService = {
  login(input: LoginInput): Promise<AuthResponse> {
    return httpClient.post("/login", input);
  },
};
```

---

## Shared Types

### `src/types.ts` — Domain interfaces

```typescript
// Blog — represents a blog post
interface Blog {
  BlogId: number;
  Title: string;
  Description?: string; // optional body text
  VideoUrl?: string; // optional YouTube link
}

// Banner — hero slider slide
interface Banner {
  BannerId: number;
  BannerName: string; // headline shown on slide
  PhotoFileName?: string; // background image filename
}

// Developer — a real-estate company
interface Developer {
  DeveloperId: number;
  DeveloperName: string;
  PhotoFileName?: string | string[]; // can be comma-string or array
}

// Project — a property listing
interface Project {
  ProjectId: number;
  ProjectName: string;
  Developer?: string; // developer name (not FK)
  PhotoFileName?: string | string[];
}

// About — a service/about section entry
interface About {
  AboutId: number;
  Title: string;
  Feature?: string; // feature label (e.g. "Luxury Condos")
  PhotoFileName?: string | string[];
}

// ProtectedRoute props — token + children
interface ProtectedRouteProps {
  token: string | null;
  children: ReactNode;
}
```

### `src/types/api.ts` — API response shapes

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface AuthResponse {
  token: string; // JWT token string
  message: string;
}

interface Property {
  ProjectId: number;
  Location: string;
  Price: number;
  PropertyType: string;
  PhotoFileName: string[]; // always an array (deserialized by API)
  // ... more fields
}
```

---

## Pages (Public)

### `src/pages/LandingPage.tsx`

The main public-facing homepage. Contains its own header and footer (does not use `Layout`).

```
State:
  projects[]      ← list of property cards from GET /api/project
  blogs[]         ← list of blog posts from GET /api/blogs
  about[]         ← list of about/service entries from GET /api/about
  filters         ← { location, type, minPrice, maxPrice } for project search
  menuOpen        ← controls mobile hamburger menu open/close
  showAllBlogs    ← toggle between showing 3 or all blogs

Sections (top to bottom):
  1. Header         ← Sticky top nav with scroll-to links
  2. HeroSlider     ← Auto-playing background image slider with inquiry form
  3. Projects       ← Filter bar + grid of property cards
  4. About          ← Cards for each about/service entry
  5. Blogs          ← Blog post cards (3 shown, "View All" to expand)
  6. WhatsAppChat   ← Floating chat bubble
  7. Footer         ← Links + contact info + featured project shortcuts
```

**Key functions:**

```typescript
// scrollToSection(id) — smooth-scrolls to a section by element ID
// fetchFilteredProjects(overrideFilters?) — calls GET /api/project?location=...&type=...
//   If no results found → falls back to fetching all projects
// handleFeaturedClick(locationName) — predefined location filter shortcuts in footer
// getPhotoUrl(photoFileName) — converts string or array to a full image URL
```

---

### `src/pages/ProjectDetails.tsx`

Displayed when a user clicks a project card. URL: `/project/:id`

```
Props:  none (reads :id from URL with useParams)
State:
  project    ← full project object from GET /api/project/:id
  photos[]   ← array of photo filenames

Behavior:
  1. On mount → fetch project by ID
  2. Parse PhotoFileName (can be comma-separated string or array)
  3. Render project info + photo grid

Back button: navigate(-1) → browser history back
```

### `src/pages/BlogDetails.tsx`

Displayed when user clicks "Read More" on a blog. URL: `/blogs/:id`

```
State: blogs (single Blog object)
On mount: fetch GET /api/blogs/:id
Renders:  title, optional YouTube embed (iframe), or blog image, description
Wrapped in: <Layout> (public header/footer)
```

### `src/pages/AboutDetails.tsx`

Detail view for an about/service entry. URL: `/about/:id`

```
State: about (single About object), photos[]
On mount: fetch GET /api/about/:id, parse PhotoFileName
Renders:  title, feature label, description, photo grid
Wrapped in: <Layout> (public header/footer)
```

---

## Components (Admin)

All admin components are rendered inside `AdminLayout`.

### `src/components/AdminLayout.tsx`

The admin shell. Contains:

- **Left sidebar** with navigation links (Dashboard, Developers, Projects, Banners, Features, About, Blogs)
- **`<Outlet />`** — React Router renders the active admin page content here
- **Logout button** — clears token, redirects to login

```typescript
// NavLink with isActive pattern — highlights the currently active sidebar item
<NavLink to="/dashboard" className={({ isActive }) =>
  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
}>
  Dashboard
</NavLink>
```

### `src/components/Login.tsx`

```
State: username, password, error, loading, showPassword
Flow:
  1. User submits form → handleLogin()
  2. Calls authService.login({ username, password })
  3. On success: saves token, calls setToken(token) passed from App.tsx
  4. Navigates to /dashboard
  5. On error: shows error message below the form
```

### `src/components/Dashboard.tsx`

Admin overview page with stats and quick data tables.

```
State:
  stats    ← { totalProjects, totalDevelopers, totalInquiries }
  projects ← recent property list
  inquiries← list of contact inquiries

On mount:
  Creates axios instance with Bearer token header interceptor
  Makes 3 parallel GET calls:
    GET /api/dashboard → stats
    GET /api/project   → projects
    GET /api/inquiry   → inquiries

deleteInquiry(id):
  Confirms with window.confirm()
  Calls DELETE /api/inquiry/:id
  Removes from local state (optimistic update)
```

### `src/components/Developer.tsx`

Full CRUD management for real-estate developer companies.

```
State:
  developers[]         ← full list
  filtered[]           ← displayed list (after filter/sort applied)
  filterDeveloperId    ← filter input value
  filterDeveloperName  ← filter input value
  modal fields         ← DeveloperName, DeveloperTitle, Description, DateOfJoining, PhotoFileName

Key methods:
  refreshList()        ← GET /api/developers, updates state
  FilterFn()           ← client-side filter applied to developers[]
  sortResult(field)    ← sorts filtered[] by selected column
  createClick()        ← POST /api/developers with form data
  updateClick()        ← PUT /api/developers with form data
  deleteClick(id)      ← DELETE /api/developers/:id
```

### `src/components/Project.tsx`

Most complex admin component — manages property listings with photo uploads.

```
State:
  projects[]           ← full property list
  developers[]         ← populated for dropdown selector
  form fields     ← ProjectName, Developer, PropertyDetails, DateOfJoining,
                     Location, Price, PropertyType, Latitude, Longitude,
                     PhotoFileName[] (array of filenames)

Key methods:
  refreshList()        ← Fetches both GET /api/developer and GET /api/project
  editClick(project)   ← Populates form fields for editing
  createClick()        ← POST /api/project with typed form data
  updateClick()        ← PUT /api/project with typed form data
  deleteClick(id)      ← DELETE /api/project/:id
  imageUpload(files)   ← POST /api/project/savefile (multipart)
                          Receives { fileNames: [] } response
                          Appends filenames to PhotoFileName[] state
```

### `src/components/Feature.tsx`

```
CRUD for "feature profiles" (service features shown publicly)
State: features[], filter values, form fields
Methods: FilterFn, createClick, updateClick, deleteClick
API: GET/POST/PUT/DELETE /api/features
```

### `src/components/Banner.tsx`

```
CRUD for hero slider banners
State: banners[], form fields, editing flag
API: GET/POST/DELETE /api/banner
Photo upload: POST /api/banner/savefile
```

### `src/components/About.tsx`

```
CRUD for about/service section entries
State: abouts[], form fields
API: GET/POST/PUT/DELETE /api/about
```

### `src/components/Blog.tsx`

```
CRUD for blog posts
State: blogs[], editing (Blog | null), form { Title, Description, VideoUrl }
Methods: fetchBlogs, handleSubmit (create or update), handleDelete, handleEdit
API calls all use variables.API_URL

Create:  POST /api/blogs
Update:  PUT /api/blogs/:id
Delete:  DELETE /api/blogs/:id
```

---

## Components (Shared)

### `src/components/HeroSlider.tsx`

Public-facing animated banner/hero section.

```
State:
  slides[]     ← banners from GET /api/banner
  current      ← index of currently shown slide (0-based)
  form         ← inquiry form { Name, Email, Contact, Message }
  loading      ← submission loading state

Auto-slider:
  useEffect sets an interval that increments `current` every 5 seconds
  CSS opacity transitions between slides
  Cleanup: clears interval on unmount (prevents memory leaks)

Inquiry form:
  handleSubmit → POST /api/inquiry with form data
  Shows success/error alert
  Resets form on success

Background images:
  Each slide uses PhotoFileName from API
  URL: variables.PHOTO_URL + filename
  Falls back to /dummy/placeholder.jpg if no photo
```

### `src/components/WhatsAppChat.tsx`

Floating chat button (bottom-right corner).

```
State:
  isOpen  ← toggles expanded chat widget

Listens for: window event "openWhatsAppChat"
  (HeroSlider dispatches this event from "Chat with Us" button)
```

---

## Layouts

### `src/layouts/Layout.tsx`

Wraps all detail pages (BlogDetails, ProjectDetails, AboutDetails) with consistent header and footer.

```
Props: children (ReactNode)
State: menuOpen (mobile hamburger)

Header:
  Logo → links to "/"
  Desktop nav: Home, Blogs, About, Our Projects, Contact (Link components)
  Mobile nav: same links, hidden until menuOpen = true

Footer:
  Brand info
  Quick links
  Featured projects list
  Contact info

Also renders: <WhatsAppChat /> floating widget
```

---

## State Management

This project uses **local React state only** — no Redux, Zustand, or Context API for global state (except for the token passed through props).

| Data                            | Location                          | How                      |
| ------------------------------- | --------------------------------- | ------------------------ |
| JWT Token                       | `App.tsx` state + localStorage    | `useState` + `authStore` |
| Page data (projects/blogs/etc.) | Each component's local state      | `useState` + `useEffect` |
| Form fields                     | Each component's local state      | `useState`               |
| Admin sidebar active link       | React Router `NavLink` `isActive` | Built-in                 |

---

## How API Calls Are Made

There are two patterns used in this codebase:

### Pattern 1: Direct `axios` or `fetch` with `variables.API_URL`

Used by most components. Example:

```typescript
// In LandingPage.tsx
import { variables } from "../Variables";

// GET request
axios.get<ProjectData[]>(variables.API_URL + "project");

// POST with auth
fetch(variables.API_URL + "developers", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify(formData),
});
```

### Pattern 2: `httpClient` + `authService`

Used by the Login component:

```typescript
// Login.tsx
import { authService } from "../services/authService";
const data = await authService.login({ username, password });
// internally calls httpClient.post("/login", input)
// which calls fetch(env.apiUrl + "/login", ...)
```

---

## How to Run

### Prerequisites

- Node.js 18+
- The API running at `http://localhost:5000` (see `api/DOCUMENTATION.md`)

### Setup

```bash
# 1. Install dependencies
cd ui/my-app
npm install

# 2. Start Vite development server (hot-reload)
npm run dev
# → Opens at http://localhost:5173

# 3. Build for production
npm run build
# → Outputs to dist/ folder, uses .env.production URLs

# 4. Preview the production build locally
npm run preview
```

### Development workflow

1. Start the API: `cd api && npm run dev`
2. Start the frontend: `cd ui/my-app && npm run dev`
3. Open `http://localhost:5173`
4. Admin login at `http://localhost:5173/login`

### How Vite resolves environment variables

| Command         | Loads             | API URL                    |
| --------------- | ----------------- | -------------------------- |
| `npm run dev`   | `.env`            | `http://localhost:5000`    |
| `npm run build` | `.env.production` | Railway production URL     |
| Custom          | `.env.local`      | Override any value locally |
