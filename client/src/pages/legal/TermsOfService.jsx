import { Shield, Scroll, AlertTriangle, Scale, Zap, Star } from "lucide-react";

const TermsOfService = () => {
  const terms = [
    {
      icon: Shield,
      title: "Equipment Usage",
      description:
        "All equipment purchased from Batman's Armory must be used in accordance with Gotham City regulations and vigilante code of conduct.",
      points: [
        "Equipment must not be used for criminal activities",
        "Training is required before using advanced gear",
        "User assumes all responsibility for proper usage",
      ],
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      description:
        "By accessing our services, you agree to operate within the boundaries of Gotham City law enforcement protocols.",
      points: [
        "Must be 18 years or older to purchase",
        "Valid vigilante certification required",
        "Compliance with local regulations mandatory",
      ],
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description:
        "All equipment undergoes rigorous testing at Wayne Enterprises facilities to ensure optimal performance.",
      points: [
        "30-day equipment testing period",
        "Warranty covers manufacturing defects",
        "Regular maintenance required",
      ],
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
              TERMS OF SERVICE
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Operating procedures and guidelines for Batman's Armory equipment
            usage
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mt-8"></div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                  <term.icon className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {term.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {term.description}
                  </p>
                </div>
              </div>

              <ul className="space-y-3 ml-14">
                {term.points.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <Zap className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-red-950/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-2">
                Important Disclaimer
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Batman's Armory reserves the right to deny service to anyone
                suspected of criminal activity. All equipment usage is monitored
                through Wayne Enterprises surveillance systems. Misuse of
                equipment may result in immediate termination of access and
                reporting to GCPD.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Scroll className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">
              Protected by Wayne Enterprises Legal Division
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
