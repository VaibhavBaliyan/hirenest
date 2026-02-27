import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { saveJob, unsaveJob } from "../../redux/slices/savedJobSlice";
import { useAuth } from "../../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { MapPin, IndianRupee, Bookmark, Briefcase, Clock } from "lucide-react";
import { Badge, Chip } from "../ui";

/**
 * JobCard Component - Horizontal List Layout
 *
 * Displays a job listing in a compact horizontal format
 *
 * @param {Object} props
 * @param {Object} props.job - Job data object
 */
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
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link
        to={`/jobs/${job._id}`}
        className="block bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all p-5"
      >
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="shrink-0">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company?.companyName || "Company"}
                className="w-14 h-14 rounded-lg object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-primary-100 border border-primary-200 flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-primary-500" />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Company */}
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-0.5">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600">
                {job.company?.companyName || "Company Name"}
              </p>
            </div>

            {/* Skills - Wrapping row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {job.skills?.slice(0, 6).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 whitespace-nowrap"
                >
                  {skill}
                </span>
              ))}
              {job.skills?.length > 6 && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  +{job.skills.length - 6} more
                </span>
              )}
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
              {/* Job Type */}
              <Badge variant="purple" size="sm">
                {job.jobType}
              </Badge>

              {/* Location */}
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{job.location}</span>
              </div>

              {/* Posted Time */}
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>
                  {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Experience */}
              {job.experience?.min && job.experience?.max && (
                <div className="flex items-center gap-1">
                  <Briefcase size={14} />
                  <span>
                    {job.experience.min}-{job.experience.max} yrs
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Salary + Bookmark */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Bookmark Button */}
            {isJobSeeker && (
              <motion.button
                onClick={handleSaveToggle}
                whileTap={{ scale: 0.9 }}
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved
                    ? "text-primary-500 bg-primary-50"
                    : "text-gray-400 hover:text-primary-500 hover:bg-primary-50"
                }`}
                title={isSaved ? "Remove from saved" : "Save job"}
              >
                <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
              </motion.button>
            )}

            {/* Salary */}
            {job.salary?.min && job.salary?.max && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary-700 font-semibold">
                  <IndianRupee size={14} />
                  <span className="text-sm">
                    {(job.salary.min / 1000).toFixed(0)}-
                    {(job.salary.max / 1000).toFixed(0)}k
                  </span>
                </div>
                <span className="text-xs text-gray-500">per month</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default JobCard;
