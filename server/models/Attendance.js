const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half-day'],
      default: 'absent',
    },
    totalHours: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
