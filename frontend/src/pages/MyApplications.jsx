import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyApplications } from "../redux/slices/applicationSlice";
import { useAuth } from "../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

function MyApplications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuth();
  const { applications, loading, error } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isJobSeeker) {
      navigate("/");
      return;
    }
    dispatch(fetchMyApplications());
  }, [dispatch, isAuthenticated, isJobSeeker, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shortlisted":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "shortlisted":
        return "📋";
      case "accepted":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "📄";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track the status of your job applications
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start applying to jobs to see your applications here
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3
                      onClick={() => navigate(`/jobs/${application.jobId._id}`)}
                      className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer"
                    >
                      {application.jobId.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {application.jobId.company?.companyName || "Company Name"}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        📍 {application.jobId.location}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {application.jobId.jobType}
                      </span>
                      {application.jobId.salary?.min &&
                        application.jobId.salary?.max && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            💰 ₹{application.jobId.salary.min.toLocaleString()}{" "}
                            - ₹{application.jobId.salary.max.toLocaleString()}
                          </span>
                        )}
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-medium ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusIcon(application.status)}{" "}
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </span>
                </div>

                {/* Cover Letter */}
                {application.coverLetter && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Your Cover Letter:
                    </p>
                    <p className="text-gray-600 text-sm">
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                {/* Resume */}
                {application.resumeUrl && (
                  <div className="mb-4">
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      📄 View Resume
                    </a>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                  <span>
                    Applied{" "}
                    {formatDistanceToNow(new Date(application.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {application.updatedAt !== application.createdAt && (
                    <span>
                      Updated{" "}
                      {formatDistanceToNow(new Date(application.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary - Sticky Bottom */}
        {applications.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {applications.length}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-yellow-600">
                    {
                      applications.filter((app) => app.status === "pending")
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">
                    {
                      applications.filter((app) => app.status === "shortlisted")
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-600">Shortlisted</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {
                      applications.filter((app) => app.status === "accepted")
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-600">Accepted</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;
