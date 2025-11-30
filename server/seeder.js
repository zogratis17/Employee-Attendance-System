const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Attendance.deleteMany();

    const users = [
      {
        name: 'Admin Manager',
        email: 'admin@example.com',
        password: 'password123',
        role: 'manager',
        employeeId: 'MGR001',
        department: 'Management',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP001',
        department: 'Engineering',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP002',
        department: 'HR',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP003',
        department: 'Engineering',
      },
    ];

    const createdUsers = await User.create(users);
    
    // Get employee users (not managers)
    const employees = createdUsers.filter(user => user.role === 'employee');
    
    // Create sample attendance records for the past 7 days
    const attendanceRecords = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      employees.forEach((employee, index) => {
        const checkInTime = new Date(date);
        checkInTime.setHours(9 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        
        const checkOutTime = new Date(checkInTime);
        checkOutTime.setHours(checkOutTime.getHours() + 8 + Math.floor(Math.random() * 2));
        
        const duration = checkOutTime - checkInTime;
        const hours = duration / (1000 * 60 * 60);
        
        // Randomly skip some records to simulate absences
        if (Math.random() > 0.15) { // 85% attendance rate
          attendanceRecords.push({
            user: employee._id,
            date: dateString,
            checkInTime,
            checkOutTime,
            status: checkInTime.getHours() > 9 ? 'late' : 'present',
            totalHours: hours.toFixed(2),
          });
        }
      });
    }
    
    await Attendance.create(attendanceRecords);

    console.log('Data Imported!');
    console.log(`Created ${createdUsers.length} users and ${attendanceRecords.length} attendance records`);
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
