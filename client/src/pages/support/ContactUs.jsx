import { useState } from "react";
import { Mail, Phone, MapPin, Send, Shield, AlertTriangle } from "lucide-react";
import { batmanToast } from "@/utils/toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    const loadingToast = batmanToast.loading(
      "Transmitting message to Batcave..."
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      batmanToast.success("Message received successfully", {
        id: loadingToast,
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      batmanToast.error("Communication failed", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              CONTACT THE BATCAVE
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Shield className="h-6 w-6 text-yellow-400" />
                <span>Secure Communication</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Location</h3>
                    <p className="text-gray-400">
                      Gotham City, Secret Location
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <a
                      href="mailto:support@batmansarmory.com"
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      support@batmansarmory.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Emergency Line</h3>
                    <a
                      href="tel:+1-888-BAT-GEAR"
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      1-888-BAT-GEAR
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  All communications are encrypted and protected by Wayne
                  Enterprises security protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Code Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-yellow-400/50 transition-colors"
                placeholder="Enter your code name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secure Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-yellow-400/50 transition-colors"
                placeholder="Enter your secure email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-yellow-400/50 transition-colors"
                placeholder="Enter message subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows={6}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-yellow-400/50 transition-colors resize-none"
                placeholder="Enter your encrypted message"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 text-black"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  SENDING...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  SEND MESSAGE
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
