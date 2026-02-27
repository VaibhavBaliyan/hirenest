import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployerJobs } from "../../redux/slices/employerSlice";
import { formatDistanceToNow } from "date-fns";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  XCircle,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
} from "lucide-react";
import { Button, Badge, Card } from "../../components/ui";

function MyJobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading } = useSelector((state) => state.employer);
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployerJobs());
  }, [dispatch]);

  const handleDeleteJob = async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setActionLoading(jobId);
      await api.delete(`/api/jobs/${jobId}`);
      toast.success("Job deleted successfully");
      dispatch(fetchEmployerJobs());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseJob = async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to close this job? No new applications will be accepted.",
      )
    ) {
      return;
    }

    try {
      setActionLoading(jobId);
      await api.patch(`/api/jobs/${jobId}/close`);
      toast.success("Job closed successfully");
      dispatch(fetchEmployerJobs());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close job");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filterStatus === "all") return true;
    return job.status === filterStatus;
  });

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-gray-600 mt-1">
              Manage your posted job listings
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus size={20} />}
            onClick={() => navigate("/employer/jobs/create")}
          >
            Post New Job
          </Button>
        </div>

        {/* Filter Tabs */}
        {jobs.length > 0 && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filterStatus === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All ({jobs.length})
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filterStatus === "active"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Active ({jobs.filter((j) => j.status === "active").length})
            </button>
            <button
              onClick={() => setFilterStatus("closed")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filterStatus === "closed"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Closed ({jobs.filter((j) => j.status === "closed").length})
            </button>
          </div>
        )}

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <Card padding="lg" className="text-center">
            <div className="p-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Briefcase className="text-primary-600" size={40} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {filterStatus === "all"
                  ? "No Jobs Posted Yet"
                  : `No ${filterStatus} Jobs`}
              </h2>
              <p className="text-gray-600 mb-6">
                {filterStatus === "all"
                  ? "Start by creating your first job listing"
                  : `You don't have any ${filterStatus} jobs at the moment`}
              </p>
              {filterStatus === "all" && (
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Plus size={20} />}
                  onClick={() => navigate("/employer/jobs/create")}
                >
                  Post Your First Job
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job._id} padding="lg" className="hover:shadow-lg">
                <div className="flex justify-between items-start">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <Badge
                        variant={job.status === "active" ? "success" : "danger"}
                      >
                        {job.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} />
                        {job.jobType}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={14} />₹
                        {job.salary?.min?.toLocaleString()} - ₹
                        {job.salary?.max?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Posted{" "}
                        {formatDistanceToNow(new Date(job.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 5 && (
                          <Badge variant="outline">
                            +{job.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Application Count */}
                  <div className="ml-6 text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {job.applicationCount || 0}
                    </div>
                    <div className="text-xs text-gray-500">Applicants</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Eye size={16} />}
                    onClick={() =>
                      navigate(`/employer/jobs/${job._id}/applicants`)
                    }
                    fullWidth
                  >
                    View Applicants
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit2 size={16} />}
                    onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                    disabled={actionLoading === job._id}
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye size={16} />}
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    Preview
                  </Button>
                  {job.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<XCircle size={16} />}
                      onClick={() => handleCloseJob(job._id)}
                      disabled={actionLoading === job._id}
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    >
                      {actionLoading === job._id ? "Closing..." : "Close"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => handleDeleteJob(job._id)}
                    disabled={actionLoading === job._id}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {actionLoading === job._id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyJobs;
