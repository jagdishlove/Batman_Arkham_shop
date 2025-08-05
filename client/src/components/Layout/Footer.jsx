import {
  Zap,
  Eye,
  Moon,
  Star,
  Shield,
  MapPin,
  Mail,
  Phone,
  Twitter,
  Facebook,
  Instagram,
  Github,
  createLucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      stroke: "none",
      fill: "currentColor",
    },
  ],
]);

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-yellow-400/20 overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="group flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-[50%]">
                  <div className="text-black text-2xl font-bold">🦇</div>
                </div>
              </div>
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  DARK KNIGHT'S
                </span>
                <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 animate-pulse" />
                  DOMAIN
                  <Moon className="h-4 w-4 text-purple-400 animate-pulse" />
                </div>
              </div>
            </Link>

            <p className="text-gray-400 max-w-md text-lg leading-relaxed mb-8 font-light">
              Your ultimate destination for legendary gear and equipment.
              <span className="text-yellow-400 font-medium">
                {" "}
                Protecting Gotham
              </span>{" "}
              through
              <span className="text-purple-400 font-medium">
                {" "}
                superior quality
              </span>{" "}
              and
              <span className="text-blue-400 font-medium">
                {" "}
                unmatched service
              </span>
              .
            </p>

            {/* Social Links */}
            <div className="flex space-x-6">
              {[
                {
                  icon: XIcon,
                  color: "text-blue-400 hover:text-blue-300",
                  to: "https://x.com/thebatmanfilm_?lang=en",
                },
                {
                  icon: Facebook,
                  color: "text-blue-500 hover:text-blue-400",
                  to: "https://www.facebook.com/batman",
                },
                {
                  icon: Instagram,
                  color: "text-pink-400 hover:text-pink-300",
                  to: "https://www.instagram.com/batman/?hl=en",
                },
                {
                  icon: Github,
                  color: "text-gray-400 hover:text-white",
                  to: "https://github.com/",
                },
              ].map(({ icon: Icon, color, to }, index) => (
                <Link
                  key={index}
                  to={to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative p-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-yellow-400/50 ${color} transition-all duration-300 hover:scale-110`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Icon className="h-5 w-5 relative z-10" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="group">
            <h3 className="font-black text-xl mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              QUICK ACCESS
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Equipment Catalog", to: "/products" },
                { name: "Mission Briefing", to: "/about" },
                { name: "Contact Oracle", to: "/contact" },
                { name: "Training Ground", to: "/training" },
                { name: "Batcave Access", to: "/vault" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="group flex items-center text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-2"
                  >
                    <Eye className="h-4 w-4 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div className="group">
            <h3 className="font-black text-xl mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              SUPPORT CENTER
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Help Database", to: "/help" },
                { name: "Return Protocol", to: "/returns" },
                { name: "Delivery Status", to: "/shipping" },
                { name: "Tech Support", to: "/support" },
                { name: "Warranty Claims", to: "/warranty" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="group flex items-center text-gray-400 hover:text-purple-400 transition-all duration-300 hover:translate-x-2"
                  >
                    <Shield className="h-4 w-4 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gradient-to-r from-transparent via-gray-700 to-transparent">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-lg">
                &copy; 2024
                <span className="text-yellow-400 font-bold mx-2">
                  Dark Knight's Domain
                </span>
                All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Protected by Wayne Enterprises Security • Gotham City License
                #001
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link
                to="/privacy"
                className="hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                to="/terms"
                className="hover:text-yellow-400 transition-colors"
              >
                Terms of Service
              </Link>
              <span>•</span>
              <Link
                to="/cookies"
                className="hover:text-yellow-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Batman symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 text-4xl opacity-5 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }}
            >
              🦇
            </div>
          ))}
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
