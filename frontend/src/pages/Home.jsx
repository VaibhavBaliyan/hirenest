import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Home() {
  const { isAuthenticated, user, isEmployer, isJobSeeker } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Welcome to <span className="text-blue-600">HireNest</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            {isAuthenticated
              ? `Welcome back, ${user?.name}! Ready to ${
                  isEmployer ? "find great talent" : "find your dream job"
                }?`
              : "Find your dream job or hire the best talent. Join thousands of job seekers and employers."}
          </p>

          {!isAuthenticated && (
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Sign In
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <div className="mt-10">
              {isJobSeeker && (
                <Link
                  to="/jobs"
                  className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Browse Jobs
                </Link>
              )}
              {isEmployer && (
                <Link
                  to="/employer/jobs/create"
                  className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Post a Job
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Easy Job Search
            </h3>
            <p className="text-gray-600">
              Find jobs that match your skills and preferences with our advanced
              search filters.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 text-3xl mb-4">💼</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Top Companies
            </h3>
            <p className="text-gray-600">
              Connect with leading companies and startups looking for talented
              professionals.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quick Apply
            </h3>
            <p className="text-gray-600">
              Apply to multiple jobs with just one click using your saved
              resume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
