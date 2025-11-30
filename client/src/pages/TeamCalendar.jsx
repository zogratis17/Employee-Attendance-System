import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const TeamCalendar = () => {
  const { user } = useSelector((state) => state.auth);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateDetails, setDateDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance/all`,
        config
      );
      setAttendance(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = moment(date).format('YYYY-MM-DD');
      const dayRecords = attendance.filter((a) => a.date === dateString);
      
      if (dayRecords.length > 0) {
        const presentCount = dayRecords.filter(a => a.status === 'present' || a.status === 'late').length;
        const totalCount = dayRecords.length;
        
        if (presentCount === totalCount) return 'bg-green-200 text-green-900 font-bold';
        if (presentCount > totalCount / 2) return 'bg-yellow-200 text-yellow-900 font-bold';
        return 'bg-red-200 text-red-900 font-bold';
      }
    }
    return null;
  };

  const onDateClick = (date) => {
    setSelectedDate(date);
    const dateString = moment(date).format('YYYY-MM-DD');
    const records = attendance.filter((a) => a.date === dateString);
    setDateDetails(records);
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Team Calendar View</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <Calendar
            className="w-full border-none"
            tileClassName={getTileClassName}
            onClickDay={onDateClick}
            value={selectedDate}
          />
          
          <div className="mt-6 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span>Full Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 rounded"></div>
              <span>Partial Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span>Low Attendance</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {moment(selectedDate).format('MMMM D, YYYY')}
          </h2>
          
          {dateDetails.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dateDetails.map((record) => (
                <div key={record._id} className="border-b pb-3 last:border-0">
                  <p className="font-medium text-gray-900">{record.user?.name}</p>
                  <p className="text-sm text-gray-500">{record.user?.employeeId}</p>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'late'
                          ? 'bg-yellow-100 text-yellow-800'
                          : record.status === 'half-day'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    <p>In: {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</p>
                    <p>Out: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</p>
                    <p>Hours: {record.totalHours || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No attendance records for this date</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCalendar;
