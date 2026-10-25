# 🌱 EcoConnect – Give More, Waste Less

> A modern, responsive MERN-stack community sustainability and circular reuse platform built for academic project presentation and real-world social impact.

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-v19%20%2B%20Vite-blue.svg)](https://react.dev/)
[![MongoDB & Mongoose](https://img.shields.io/badge/MongoDB-Mongoose%20Ready-emerald.svg)](https://www.mongodb.com/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-v5.3-purple.svg)](https://getbootstrap.com/)
[![Leaflet OpenStreetMap](https://img.shields.io/badge/Leaflet-OpenStreetMap-brightgreen.svg)](https://leafletjs.com/)

---

## 📌 1. Problem Statement & Social Mission

Modern consumption generates millions of tons of solid municipal waste annually, much of which consists of usable furniture, working electronics, clothing, books, and study materials discarded during relocations or upgrades. At the same time, students, low-income households, and local non-profits frequently struggle to access these exact essentials.

**EcoConnect** tackles this social and environmental challenge by:
1. **Connecting Local Donors and Receivers:** Enabling rapid zero-cost donation listings and structured in-app pickup requests with complete privacy protection.
2. **Community Needs Board:** Empowering neighbors and community kitchens to broadcast urgent item requests.
3. **Interactive Zero-Waste Depot Mapping:** Visualizing local recycling centers, e-waste drop-offs, and compost facilities using Leaflet and OpenStreetMap.
4. **Transparent Carbon & Waste Metrics:** Quantifying cumulative kilograms of landfill diverted, embodied CO₂ emissions avoided (derived from US EPA WARM model averages), and equivalent mature trees saved.

---

## 🛠️ 2. Technology Stack

- **Frontend:**
  - React 19 with Vite (lightning-fast HMR and bundle compilation)
  - React Router DOM v7 for declarative client-side routing
  - Bootstrap 5 + Bootstrap Icons + Custom Sustainability CSS
  - Leaflet & React-Leaflet with OpenStreetMap tiles
  - Lucide React for modern sustainability iconography
- **Backend:**
  - Node.js & Express.js REST API
  - MongoDB connection using Mongoose ODM
  - Dual-mode resilient persistence engine (Connects directly to MongoDB, with seamless file-backed local fallback if MongoDB is not running locally)
  - Password hashing with bcryptjs (10 salt rounds)
  - Secure JSON Web Token (JWT) authentication & authorization
  - Role-based access control for Members and Administrators

---

## 📂 3. Project Structure

```text
ecoconnect/
├── client/                     # Frontend React + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ItemCard, ReportModal, ProtectedRoute
│   │   ├── context/            # AuthContext (state, tokens, user profile)
│   │   ├── pages/              # Home, Explore, Detail, Donate, Edit, Needs, Map, Impact, Profile, Admin
│   │   ├── services/           # api.js (unified HTTP client with JWT interceptor)
│   │   ├── App.jsx             # Router and layout configuration
│   │   ├── App.css
│   │   ├── index.css           # Custom sustainability design system variables
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend REST API
│   ├── src/
│   │   ├── config/             # db.js (MongoDB / Mongoose connection & status diagnostic)
│   │   ├── controllers/        # auth, item, communityRequest, impact, admin, recycling
│   │   ├── data/               # storage.js (Dual Mongo/Fallback JSON persistence engine + initial seed)
│   │   ├── middleware/         # auth.js (JWT protect & adminOnly middleware)
│   │   ├── models/             # User, Item, ItemRequest, CommunityRequest, Report
│   │   ├── routes/             # Express API route modules
│   │   └── server.js           # Server bootstrap & CORS configuration
│   ├── .env                    # Local environment config
│   ├── .env.example            # Template for environment keys
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 4. How to Run the Project (Step-by-Step)

### Prerequisites
- Node.js (v18 or higher recommended)
- Optional: MongoDB Community Server or MongoDB Atlas (app runs with or without local MongoDB installed!)

### Step 1: Start the Backend Server (Terminal 1)
Open a terminal in the project root:
```bash
cd server
npm start
```
The backend API server will start on: **`http://localhost:5000`**
- Check system health and storage status anytime: **`http://localhost:5000/api/health`**

### Step 2: Start the Frontend Client (Terminal 2)
Open a second terminal in the project root:
```bash
cd client
npm run dev
```
The React development server will start on: **`http://localhost:5173`**
Open **`http://localhost:5173`** in your browser.

---

## 🔑 5. Demo Accounts for Presentation

To make evaluation and presentation instant, demonstration accounts with pre-loaded items and requests are ready:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ecoconnect.org` | `admin123` | Full Admin Portal, Content Moderation, User Records |
| **Community Member** | `sarah@ecoconnect.org` | `ecopass123` | Donations, In-app Requests, Profile Activity |
| **Student Member** | `david@ecoconnect.org` | `ecopass123` | Requests, Needs Board, Mutual Aid |

*(You can also use the **"Quick-Fill Demo Credentials"** 1-click buttons on the Login page!)*

---

## 🗄️ 6. Database Setup & Fallback Mode

### Option A: Direct MongoDB Connection (Default)
In `server/.env`, set:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/ecoconnect
```
If you have MongoDB running locally or use a MongoDB Atlas URI (e.g. `mongodb+srv://...`), Mongoose connects immediately and persists all data to your MongoDB database.

### Option B: Automatic Dev Fallback Storage (No MongoDB Required)
If MongoDB is not running on your machine, **EcoConnect automatically activates its built-in Development Fallback Persistence Engine**.
- All user registration, bcrypt password hashing, donation creation, in-app requests, and admin moderation actions **persist seamlessly to `server/src/data/db.json`**.
- The system badge in the footer transparently reports current storage mode so faculty know whether MongoDB or Local Fallback is active.

---

## 🌐 7. Key REST API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Diagnostic status (DB connection, uptime) | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Bearer Token |
| `PUT` | `/api/auth/profile` | Update profile information | Bearer Token |
| `GET` | `/api/items` | Explore items (category, condition, search) | No |
| `GET` | `/api/items/:id` | Get single item details | No |
| `POST` | `/api/items` | Publish a new donation listing | Bearer Token |
| `PUT` | `/api/items/:id` | Update donation listing | Owner / Admin |
| `DELETE`| `/api/items/:id` | Delete donation listing | Owner / Admin |
| `POST` | `/api/items/:id/request`| Request an item from a donor | Bearer Token |
| `GET` | `/api/items/requests/my`| View incoming & outgoing item requests | Bearer Token |
| `PUT` | `/api/items/requests/:id/respond`| Donor accepts/rejects request | Bearer Token |
| `GET` | `/api/community-requests` | Browse community needs | No |
| `POST` | `/api/community-requests` | Post a community need | Bearer Token |
| `POST` | `/api/community-requests/:id/offer` | Offer help on a community need | Bearer Token |
| `PUT` | `/api/community-requests/:id/status`| Mark need as Fulfilled | Owner / Admin |
| `GET` | `/api/recycling` | Verified & demo recycling centers | No |
| `GET` | `/api/impact` | Real aggregated environmental metrics | No / Optional |
| `POST` | `/api/reports` | Report inappropriate content | Bearer Token |
| `GET` | `/api/admin/overview`| Platform statistics | Admin Only |
| `GET` | `/api/admin/users` | List registered accounts | Admin Only |
| `GET` | `/api/admin/reports` | Review flagged content | Admin Only |
| `PUT` | `/api/admin/reports/:id`| Resolve or dismiss report | Admin Only |

---

## 🎓 8. Academic Project Presentation Notes

1. **Responsive Design:** Built using Bootstrap 5 fluid grid system and custom CSS variables, optimized for mobile phones, tablets, and desktop displays.
2. **Real Database Aggregations:** The Impact Dashboard calculates solid waste diversion and emissions saved dynamically from verified records in the database rather than hardcoded static text.
3. **Academic Integrity & Transparency:** All sample demonstration facilities and estimated environmental models are explicitly disclosed in the UI and footer.
