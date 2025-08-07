import { Shield, Lock, Eye, User, Database, Clock } from "lucide-react";

const Privacy = () => {
  const policies = [
    {
      icon: Shield,
      title: "Security Measures",
      description:
        "Your data is protected by Wayne Enterprises' state-of-the-art security protocols and encryption technology.",
    },
    {
      icon: Lock,
      title: "Data Protection",
      description:
        "All personal information is stored in secure, fortified servers with multiple layers of encryption.",
    },
    {
      icon: Eye,
      title: "Data Collection",
      description:
        "We collect only essential information needed to process your orders and improve your equipment acquisition experience.",
    },
    {
      icon: User,
      title: "Personal Information",
      description:
        "Your identity is protected with the same level of security used to protect the Batman's secret identity.",
    },
    {
      icon: Database,
      title: "Data Storage",
      description:
        "Information is stored in our secure Batcomputer system, protected by advanced firewall technology.",
    },
    {
      icon: Clock,
      title: "Data Retention",
      description:
        "Your data is retained only for the duration necessary to support your vigilante activities.",
    },
  ];

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
              PRIVACY POLICY
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your privacy is protected with the same dedication we protect Gotham
            City
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mt-8"></div>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                  <policy.icon className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {policy.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Lock className="h-6 w-6 text-yellow-400" />
            Additional Security Measures
          </h2>

          <div className="space-y-4 text-gray-400">
            <p>
              At Batman's Armory, we take your privacy as seriously as we take
              the protection of Gotham City. Our security measures are
              continuously updated to maintain the highest level of protection
              for your personal information.
            </p>
            <p>
              We employ advanced encryption protocols and secure transmission
              methods to ensure that your data remains confidential and
              protected from unauthorized access.
            </p>
            <p>
              For any privacy-related concerns, please contact our security team
              through secure channels provided in the contact section.
            </p>
          </div>

          <div className="mt-8 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                This privacy policy is enforced by Wayne Enterprises and adheres
                to the highest standards of data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
