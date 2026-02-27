import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

/**
 * Footer Component
 *
 * Site-wide footer with links and social media
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Browse Jobs", path: "/jobs" },
      { name: "Companies", path: "/companies" },
      { name: "Pricing", path: "/pricing" },
      { name: "Features", path: "/features" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Careers", path: "/careers" },
      { name: "Blog", path: "/blog" },
    ],
    resources: [
      { name: "Help Center", path: "/help" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
    ],
    forJobSeekers: [
      { name: "Find Jobs", path: "/jobs" },
      { name: "Job Alerts", path: "/alerts" },
      { name: "Resume Builder", path: "/resume" },
      { name: "Career Advice", path: "/advice" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, url: "#" },
    { name: "LinkedIn", icon: Linkedin, url: "#" },
    { name: "GitHub", icon: Github, url: "#" },
    { name: "Email", icon: Mail, url: "mailto:contact@hirenest.com" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-primary-400">
                HireNest
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted platform for finding dream jobs and top talent. Join
              thousands of professionals building their future.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Job Seekers Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              {footerLinks.forJobSeekers.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} HireNest. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
