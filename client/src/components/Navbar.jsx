import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../slices/authSlice';
import { LogOut, User, LayoutDashboard, Calendar, FileText } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">AttendanceSys</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-indigo-600 flex items-center gap-2">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
                {user.role === 'employee' && (
                  <>
                    <Link to="/history" className="text-gray-700 hover:text-indigo-600 flex items-center gap-2">
                      <Calendar size={20} />
                      <span>History</span>
                    </Link>
                    <Link to="/profile" className="text-gray-700 hover:text-indigo-600 flex items-center gap-2">
                      <User size={20} />
                      <span>Profile</span>
                    </Link>
                  </>
                )}
                {user.role === 'manager' && (
                  <>
                    <Link to="/reports" className="text-gray-700 hover:text-indigo-600 flex items-center gap-2">
                      <FileText size={20} />
                      <span>Reports</span>
                    </Link>
                    <Link to="/team-calendar" className="text-gray-700 hover:text-indigo-600 flex items-center gap-2">
                      <Calendar size={20} />
                      <span>Team Calendar</span>
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-2 text-gray-700 border-l pl-4 ml-4">
                  <User size={20} />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
