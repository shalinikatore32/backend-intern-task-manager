# ✅ Task Manager

> **Task Manager** is a full-stack web application for creating, organizing, and managing tasks with **secure authentication** and **role-based access**.

---

## ⭐ Key Highlights

- 🔐 **JWT Authentication** with secure password hashing
- 🧑‍💻 **User & Admin roles** with role-based access control
- ✅ **Task CRUD:** create, view, edit, delete, and complete tasks
- 🧭 **Protected dashboard** after login
- 🎨 **Modern UI** using Next.js, Tailwind CSS & shadcn/ui
- ⚡ **FastAPI + MongoDB** backend with async I/O

---

## 🧩 Overview

**Task Manager** is built as a modern full-stack application:

- The **frontend** uses **Next.js**, **React**, **Tailwind**, and **shadcn/ui** for a clean, responsive dashboard experience.
- The **backend** is powered by **FastAPI** and **MongoDB (Motor)**, with **JWT-based auth** and robust validation using **Pydantic**.

It is designed to be:

- 🔒 **Secure**
- 🧱 **Modular**
- 📈 **Scalable**
- 👤 **User-friendly**

---

## ✨ Features

### 🔐 Authentication

- **User Registration & Login**
- **JWT-based Authentication**
- **Secure Password Hashing**
- **Auto Redirect after Login** to dashboard

---

### 📝 Task Management

- ➕ **Create** new tasks
- 👁 **View** all own tasks
- ✏️ **Edit** task title & description
- ❌ **Delete** tasks
- ✅ **Mark as completed / undo completion**

Users can only access **their own tasks**, while admins get an extended view.

---

### 🛡 Role-Based Access Control (RBAC)

| Role    | Permissions                                |
| ------- | ------------------------------------------ |
| `user`  | CRUD on own tasks only                     |
| `admin` | View **all** tasks, access admin endpoints |

- Backend enforces **role-based access** using auth dependencies.
- Frontend renders UI based on the authenticated user’s **role**.

---

## 🖥 Frontend

**Tech:**

- ⚛ **Next.js** (App Router)
- 🎨 **Tailwind CSS**
- 🧱 **shadcn/ui** components
- 🔔 **Sonner** for toast notifications
- ♻ **Reusable components** (`Header`, `Sidebar`, task list, forms)

**Highlights:**

- Protected `/dashboard` layout
- Nice UX with **toasts** for success/error feedback
- Clean form validation and state handling

---

## ⚙ Backend

**Tech:**

- 🚀 **FastAPI**
- 🐍 **Python 3.10+**
- 🍃 **MongoDB** with **Motor (async driver)**
- 🧾 **Pydantic models & schemas**
- 🔑 **JWT authentication**
- 🌐 **CORS** enabled for frontend integration

**Architecture:**

- Modular app with separated folders for:
  - `routers/`
  - `auth/`
  - `models/`
  - `schemas/`
  - `deps/`
  - `config.py`
  - `main.py`

---

## 🔗 API Summary

### 🔐 **Auth Endpoints**

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/auth/register` | Register a new user     |
| POST   | `/auth/login`    | Login & receive JWT     |
| GET    | `/auth/me`       | Get logged-in user data |

---

### ✅ **User Task Endpoints**

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | `/tasks`      | Get all user tasks |
| POST   | `/tasks`      | Create a new task  |
| PUT    | `/tasks/{id}` | Update a task      |
| DELETE | `/tasks/{id}` | Delete a task      |

---

### 🛡 **Admin Endpoints**

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/tasks/admin/all` | View all users' tasks |

## 📁 Project Structure

```bash
task-manager/
│
├── backend/
│   ├── app/
│   │   ├── __pycache__/
│   │   ├── routers/
│   │   │   └── tasks.py
|   |   |   └── users.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── deps.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── venv/
│   ├── .env
│   └── requirements.txt
│
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    │   └── api.ts
    └── .env.local


```

## 📁 Postman Collection

A complete Postman collection is included for testing all API endpoints.

- Import `task-manager-api.postman_collection.json` into Postman.
- Use `{{base_url}}` (defaults to `http://localhost:8000/api/v1`).
- Login once via `POST /auth/login` to automatically set `{{token}}` for authenticated requests.
