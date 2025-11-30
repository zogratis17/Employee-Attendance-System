import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyHistory } from '../slices/attendanceSlice';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    dispatch(getMyHistory());
  }, [dispatch]);

  // Filter attendance by selected month
  const filteredAttendance = attendance.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === selectedMonth.getMonth() && 
           recordDate.getFullYear() === selectedMonth.getFullYear();
  });

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = moment(date).format('YYYY-MM-DD');
      const record = filteredAttendance.find((a) => a.date === dateString);

      if (record) {
        if (record.status === 'present') return 'bg-green-100 text-green-800 font-bold';
        if (record.status === 'absent') return 'bg-red-100 text-red-800 font-bold';
        if (record.status === 'late') return 'bg-yellow-100 text-yellow-800 font-bold';
        if (record.status === 'half-day') return 'bg-orange-100 text-orange-800 font-bold';
      }
    }
    return null;
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = moment(date).format('YYYY-MM-DD');
      const record = filteredAttendance.find((a) => a.date === dateString);

      if (record) {
        return (
          <div className="text-xs text-center mt-1">
            {record.totalHours ? `${record.totalHours}h` : ''}
          </div>
        );
      }
    }
    return null;
  };

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Attendance History</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month</label>
          <input
            type="month"
            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={moment(selectedMonth).format('YYYY-MM')}
            onChange={(e) => setSelectedMonth(new Date(e.target.value + '-01'))}
          />
        </div>
        <div className="text-sm text-gray-600">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-800"></div> Present
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-800"></div> Late
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-100 border border-orange-800"></div> Half Day
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border border-red-800"></div> Absent
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <Calendar
            className="w-full border-none"
            tileClassName={getTileClassName}
            tileContent={getTileContent}
            value={selectedMonth}
            onActiveStartDateChange={({ activeStartDate }) => setSelectedMonth(activeStartDate)}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {filteredAttendance.slice(0, 10).map((record) => (
              <div key={record._id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{record.date}</span>
                  <span
                    className={`px-2 text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'late'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>In: {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</span>
                  <span>Out: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
