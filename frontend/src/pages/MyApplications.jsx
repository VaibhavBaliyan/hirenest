import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyApplications } from "../redux/slices/applicationSlice";
import { useAuth } from "../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Briefcase,
  DollarSign,
  Eye,
} from "lucide-react";
import { Button, Card, Badge } from "../components/ui";

function MyApplications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuth();
  const { applications, loading, error } = useSelector(
    (state) => state.applications,
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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "shortlisted":
        return "primary";
      case "accepted":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "shortlisted":
        return <FileText size={16} />;
      case "accepted":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 py-8 pb-24">
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
          <Card padding="xl" className="text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <FileText size={40} className="text-primary-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No Applications Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start applying to jobs to see your applications here
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/jobs")}
              >
                Browse Jobs
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card
                key={application._id}
                padding="lg"
                className="hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3
                      onClick={() => navigate(`/jobs/${application.jobId._id}`)}
                      className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer transition-colors"
                    >
                      {application.jobId.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {application.jobId.company?.companyName || "Company Name"}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">
                        <MapPin size={14} className="mr-1" />
                        {application.jobId.location}
                      </Badge>
                      <Badge variant="primary">
                        <Briefcase size={14} className="mr-1" />
                        {application.jobId.jobType}
                      </Badge>
                      {application.jobId.salary?.min &&
                        application.jobId.salary?.max && (
                          <Badge variant="success">
                            <DollarSign size={14} className="mr-1" />₹
                            {application.jobId.salary.min.toLocaleString()} - ₹
                            {application.jobId.salary.max.toLocaleString()}
                          </Badge>
                        )}
                    </div>
                  </div>
                  <Badge
                    variant={getStatusBadgeVariant(application.status)}
                    className="flex items-center gap-1.5"
                  >
                    {getStatusIcon(application.status)}
                    <span>
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </span>
                  </Badge>
                </div>

                {/* Cover Letter */}
                {application.coverLetter && (
                  <div className="mb-4 p-4 bg-primary-50 rounded-lg border border-primary-100">
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
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <Eye size={16} />
                      View Resume
                    </a>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
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
              </Card>
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
                  <div className="text-xl font-bold text-primary-600">
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
