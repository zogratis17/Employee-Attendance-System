import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Briefcase, Hash, Calendar } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Get attendance summary
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance/my-summary`,
        config
      );
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Information Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-indigo-600">Personal Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Hash className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-medium text-gray-900">{user.employeeId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{user.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-indigo-600">This Month's Stats</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading stats...</p>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-700">{stats.presentDays}</p>
                <p className="text-sm text-gray-600">Present Days</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-700">{stats.lateDays}</p>
                <p className="text-sm text-gray-600">Late Days</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-700">{stats.absentDays}</p>
                <p className="text-sm text-gray-600">Absent Days</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-700">{stats.totalHours}</p>
                <p className="text-sm text-gray-600">Total Hours</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No stats available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
