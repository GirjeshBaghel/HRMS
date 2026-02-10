<<<<<<< HEAD
# HRMS
=======
# HRMS Lite

A lightweight Human Resource Management System built with React and FastAPI.

## Overview
HRMS Lite allows administrators to:
- Manage Employee Records (Add, List, Delete)
- Track Daily Attendance (Present/Absent)
- View Attendance History
- Monitor Real-time Dashboard Statistics

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, React Query, Axios
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic
- **Database**: SQLite (default)

## Prerequisites
- Node.js (v18+)
- Python (v3.9+)

## Setup Instructions

### 1. Backend Setup
Navigate to the server directory:
```bash
cd hrms-lite/server
```

Create a virtual environment and activate it:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn server.main:app --reload
```
The API will be available at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

### 2. Frontend Setup
Navigate to the client directory:
```bash
cd hrms-lite/client
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Deployment
### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder.

### Backend (Render/Railway)
1. Push the `server` folder.
2. Ensure `requirements.txt` is present.
3. Start command: `uvicorn server.main:app --host 0.0.0.0 --port $PORT`

## License
MIT
>>>>>>> 5a784b0 (first commit)
