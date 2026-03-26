# 🚀 MediCare Scheduler

A full-stack **Hospital Patient Scheduling Simulator** that demonstrates classic Operating System scheduling algorithms like **FCFS** and **SJF** with an interactive UI.

---

## Live Website is on 
https://medi-care-scheduler.vercel.app/

## 📌 Features

- 🏥 Patient Intake & Triage System
- ⚡ Scheduling Algorithms:

  - First Come First Served (FCFS)
  - Shortest Job First (SJF)

- 📊 Gantt Chart Visualization
- 🔄 Real-time Simulation
- 🚨 Emergency Patient Handling
- 🌐 Full-stack app (Frontend served via Backend)
- ⚡ Optional C++ Engine for high performance

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Optional:** C++ (for optimized scheduling execution)

---

## 📁 Project Structure

```
MEDICARE/
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── server.ts
│   ├── scheduler.cpp
│   ├── scheduler.exe
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Prerequisites

### 🔹 Required

- [Node.js (LTS Version)](https://nodejs.org?utm_source=chatgpt.com)

### 🔹 Optional

- C++ Compiler (g++, MinGW)

---

## 🚀 Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-link>
cd MEDICARE
```

---

### 2️⃣ Install Dependencies

```bash
cd backend
npm install
```

---

### 3️⃣ Configure Environment

Create a `.env` file inside `backend/`:

```env
PORT=3000
NODE_ENV=development
```

---

### 4️⃣ Run the Application

```bash
npm run dev
```

---

## 🌐 Access the Application

Open your browser:

```
http://localhost:3000
```

---

## 🧠 How It Works

- Express server runs on **port 3000**
- In development:

  - Vite middleware serves the React frontend

- In production:

  - Static frontend is served from `/frontend/dist`

- Backend APIs handle scheduling logic

---

## 📡 API Endpoints

| Endpoint        | Description               |
| --------------- | ------------------------- |
| `/api/health`   | Check server status       |
| `/api/schedule` | Run scheduling simulation |

---

## 🧪 Example Input

| Patient | Arrival Time | Duration |
| ------- | ------------ | -------- |
| P1      | 0            | 5        |
| P2      | 1            | 3        |
| P3      | 2            | 8        |
| P4      | 3            | 6        |

---

## 🐞 Troubleshooting

### ❌ Backend not running

```bash
cd backend
npm run dev
```

---

### ❌ App not loading

Check:

```
http://localhost:3000/api/health
```

---

### ❌ Port already in use

Update `.env`:

```env
PORT=3001
```

Then open:

```
http://localhost:3001
```

---

## ⚡ C++ Engine (Optional)

- If a C++ compiler is installed:

  - `scheduler.cpp` will be used automatically

- Otherwise:

  - Node.js fallback is used

---

## 📦 Scripts

```bash
npm run dev     # Start full-stack server
```

---

## 🎯 Future Improvements

- Round Robin Scheduling
- Priority Scheduling
- Database Integration
- Authentication System
- Deployment (Render / Vercel)

---

## 👨‍💻 Author

**Abhishek Dhariyal**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
