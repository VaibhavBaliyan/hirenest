import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchEmployerStats,
  fetchEmployerJobs,
} from "../../redux/slices/employerSlice";
import { fetchMyCompany } from "../../redux/slices/companySlice";
import { formatDistanceToNow } from "date-fns";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    stats,
    jobs,
    loading: employerLoading,
  } = useSelector((state) => state.employer);
  const { company, loading: companyLoading } = useSelector(
    (state) => state.company
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEmployerStats());
    dispatch(fetchEmployerJobs());
    dispatch(fetchMyCompany());
  }, [dispatch]);

  const isLoading = employerLoading || companyLoading;

  if (isLoading && !stats && !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Setup Company Alert */}
        {!company && !companyLoading && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex justify-between items-center">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You haven't set up your company profile yet. You need to
                    create one before you can post jobs.
                  </p>
                </div>
              </div>
              <Link
                to="/employer/setup-company"
                className="whitespace-nowrap font-medium text-yellow-700 hover:text-yellow-600"
              >
                Set up now &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Employer Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
            {company && (
              <p className="text-sm text-gray-500 mt-1">
                Managed by: {company.companyName}
              </p>
            )}
          </div>
          <Link
            to={company ? "/employer/jobs/create" : "/employer/setup-company"}
            className={`px-6 py-3 rounded-md font-medium text-white ${
              company
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={(e) => !company && e.preventDefault()}
          >
            + Post New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats?.totalJobs || 0}
            </div>
            <div className="text-gray-600">Total Jobs Posted</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats?.activeJobs || 0}
            </div>
            <div className="text-gray-600">Active Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {stats?.totalApplications || 0}
            </div>
            <div className="text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {stats?.pendingApplications || 0}
            </div>
            <div className="text-gray-600">Pending Review</div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Jobs</h2>
            <Link
              to="/employer/jobs"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Jobs →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {jobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                You haven't posted any jobs yet.
              </div>
            ) : (
              jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <div className="flex gap-3 text-sm text-gray-600">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            job.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {job.status.toUpperCase()}
                        </span>
                        <span>{job.jobType}</span>
                        <span>{job.location}</span>
                        <span>
                          Posted{" "}
                          {formatDistanceToNow(new Date(job.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {job.applicationCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">Applicants</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/employer/jobs/${job._id}/applicants`)
                      }
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Applicants
                    </button>
                    <button
                      onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit Job
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
