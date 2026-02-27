import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerCompany } from "../../redux/slices/companySlice";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";
import { Button, Card, Input } from "../../components/ui";

function CreateCompany() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerCompany(formData)).unwrap();
      toast.success("Company profile created successfully! 🎉");
      navigate("/employer/dashboard");
    } catch (error) {
      toast.error(error || "Failed to create company profile");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Building2 className="text-primary-600" size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Company Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us about your company to start posting jobs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card padding="lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Company Name *
              </label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Website
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description (Max 1000 characters)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                maxLength={1000}
                value={formData.description}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors sm:text-sm"
                placeholder="Briefly describe what your company does..."
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                fullWidth
              >
                {loading ? "Creating..." : "Create Profile"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default CreateCompany;
