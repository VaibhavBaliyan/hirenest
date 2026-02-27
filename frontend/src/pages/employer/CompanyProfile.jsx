import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyCompany, updateCompany } from "../../redux/slices/companySlice";
import toast from "react-hot-toast";
import { Building2, Globe, MapPin, Edit2 } from "lucide-react";
import { Button } from "../../components/ui";

function CompanyProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { company, loading, error } = useSelector((state) => state.company);

  // Derive initial form values from company — no effect needed
  const initialFormData = useMemo(
    () => ({
      companyName: company?.companyName || "",
      website: company?.website || "",
      location: company?.location || "",
      description: company?.description || "",
      logo: company?.logo || "",
    }),
    [company],
  );

  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  // Sync form with company data whenever it changes (e.g. after fetch)
  useEffect(() => {
    setFormData(initialFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]); // intentionally depends on company, not the memoized object

  useEffect(() => {
    dispatch(fetchMyCompany());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateCompany(formData)).unwrap();
      toast.success("Company profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Failed to update company profile");
    }
  };

  if (loading && !company) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If fetched but no company returned (and not loading), redirect/show setup
  // However, check if error indicates 404
  if (!loading && !company && error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <Building2 className="text-primary-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Company Profile Found
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't set up your company profile yet.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/employer/setup-company")}
          >
            Create Company Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header / Banner */}
          <div className="bg-linear-to-r from-primary-600 to-purple-600 px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-white">
              Company Details
            </h3>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit2 size={16} />}
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6">
            {isEditing ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name *
                  </label>
                  <div className="mt-1">
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <div className="mt-1">
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <div className="mt-1">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      maxLength={1000}
                      value={formData.description}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              // View Mode
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl border border-gray-200">
                      {company?.logo ? (
                        <img
                          src={company.logo}
                          alt={company.companyName}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <span>🏢</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {company?.companyName}
                      </h2>
                      {company?.location && (
                        <p className="text-gray-500 text-sm flex items-center mt-1">
                          📍 {company.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {company?.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Globe size={16} />
                      Visit Website
                    </a>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    About Company
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {company?.description || "No description provided."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;
