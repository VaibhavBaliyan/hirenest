import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Button, Card } from "../components/ui";
import TypingHero from "../components/animations/TypingHero";
import Footer from "../components/layout/Footer";
import {
  Search,
  Briefcase,
  Zap,
  TrendingUp,
  Users,
  Award,
  Code2,
  Palette,
  BarChart2,
  Database,
  Shield,
  Globe,
  UserCheck,
  FileText,
  CheckCircle,
} from "lucide-react";

function Home() {
  const { isAuthenticated, user, isEmployer, isJobSeeker } = useAuth();

  const features = [
    {
      icon: Search,
      title: "Easy Job Search",
      description:
        "Find jobs that match your skills and preferences with our advanced search filters.",
      color: "text-primary-500",
    },
    {
      icon: Briefcase,
      title: "Top Companies",
      description:
        "Connect with leading companies and startups looking for talented professionals.",
      color: "text-purple-500",
    },
    {
      icon: Zap,
      title: "Quick Apply",
      description:
        "Apply to multiple jobs with just one click using your saved resume.",
      color: "text-primary-600",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description:
        "Access resources and opportunities to accelerate your professional development.",
      color: "text-indigo-500",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Join thousands of job seekers and employers building their future together.",
      color: "text-violet-500",
    },
    {
      icon: Award,
      title: "Quality Jobs",
      description:
        "Every job is verified to ensure you're applying to legitimate opportunities.",
      color: "text-fuchsia-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Typing Hero */}
          <TypingHero
            staticText={
              isAuthenticated
                ? `Welcome back, ${user?.name}! `
                : "Find your dream "
            }
            phrases={
              isAuthenticated && isEmployer
                ? [
                    "Great Talent",
                    "Top Developers",
                    "Skilled Professionals",
                    "Amazing Team Members",
                  ]
                : [
                    "Tech Job",
                    "Frontend Role",
                    "Backend Position",
                    "Full Stack Career",
                    "UI/UX Role",
                  ]
            }
            className="mb-8"
          />

          <motion.p
            className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {isAuthenticated
              ? `Ready to ${isEmployer ? "find great talent" : "explore new opportunities"}?`
              : "Join thousands of job seekers and employers building their future together."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {!isAuthenticated && (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                {isJobSeeker && (
                  <Link to="/jobs">
                    <Button
                      variant="primary"
                      size="lg"
                      leftIcon={<Search size={20} />}
                    >
                      Browse Jobs
                    </Button>
                  </Link>
                )}
                {isEmployer && (
                  <Link to="/employer/jobs/create">
                    <Button
                      variant="primary"
                      size="lg"
                      leftIcon={<Briefcase size={20} />}
                    >
                      Post a Job
                    </Button>
                  </Link>
                )}
              </>
            )}
          </motion.div>

          {/* Stats */}
          {!isAuthenticated && (
            <motion.div
              className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div>
                <div className="text-4xl font-bold text-primary-600">10K+</div>
                <div className="text-gray-600 mt-2">Active Jobs</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">5K+</div>
                <div className="text-gray-600 mt-2">Companies</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">50K+</div>
                <div className="text-gray-600 mt-2">Job Seekers</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary-500">HireNest</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to find your next opportunity or hire the
              perfect candidate
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card padding="lg" hoverable>
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4`}
                      >
                        <IconComponent className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Job Categories Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by <span className="text-primary-500">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect role in your area of expertise
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, staggerChildren: 0.08 }}
          >
            {[
              {
                icon: Code2,
                label: "Technology",
                color: "text-primary-600",
                bg: "bg-primary-50",
                query: "developer",
              },
              {
                icon: Palette,
                label: "Design",
                color: "text-pink-600",
                bg: "bg-pink-50",
                query: "designer",
              },
              {
                icon: BarChart2,
                label: "Marketing",
                color: "text-orange-600",
                bg: "bg-orange-50",
                query: "marketing",
              },
              {
                icon: Database,
                label: "Data",
                color: "text-blue-600",
                bg: "bg-blue-50",
                query: "data",
              },
              {
                icon: Shield,
                label: "Security",
                color: "text-green-600",
                bg: "bg-green-50",
                query: "security",
              },
              {
                icon: Globe,
                label: "Remote",
                color: "text-violet-600",
                bg: "bg-violet-50",
                query: "remote",
              },
            ].map(({ icon: Icon, label, color, bg, query }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link to={`/jobs?keyword=${query}`}>
                  <div
                    className={`${bg} rounded-2xl p-5 text-center cursor-pointer border-2 border-transparent hover:border-primary-200 transition-all duration-300 shadow-sm hover:shadow-md`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} mb-3 border border-white shadow-sm`}
                    >
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div className="font-semibold text-gray-800 text-sm">
                      {label}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It <span className="text-primary-500">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in minutes — land your dream job in 3 simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line — step label ~20px + mb-3 (12px) + half circle (40px) = 72px from top */}
          <div
            className="hidden md:block absolute h-0.5 bg-linear-to-r from-primary-200 via-primary-400 to-primary-200"
            style={{
              top: "72px",
              left: "calc(16.67% + 40px)",
              right: "calc(16.67% + 40px)",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {[
              {
                step: "01",
                icon: UserCheck,
                title: "Create Your Profile",
                desc: "Sign up in seconds. Add your skills, experience, and upload your resume to instantly stand out to employers.",
              },
              {
                step: "02",
                icon: Search,
                title: "Browse & Apply",
                desc: "Search thousands of verified jobs. Use smart filters to find the perfect match and apply with one click.",
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Get Hired",
                desc: "Track your applications in real time. Get shortlisted, complete interviews, and start your new role.",
              },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Step badge — clearly above the circle in normal flow */}
                <div className="text-xs font-bold text-primary-500 tracking-[0.2em] uppercase mb-3">
                  Step {step}
                </div>

                {/* Circle icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-200 mb-6 relative z-10">
                  <Icon className="w-9 h-9 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {!isAuthenticated && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/register">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-linear-to-r from-primary-500 to-purple-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Join HireNest today and take the next step in your career
                journey
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-white/10 text-white hover:bg-white/20 border border-white/40"
                  >
                    Explore Jobs
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
