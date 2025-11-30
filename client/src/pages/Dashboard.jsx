import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  checkIn,
  checkOut,
  getTodayStatus,
  getAllAttendance,
} from '../slices/attendanceSlice';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, Users, AlertCircle } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { todayStatus, attendance, isLoading } = useSelector(
    (state) => state.attendance
  );
  const [stats, setStats] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [absentEmployees, setAbsentEmployees] = useState([]);
  const [weeklyData, setWeeklyData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);

  useEffect(() => {
    if (user.role === 'employee') {
      dispatch(getTodayStatus());
      fetchEmployeeStats();
    } else {
      dispatch(getAllAttendance());
      fetchManagerStats();
    }
  }, [dispatch, user.role]);

  const fetchEmployeeStats = async () => {
    try {
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/employee`,
        config
      );
      setStats(response.data);
      
      // Get recent 7 days attendance
      const historyResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance/my-history`,
        config
      );
      setRecentAttendance(historyResponse.data.slice(0, 7));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchManagerStats = async () => {
    try {
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/manager`,
        config
      );
      setStats(response.data);
      
      // Get today's attendance to find absent employees
      const todayResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance/today-status`,
        config
      );
      
      // Get all employees
      const usersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        config
      );
      
      // Find employees who didn't check in
      const presentEmployeeIds = todayResponse.data.map(a => a.user._id);
      // For now, we'll use the attendance data to show who's absent
      setAbsentEmployees(todayResponse.data.filter(a => a.status === 'absent'));
      
      // Fetch weekly attendance data for chart (last 7 days)
      const weeklyResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance/all?days=7`,
        config
      );
      
      // Process weekly data - group by date
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }
      
      const weeklyStats = last7Days.map(date => {
        const dayRecords = weeklyResponse.data.filter(r => r.date === date);
        return {
          date,
          present: dayRecords.filter(r => r.status === 'present').length,
          late: dayRecords.filter(r => r.status === 'late').length,
          absent: response.data.totalEmployees - dayRecords.length,
        };
      });
      
      setWeeklyData({
        labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
          {
            label: 'Present',
            data: weeklyStats.map(d => d.present),
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
          },
          {
            label: 'Late',
            data: weeklyStats.map(d => d.late),
            backgroundColor: 'rgba(234, 179, 8, 0.7)',
          },
          {
            label: 'Absent',
            data: weeklyStats.map(d => d.absent),
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
          },
        ],
      });
      
      // Process department-wise data
      const deptMap = {};
      weeklyResponse.data.forEach(record => {
        const dept = record.user?.department || 'Unknown';
        if (!deptMap[dept]) {
          deptMap[dept] = { present: 0, late: 0, absent: 0 };
        }
        if (record.status === 'present') deptMap[dept].present++;
        else if (record.status === 'late') deptMap[dept].late++;
      });
      
      const departments = Object.keys(deptMap);
      setDepartmentData({
        labels: departments,
        datasets: [
          {
            label: 'Present',
            data: departments.map(d => deptMap[d].present),
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
          },
          {
            label: 'Late',
            data: departments.map(d => deptMap[d].late),
            backgroundColor: 'rgba(234, 179, 8, 0.7)',
          },
        ],
      });
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckIn = () => {
    dispatch(checkIn()).then(() => {
      fetchEmployeeStats();
    });
  };

  const handleCheckOut = () => {
    dispatch(checkOut()).then(() => {
      fetchEmployeeStats();
    });
  };

  if (isLoading && !stats) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user.name}
      </h1>

      {user.role === 'employee' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Dashboard */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="text-indigo-600" />
                Today's Action
              </h2>
              <div className="flex flex-col items-center justify-center h-48">
                {todayStatus?.status === 'present' && !todayStatus?.checkOutTime ? (
                  <div className="text-center">
                    <p className="text-lg mb-4 text-green-600 font-medium">
                      You are currently checked in
                    </p>
                    <button
                      onClick={handleCheckOut}
                      className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors font-bold text-lg"
                    >
                      Check Out
                    </button>
                  </div>
                ) : todayStatus?.checkOutTime ? (
                  <div className="text-center">
                    <p className="text-lg text-gray-600 font-medium flex items-center gap-2">
                      <CheckCircle className="text-green-500" />
                      You have completed work for today
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg mb-4 text-gray-600">
                      You haven't checked in yet
                    </p>
                    <button
                      onClick={handleCheckIn}
                      className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors font-bold text-lg"
                    >
                      Check In
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
              {stats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Present Days</p>
                    <p className="text-2xl font-bold text-green-700">
                      {stats.presentDays}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Absent Days</p>
                    <p className="text-2xl font-bold text-red-700">
                      {stats.absentDays}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Late Days</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {stats.lateDays}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Hours</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {stats.totalHours}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Attendance (Last 7 Days) */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Attendance (Last 7 Days)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAttendance && recentAttendance.length > 0 ? (
                    recentAttendance.map((record) => (
                      <tr key={record._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.checkInTime
                            ? new Date(record.checkInTime).toLocaleTimeString()
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.checkOutTime
                            ? new Date(record.checkOutTime).toLocaleTimeString()
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.totalHours || 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No recent attendance records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Manager Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalEmployees || 0}
                  </p>
                </div>
                <Users className="text-indigo-600" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Present Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.presentCount || 0}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Absent Today</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats?.absentCount || 0}
                  </p>
                </div>
                <XCircle className="text-red-600" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Late Today</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats?.lateCount || 0}
                  </p>
                </div>
                <AlertCircle className="text-yellow-600" size={32} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Today's Attendance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance &&
                    attendance.slice(0, 5).map((record) => (
                      <tr key={record._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {record.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              record.status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : record.status === 'late'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.checkInTime
                            ? new Date(record.checkInTime).toLocaleTimeString()
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.checkOutTime
                            ? new Date(record.checkOutTime).toLocaleTimeString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Absent Employees Today */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <XCircle className="text-red-600" />
              Absent Employees Today
            </h2>
            {absentEmployees && absentEmployees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {absentEmployees.map((employee) => (
                  <div key={employee._id} className="border border-red-200 bg-red-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <XCircle className="text-red-500 mt-1" size={20} />
                      <div>
                        <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-600">ID: {employee.employeeId}</p>
                        <p className="text-sm text-gray-600">{employee.department}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No employees are absent today! 🎉
              </p>
            )}
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Attendance Trend */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Weekly Attendance Trend</h2>
              {weeklyData ? (
                <Bar
                  data={weeklyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-center text-gray-500 py-8">Loading chart data...</p>
              )}
            </div>
            
            {/* Department-wise Attendance */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Department-wise Attendance</h2>
              {departmentData ? (
                <Bar
                  data={departmentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-center text-gray-500 py-8">Loading chart data...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
