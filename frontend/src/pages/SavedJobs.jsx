import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSavedJobs, unsaveJob } from "../redux/slices/savedJobSlice";
import { useAuth } from "../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { MapPin, DollarSign, Briefcase, Bookmark, X } from "lucide-react";
import { Button, Card, Badge } from "../components/ui";

function SavedJobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuth();
  const { savedJobs, loading, error } = useSelector((state) => state.savedJobs);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isJobSeeker) {
      navigate("/");
      return;
    }
    dispatch(fetchSavedJobs());
  }, [dispatch, isAuthenticated, isJobSeeker, navigate]);

  const handleUnsave = async (jobId) => {
    try {
      await dispatch(unsaveJob(jobId)).unwrap();
      toast.success("Job removed from saved list");
    } catch {
      toast.error("Failed to remove job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">
            Jobs you've saved for later ({savedJobs.length})
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Saved Jobs List */}
        {savedJobs.length === 0 ? (
          <Card padding="xl" className="text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <Bookmark size={40} className="text-primary-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No Saved Jobs Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Save jobs you're interested in to review them later
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((saved) => (
              <Card
                key={saved._id}
                padding="lg"
                className="hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3
                      onClick={() => navigate(`/jobs/${saved.jobId._id}`)}
                      className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors"
                    >
                      {saved.jobId.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {saved.jobId.company?.companyName || "Company Name"}
                    </p>
                  </div>
                  {saved.jobId.company?.logo && (
                    <img
                      src={saved.jobId.company.logo}
                      alt={saved.jobId.company.companyName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="primary">
                    <Briefcase size={14} className="mr-1" />
                    {saved.jobId.jobType}
                  </Badge>
                  <Badge variant="secondary">
                    <MapPin size={14} className="mr-1" />
                    {saved.jobId.location}
                  </Badge>
                  {saved.jobId.salary?.min && saved.jobId.salary?.max && (
                    <Badge variant="success">
                      <DollarSign size={14} className="mr-1" />₹
                      {saved.jobId.salary.min.toLocaleString()} - ₹
                      {saved.jobId.salary.max.toLocaleString()}
                    </Badge>
                  )}
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {saved.jobId.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {saved.jobId.skills?.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {saved.jobId.skills?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                      +{saved.jobId.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Saved{" "}
                    {formatDistanceToNow(new Date(saved.savedAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/jobs/${saved.jobId._id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnsave(saved.jobId._id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X size={16} />
                      <span className="ml-1">Remove</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobs;
