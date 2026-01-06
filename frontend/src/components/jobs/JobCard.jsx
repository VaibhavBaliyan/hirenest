import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveJob, unsaveJob } from "../../redux/slices/savedJobSlice";
import { useAuth } from "../../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

function JobCard({ job }) {
  const dispatch = useDispatch();
  const { isAuthenticated, isJobSeeker } = useAuth();
  const { savedJobIds } = useSelector((state) => state.savedJobs);
  const isSaved = savedJobIds.includes(job._id);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save jobs");
      return;
    }

    if (!isJobSeeker) {
      toast.error("Only job seekers can save jobs");
      return;
    }

    try {
      if (isSaved) {
        await dispatch(unsaveJob(job._id)).unwrap();
        toast.success("Job removed from saved list");
      } else {
        await dispatch(saveJob(job._id)).unwrap();
        toast.success("Job saved successfully!");
      }
    } catch (error) {
      toast.error(error || "Failed to update saved status");
    }
  };
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 flex-1">
              {job.title}
            </h3>
            {isJobSeeker && (
              <button
                onClick={handleSaveToggle}
                className="ml-2 text-2xl hover:scale-110 transition-transform"
                title={isSaved ? "Remove from saved" : "Save job"}
              >
                {isSaved ? "🔖" : "📑"}
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-2">
            {job.company?.companyName || "Company Name"}
          </p>
        </div>
        {job.company?.logo && (
          <img
            src={job.company.logo}
            alt={job.company.companyName}
            className="w-12 h-12 rounded-lg object-cover"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          {job.jobType}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
          📍 {job.location}
        </span>
        {job.salary?.min && job.salary?.max && (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            💰 ₹{job.salary.min.toLocaleString()} - ₹
            {job.salary.max.toLocaleString()}
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded"
          >
            {skill}
          </span>
        ))}
        {job.skills?.length > 3 && (
          <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          {job.experience?.min && job.experience?.max
            ? `${job.experience.min}-${job.experience.max} years exp`
            : "Experience not specified"}
        </span>
        <span>
          Posted{" "}
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </span>
      </div>
    </Link>
  );
}

export default JobCard;
