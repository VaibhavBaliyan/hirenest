import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff, Briefcase, UserCircle } from "lucide-react";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/authSlice";
import api from "../utils/axios";
import { Button, Input, Card } from "../components/ui";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("jobseeker");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      role: "jobseeker",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      dispatch(loginStart());

      // Strip empty optional fields so backend .optional() validator skips them
      const payload = { ...data };
      if (!payload.phone || payload.phone.trim() === "") {
        delete payload.phone;
      }

      const response = await api.post("/api/auth/register", payload);

      dispatch(
        loginSuccess({
          user: {
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          },
          token: response.data.token,
        }),
      );

      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Registration failed";
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue("role", role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <Card padding="lg">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <Input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                error={errors.name?.message}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                error={errors.email?.message}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain uppercase, lowercase, and number",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <Input
                {...register("phone", {
                  validate: (value) => {
                    if (!value || value.trim() === "") return true;
                    return (
                      /^\d{10}$/.test(value) ||
                      "Phone must be exactly 10 digits"
                    );
                  },
                })}
                type="tel"
                autoComplete="tel"
                placeholder="9876543210"
                error={errors.phone?.message}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Job Seeker Option */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect("jobseeker")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedRole === "jobseeker"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    {...register("role")}
                    type="radio"
                    value="jobseeker"
                    className="hidden"
                  />
                  <UserCircle
                    size={32}
                    className={`mx-auto mb-2 ${
                      selectedRole === "jobseeker"
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`block text-sm font-medium ${
                      selectedRole === "jobseeker"
                        ? "text-primary-700"
                        : "text-gray-700"
                    }`}
                  >
                    Job Seeker
                  </span>
                </button>

                {/* Employer Option */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect("employer")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedRole === "employer"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    {...register("role")}
                    type="radio"
                    value="employer"
                    className="hidden"
                  />
                  <Briefcase
                    size={32}
                    className={`mx-auto mb-2 ${
                      selectedRole === "employer"
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`block text-sm font-medium ${
                      selectedRole === "employer"
                        ? "text-primary-700"
                        : "text-gray-700"
                    }`}
                  >
                    Employer
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Register;
