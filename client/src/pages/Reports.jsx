import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllAttendance } from '../slices/attendanceSlice';
import { Download } from 'lucide-react';

const Reports = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    dispatch(getAllAttendance());
  }, [dispatch]);

  const filteredAttendance = attendance.filter((record) => {
    const matchStartDate = filterStartDate ? record.date >= filterStartDate : true;
    const matchEndDate = filterEndDate ? record.date <= filterEndDate : true;
    const matchEmployee = filterEmployee
      ? record.user?.name.toLowerCase().includes(filterEmployee.toLowerCase()) ||
        record.user?.employeeId.toLowerCase().includes(filterEmployee.toLowerCase())
      : true;
    const matchStatus = filterStatus ? record.status === filterStatus : true;
    return matchStartDate && matchEndDate && matchEmployee && matchStatus;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Employee Name', 'Employee ID', 'Status', 'Check In', 'Check Out', 'Total Hours'];
    const csvData = filteredAttendance.map(record => [
      record.date,
      record.user?.name,
      record.user?.employeeId,
      record.status,
      record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-',
      record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-',
      record.totalHours || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'attendance_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Reports</h1>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Employee</label>
            <input
              type="text"
              placeholder="Search name or ID..."
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              setFilterStartDate('');
              setFilterEndDate('');
              setFilterEmployee('');
              setFilterStatus('');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAttendance.map((record) => (
              <tr key={record._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {record.user?.employeeId}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.totalHours || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
