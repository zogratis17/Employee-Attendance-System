const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private (Employee)
const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const existingAttendance = await Attendance.findOne({ user: userId, date: today });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const checkInTime = new Date();
    const hour = checkInTime.getHours();
    
    // Determine status based on check-in time (e.g., late if after 9:30 AM)
    let status = 'present';
    if (hour > 9 || (hour === 9 && checkInTime.getMinutes() > 30)) {
      status = 'late';
    }

    const attendance = await Attendance.create({
      user: userId,
      date: today,
      checkInTime: checkInTime,
      status: status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private (Employee)
const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ user: userId, date: today });

    if (!attendance) {
      return res.status(400).json({ message: 'You have not checked in today' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOutTime = new Date();
    
    // Calculate total hours
    const duration = attendance.checkOutTime - attendance.checkInTime;
    const hours = duration / (1000 * 60 * 60);
    attendance.totalHours = parseFloat(hours.toFixed(2));
    
    // Update status to half-day if worked less than 4 hours
    if (hours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private (Employee)
const getMyHistory = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get my monthly summary
// @route   GET /api/attendance/my-summary
// @access  Private (Employee)
const getMySummary = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const attendance = await Attendance.find({
      user: req.user._id,
      date: { $regex: `^${currentMonth}` }
    });

    const presentDays = attendance.filter(a => a.status === 'present').length;
    const lateDays = attendance.filter(a => a.status === 'late').length;
    const absentDays = attendance.filter(a => a.status === 'absent').length;
    const halfDays = attendance.filter(a => a.status === 'half-day').length;
    const totalHours = attendance.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

    res.json({
      presentDays,
      lateDays,
      absentDays,
      halfDays,
      totalHours: totalHours.toFixed(2),
      totalDays: attendance.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get today's status
// @route   GET /api/attendance/today
// @access  Private (Employee)
const getTodayStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.findOne({ user: req.user._id, date: today });
    
    if (attendance) {
      res.json(attendance);
    } else {
      res.json({ status: 'not-checked-in' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all employees attendance (Manager)
// @route   GET /api/attendance/all
// @access  Private (Manager)
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({}).populate('user', 'name email employeeId department').sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get specific employee attendance (Manager)
// @route   GET /api/attendance/employee/:id
// @access  Private (Manager)
const getEmployeeAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.params.id })
      .populate('user', 'name email employeeId department')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get team summary (Manager)
// @route   GET /api/attendance/summary
// @access  Private (Manager)
const getTeamSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const todayAttendance = await Attendance.find({ date: today });
    const monthAttendance = await Attendance.find({
      date: { $regex: `^${currentMonth}` }
    });

    const presentToday = todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const lateToday = todayAttendance.filter(a => a.status === 'late').length;
    const absentToday = totalEmployees - presentToday;

    res.json({
      totalEmployees,
      presentToday,
      absentToday,
      lateToday,
      monthlyRecords: monthAttendance.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get today's status for all employees (Manager)
// @route   GET /api/attendance/today-status
// @access  Private (Manager)
const getTodayStatusAll = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.find({ date: today })
      .populate('user', 'name email employeeId department');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  getTodayStatusAll,
};
