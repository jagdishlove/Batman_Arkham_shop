import {
  Zap,
  Shield,
  Star,
  Phone,
  Mail,
  MapPin,
  Github,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-yellow-400/20 overflow-hidden">
      {/* Keep existing background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h2 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  BATMAN'S ARMORY
                </span>
              </h2>
              <p className="text-gray-400 mt-1">Premium Combat Equipment</p>
            </Link>

            <div className="flex flex-col space-y-4 text-gray-400 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span>Gotham City, Secret Location</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-yellow-400" />
                <a
                  href="mailto:info@batmansarmory.com"
                  className="hover:text-yellow-400"
                >
                  info@batmansarmory.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-yellow-400" />
                <a href="tel:+1-888-BAT-GEAR" className="hover:text-yellow-400">
                  1-888-BAT-GEAR
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", to: "/" },
                { name: "Products", to: "/products" },
                { name: "Cart", to: "/cart" },
                { name: "Orders", to: "/orders" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-400" />
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", to: "/contact" },
                { name: "Privacy Policy", to: "/privacy" },
                { name: "Terms of Service", to: "/terms" },
                { name: "FAQ", to: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Batman's Armory. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Facebook, href: "https://facebook.com" },
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Github, href: "https://github.com" },
              ].map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
