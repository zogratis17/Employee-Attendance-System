# Employee Attendance System - Quick Start Guide

## Prerequisites
1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
   - Make sure MongoDB is running on `mongodb://localhost:27017`
   - Or use MongoDB Atlas (cloud) and update the MONGO_URI in .env

## Installation Steps

### Option 1: Install Everything at Once
```powershell
npm run install-all
```

### Option 2: Manual Installation

#### 1. Install Server Dependencies
```powershell
cd server
npm install
```

#### 2. Install Client Dependencies
```powershell
cd client
npm install
```

## Configuration

### 1. Setup Server Environment
Create or verify `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee-attendance
JWT_SECRET=attendance_system_jwt_secret_key_2025_change_in_production
```

### 2. Setup Client Environment
Create or verify `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Seed Database (Optional but Recommended)

This creates sample users and attendance records:
```powershell
cd server
npm run seed
```

**Default Users Created:**
- Manager: `admin@example.com` / `password123`
- Employee 1: `john@example.com` / `password123`
- Employee 2: `jane@example.com` / `password123`
- Employee 3: `bob@example.com` / `password123`

## Running the Application

### Option 1: Run Both Servers Together (Recommended)
From the root directory:
```powershell
npm start
```

### Option 2: Run Servers Separately

#### Terminal 1 - Backend Server
```powershell
cd server
npm run dev
```
Server will start on: http://localhost:5000

#### Terminal 2 - Frontend Client
```powershell
cd client
npm run dev
```
Client will start on: http://localhost:5173

## Testing the Application

1. Open browser to: http://localhost:5173
2. Login with one of the default accounts
3. Test employee features:
   - Check In/Check Out
   - View attendance history
   - View dashboard stats
4. Test manager features:
   - View all employees' attendance
   - Filter and export reports
   - View team dashboard

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:** Make sure MongoDB is running:
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# Or start MongoDB manually
mongod
```

### Issue: Port Already in Use
**Solution:** Change ports in environment files:
- Backend: Update `PORT` in `server/.env`
- Frontend: Update in `client/vite.config.js`

### Issue: Tailwind CSS Not Working
**Solution:** Already fixed! We're using `@tailwindcss/postcss` plugin.

### Issue: CORS Errors
**Solution:** Backend already has CORS enabled. Check that VITE_API_URL is correct.

## Project Structure
```
Employee-Attendance-System/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Navbar, ProtectedRoute
│   │   ├── pages/          # Login, Register, Dashboard, History, Reports
│   │   ├── slices/         # Redux (auth, attendance)
│   │   └── store.js
│   └── .env
├── server/                 # Node.js Backend
│   ├── controllers/        # Business logic
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth middleware
│   └── .env
├── package.json            # Root scripts
└── README.md
```

## Features Overview

### Employee Role
✅ Register & Login
✅ Mark Attendance (Check In/Out)
✅ View Attendance History (Calendar View)
✅ View Monthly Summary
✅ Dashboard with Stats

### Manager Role
✅ Login
✅ View All Employees Attendance
✅ Filter by Date & Employee
✅ Export Reports to CSV
✅ Team Dashboard with Stats
✅ View Today's Status

## Tech Stack
- **Frontend**: React, Redux Toolkit, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Chart.js, React-Chartjs-2
- **Calendar**: React-Calendar

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (Protected)

### Attendance Endpoints (Employee)
- `POST /attendance/checkin` - Check in
- `POST /attendance/checkout` - Check out
- `GET /attendance/my-history` - Get my attendance
- `GET /attendance/my-summary` - Monthly summary
- `GET /attendance/today` - Today's status

### Attendance Endpoints (Manager)
- `GET /attendance/all` - All employees' attendance
- `GET /attendance/employee/:id` - Specific employee
- `GET /attendance/summary` - Team summary
- `GET /attendance/today-status` - Today's team status

### Dashboard Endpoints
- `GET /dashboard/employee` - Employee stats
- `GET /dashboard/manager` - Manager stats

## Next Steps for Production

1. **Security**:
   - Change JWT_SECRET to a strong random string
   - Add rate limiting
   - Add input validation
   - Enable HTTPS

2. **Database**:
   - Use MongoDB Atlas for cloud database
   - Add database backups
   - Add indexes for better performance

3. **Deployment**:
   - Deploy backend to Heroku/Railway/Render
   - Deploy frontend to Vercel/Netlify
   - Update VITE_API_URL to production URL

4. **Features to Add**:
   - Email notifications
   - Leave management
   - Overtime tracking
   - Department-wise reports
   - User profile editing

## Support

For issues, check:
1. MongoDB is running
2. All npm packages are installed
3. Environment variables are correct
4. Ports 5000 and 5173 are available
