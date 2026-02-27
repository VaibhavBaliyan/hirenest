import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { LogOut, User, Briefcase, FileText, Heart } from "lucide-react";
import { Button } from "../ui";

function Navbar() {
  const { isAuthenticated, user, isJobSeeker } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side - Logo & Primary Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                HireNest
              </span>
            </Link>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Browse Jobs
            </Link>
          </div>

          {/* Right Side - Auth Links / User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Navigation Links */}
                {isJobSeeker && (
                  <div className="hidden md:flex items-center space-x-2">
                    <Link
                      to="/my-applications"
                      className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <FileText size={16} />
                      <span>My Applications</span>
                    </Link>
                    <Link
                      to="/saved-jobs"
                      className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <Heart size={16} />
                      <span>Saved Jobs</span>
                    </Link>
                  </div>
                )}
                {user?.role === "employer" && (
                  <div className="hidden md:flex items-center space-x-2">
                    <Link
                      to="/employer/dashboard"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/employer/jobs"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      My Jobs
                    </Link>
                    <Link
                      to="/employer/company"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      My Company
                    </Link>
                  </div>
                )}

                {/* User Profile Section */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {user?.name}
                        </p>
                        <p className="text-xs text-primary-600 capitalize">
                          {user?.role}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <Button variant="primary" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
