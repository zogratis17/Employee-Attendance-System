# Employee Attendance System

A full-stack MERN application for managing employee attendance.

## 👤 Developer Information

- **Name**: Hari Prasath N T
- **College**: SNS College of Engineering, Coimbatore
- **Contact**: 9486312738

## Features

### Employee
- **Register/Login**: Secure authentication with JWT.
- **Mark Attendance**: Check-in and Check-out functionality with automatic status detection.
- **Dashboard**: View today's status, monthly summary (Present, Absent, Late, Total Hours).
- **Recent Attendance**: See last 7 days of attendance with times and status.
- **Profile Page**: View personal information and monthly statistics.
- **Attendance History**: Calendar view with month filter for easy navigation.

### Manager
- **Dashboard**: Overview with stats cards (Total Employees, Present, Absent, Late).
- **Absent Employees**: Today's absent list with employee details.
- **Charts**: Weekly attendance trend and department-wise attendance visualizations.
- **Team Calendar**: Interactive calendar showing team attendance with color coding.
- **Team Attendance**: View attendance records of all employees.
- **Advanced Reports**: Filter by date range, employee, and status. Export to CSV.

### New Enhancements ✨
- 📊 **Employee Profile Page** - Personal info and monthly stats
- 📅 **Month Filter** - Filter attendance history by month
- 🗓️ **Team Calendar View** - Visual team attendance calendar for managers
- 📈 **Dashboard Charts** - Weekly trend and department-wise attendance charts
- 👥 **Absent List** - Quick view of today's absent employees
- 🔍 **Enhanced Filters** - Date range and status filters in reports
- ⏰ **Recent Activity** - Last 7 days attendance table on dashboard

See [ENHANCEMENTS.md](ENHANCEMENTS.md) for detailed information about new features.

## Tech Stack

- **Frontend**: React, Redux Toolkit, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or use a cloud URI)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Employee-Attendance-System
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following content:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee-attendance
JWT_SECRET=your_jwt_secret
```

Seed the database with initial data (optional):
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

Start the React development server:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and go to `http://localhost:5173`.

## Default Users (from Seed)

- **Manager**: admin@example.com / password123
- **Employee 1**: john@example.com / password123
- **Employee 2**: jane@example.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in for the day
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/my-history` - Get my attendance records
- `GET /api/attendance/my-summary` - Get monthly summary
- `GET /api/attendance/today` - Get today's attendance status

### Attendance (Manager)
- `GET /api/attendance/all` - Get all employees' attendance
- `GET /api/attendance/employee/:id` - Get specific employee attendance
- `GET /api/attendance/summary` - Get team summary
- `GET /api/attendance/today-status` - Get today's status for all employees

### Dashboard
- `GET /api/dashboard/employee` - Get employee dashboard stats
- `GET /api/dashboard/manager` - Get manager dashboard stats

## Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee-attendance
JWT_SECRET=your_jwt_secret_change_this_in_production
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
Employee-Attendance-System/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── slices/         # Redux slices
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   └── ...
├── server/                 # Node.js Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Server entry point
│   └── ...
└── README.md
```