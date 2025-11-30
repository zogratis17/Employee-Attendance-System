const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Get employee dashboard stats
// @route   GET /api/dashboard/employee
// @access  Private (Employee)
const getEmployeeStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const todayAttendance = await Attendance.findOne({ user: userId, date: today });
    
    const monthAttendance = await Attendance.find({
      user: userId,
      date: { $regex: `^${currentMonth}` }
    });

    const presentDays = monthAttendance.filter(a => a.status === 'present').length;
    const lateDays = monthAttendance.filter(a => a.status === 'late').length;
    const absentDays = monthAttendance.filter(a => a.status === 'absent').length;
    const totalHours = monthAttendance.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

    res.json({
      todayStatus: todayAttendance ? todayAttendance.status : 'not-checked-in',
      checkInTime: todayAttendance ? todayAttendance.checkInTime : null,
      checkOutTime: todayAttendance ? todayAttendance.checkOutTime : null,
      presentDays,
      lateDays,
      absentDays,
      totalHours: totalHours.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
const getManagerStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    
    const todayAttendance = await Attendance.find({ date: today });
    const presentCount = todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const lateCount = todayAttendance.filter(a => a.status === 'late').length;
    const absentCount = totalEmployees - presentCount;

    res.json({
      totalEmployees,
      presentCount,
      absentCount,
      lateCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getEmployeeStats, getManagerStats };
