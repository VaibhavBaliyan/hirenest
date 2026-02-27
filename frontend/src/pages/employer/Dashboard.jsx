import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchEmployerStats,
  fetchEmployerJobs,
} from "../../redux/slices/employerSlice";
import { fetchMyCompany } from "../../redux/slices/companySlice";
import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  Users,
  Clock,
  Plus,
  Eye,
  Edit2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button, Card, Badge } from "../../components/ui";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    stats,
    jobs,
    loading: employerLoading,
  } = useSelector((state) => state.employer);
  const { company, loading: companyLoading } = useSelector(
    (state) => state.company,
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
      <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Setup Company Alert */}
        {!company && !companyLoading && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex">
                <div className="shrink-0">
                  <AlertCircle className="text-yellow-600" size={24} />
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
                Set up now →
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
          <Button
            variant={company ? "primary" : "secondary"}
            size="md"
            leftIcon={<Plus size={20} />}
            onClick={() =>
              navigate(
                company ? "/employer/jobs/create" : "/employer/setup-company",
              )
            }
            disabled={!company}
          >
            Post New Job
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card padding="lg" className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Briefcase className="text-primary-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {stats?.totalJobs || 0}
            </div>
            <div className="text-gray-600 text-sm">Total Jobs Posted</div>
          </Card>

          <Card padding="lg" className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats?.activeJobs || 0}
            </div>
            <div className="text-gray-600 text-sm">Active Jobs</div>
          </Card>

          <Card padding="lg" className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {stats?.totalApplications || 0}
            </div>
            <div className="text-gray-600 text-sm">Total Applications</div>
          </Card>

          <Card padding="lg" className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {stats?.pendingApplications || 0}
            </div>
            <div className="text-gray-600 text-sm">Pending Review</div>
          </Card>
        </div>

        {/* Recent Jobs */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <h2 className="text-xl font-semibold text-gray-800">Recent Jobs</h2>
            <Link
              to="/employer/jobs"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
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
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex gap-3 text-sm text-gray-600 flex-wrap items-center">
                        <Badge
                          variant={
                            job.status === "active" ? "success" : "danger"
                          }
                        >
                          {job.status.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary">
                          <Briefcase size={14} className="mr-1" />
                          {job.jobType}
                        </Badge>
                        <span className="text-gray-500">{job.location}</span>
                        <span className="text-gray-500">
                          Posted{" "}
                          {formatDistanceToNow(new Date(job.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {job.applicationCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">Applicants</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye size={16} />}
                      onClick={() =>
                        navigate(`/employer/jobs/${job._id}/applicants`)
                      }
                    >
                      View Applicants
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit2 size={16} />}
                      onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                    >
                      Edit Job
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
