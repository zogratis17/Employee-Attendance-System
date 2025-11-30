const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  getTodayStatusAll,
} = require('../controllers/attendanceController');
const { protect, manager } = require('../middleware/authMiddleware');

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-history', protect, getMyHistory);
router.get('/my-summary', protect, getMySummary);
router.get('/today', protect, getTodayStatus);
router.get('/all', protect, manager, getAllAttendance);
router.get('/employee/:id', protect, manager, getEmployeeAttendance);
router.get('/summary', protect, manager, getTeamSummary);
router.get('/today-status', protect, manager, getTodayStatusAll);

module.exports = router;
