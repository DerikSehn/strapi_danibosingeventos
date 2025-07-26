# Chef Daniela Bosing - Event Management Platform

This is a comprehensive full-stack platform developed for Chef Daniela Bosing, designed to digitize and automate the management of her gastronomic events. The application includes a public-facing website for client acquisition and a robust administrative dashboard for managing quotes, orders, and clients.

## 📋 Table of Contents

-   [Architecture Overview](#-architecture-overview)
-   [Technologies Used](#-technologies-used)
-   [Core Features](#-core-features)
-   [File Structure](#-file-structure)
-   [Authentication Flow](#-authentication-flow)
-   [Security](#-security)
-   [Getting Started](#-getting-started)
-   [Environment Variables](#-environment-variables)
-   [Next Steps](#-next-steps)

## 🏗️ Architecture Overview

The project follows a modern **separation of concerns** architecture, featuring a decoupled frontend and a headless backend, ensuring scalability, security, and maintainability.

-   **Frontend (Next.js 15):** A responsive and high-performance web application built with the **App Router**. It utilizes **Server-Side Rendering (SSR)** for public-facing pages (SEO optimized) and **Client-Side Rendering (CSR)** for the interactive dashboard. Communication with the backend is handled via **Server Actions** and direct REST API calls.

-   **Backend (Strapi v5):** A **Headless CMS** that serves as the data and business logic hub. It exposes a secure REST API for the frontend and manages all content, users, and permissions.

-   **Database:** PostgreSQL, offering robustness and reliability for the application's data.

-   **Hosting:** The application is configured to be hosted on a VPS (Virtual Private Server), providing full control over the production environment.

## 🛠️ Technologies Used

| Category              | Technologies                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| **Frontend**          | `Next.js 15`, `React 19`, `TypeScript`, `Tailwind CSS`                                                    |
| **Backend**           | `Strapi 5`, `Node.js`                                                                                   |
| **Database**          | `PostgreSQL`                                                                                            |
| **UI & Components**   | `Shadcn/UI`, `Radix UI`, `Framer Motion`                                                                |
| **Global State**      | `Zustand`                                                                                               |
| **Forms**             | `React Hook Form` + `Zod` (for schema validation)                                                       |
| **API Communication** | `Server Actions`, `Fetch API`                                                                           |
| **Authentication**    | `JWT (JSON Web Tokens)`                                                                                 |
| **Icons**             | `Lucide React`                                                                                          |

## ✨ Core Features

### Public Website

-   **Contact Page:** A form for sending messages directly to the Chef's email, with validation and spam protection.
-   **Product Showcase:** A gallery of available dishes and services.
-   **Fixed WhatsApp Button:** Quick access for direct contact.

### Administrative Dashboard

-   **Secure Authentication:** Login and registration system with JWT and `httpOnly` cookies.
-   **Route Protection:** Dashboard access is restricted to authenticated users via middleware.
-   **Main Dashboard:** An overview with key business metrics, such as total orders, revenue, and recent activities.
-   **Profile Management:** Users can view and edit their information.
-   **System Settings:** A panel to adjust notification preferences, appearance, and business information.
-   **Responsive Design:** A fully adaptive interface for desktops, tablets, and mobile devices.

## 📁 File Structure

The project structure is organized to promote modularity and clarity.

```
.
├── backend/      # Strapi Project (Headless CMS)
│   ├── config/
│   ├── src/
│   │   └── api/  # Custom endpoints (e.g., contact)
│   └── ...
└── frontend/     # Next.js Project
    ├── app/
    │   ├── (public)/       # Public routes
    │   │   ├── contact/
    │   │   └── ...
    │   ├── (auth)/         # Authentication routes
    │   │   ├── signin/
    │   │   └── signup/
    │   ├── dashboard/      # Protected routes
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── ...
    │   ├── layout.tsx
    │   └── middleware.ts   # Authentication middleware
    ├── components/
    │   ├── auth/
    │   ├── providers/
    │   └── ui/
    ├── data/
    │   ├── actions/        # Server Actions
    │   └── services/       # API call functions
    └── lib/
        ├── hooks/
        └── store/          # Zustand stores
```

## 🔐 Authentication Flow

The authentication system is designed with a focus on security and user experience.

1.  **Login/Registration:** The user enters their credentials. The data is validated on the frontend with `Zod` and sent to the Strapi backend via a **Server Action**.
2.  **JWT Generation:** Strapi validates the credentials and, if correct, generates a JWT.
3.  **Secure Storage:** The Server Action receives the JWT and stores it in an `httpOnly` cookie, which cannot be accessed by client-side scripts, preventing XSS attacks.
4.  **Route Protection:** The `middleware.ts` intercepts all requests. If a user tries to access a dashboard route (`/dashboard/*`) without a valid JWT, they are redirected to the login page.
5.  **Session Verification:** The `useAuth` hook verifies the token's validity on the server-side when the application loads, keeping the authentication state synchronized.
6.  **Logout:** The logout action removes the JWT cookie, invalidating the user's session.

## 🛡️ Security

-   **httpOnly Cookies:** Prevents the JWT from being accessed by malicious JavaScript.
-   **Input Validation:** `Zod` ensures that only valid data reaches the server.
-   **Middleware:** Acts as a gatekeeper for protected routes.
-   **Rate Limiting:** The contact API in the backend has a policy to limit the number of requests, preventing brute-force or spam attacks.
-   **Environment Variables:** Sensitive keys and URLs are stored securely.

## 🚀 Getting Started

Follow the steps below to set up and run the local development environment.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20 or higher)
-   [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
-   [PostgreSQL](https://www.postgresql.org/) installed and running

### 1. Set Up the Backend (Strapi)

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create a .env file and configure the database variables
# (see the .env.example file)

# 4. Start the Strapi server in development mode
npm run develop
```

Access `http://localhost:1337/admin` to create the first admin user and configure permissions.

### 2. Set Up the Frontend (Next.js)

```bash
# 1. In a new terminal, navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Create a .env.local file and configure the variables
# (see the section below)

# 4. Start the development server
npm run dev
```

Access `http://localhost:3000` to see the application running.

## 🔑 Environment Variables

Create a `.env.local` file in the `frontend` folder with the following content:

```env
# URL of your Strapi backend
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# (Optional) API token for accessing public endpoints, if needed
NEXT_API_TOKEN=your_token_here
```

## 🔮 Next Steps

-   [ ] Implement a password recovery feature.
-   [ ] Add unit and integration tests.
-   [ ] Implement a notification system (Toast) for user feedback.
-   [ ] Develop the inventory and quote management modules in the dashboard.
-   [ ] Optimize images with the `next/image` component.

---

Made with ❤️ by [Dérik Sehn](https://github.com/DerikSehn)
