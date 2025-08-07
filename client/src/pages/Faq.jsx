import { useState } from "react";
import {
  Shield,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Truck,
  CreditCard,
  PackageOpen,
  RefreshCw,
  Lock,
  Headphones,
} from "lucide-react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      icon: Shield,
      category: "Security",
      questions: [
        {
          q: "How secure is my equipment information?",
          a: "All equipment data is encrypted using Wayne Enterprises' military-grade security protocols. Your information is as secure as the Batcave itself.",
        },
        {
          q: "Is my identity protected when ordering?",
          a: "Absolutely. We employ the same identity protection measures used to protect Batman's secret identity.",
        },
      ],
    },
    {
      icon: Truck,
      category: "Shipping",
      questions: [
        {
          q: "How is the equipment delivered?",
          a: "Equipment is delivered via secure, unmarked vehicles during nighttime hours. Stealth shipping is our standard protocol.",
        },
        {
          q: "What's the delivery timeframe?",
          a: "Standard delivery takes 2-3 nights. Priority Bat-delivery available for urgent missions.",
        },
      ],
    },
    {
      icon: CreditCard,
      category: "Payment",
      questions: [
        {
          q: "What payment methods are accepted?",
          a: "We accept all major credit cards, Wayne Enterprise cards, and secure cryptocurrency transactions.",
        },
        {
          q: "Is my payment information secure?",
          a: "All transactions are processed through our secure Bat-Computer systems with end-to-end encryption.",
        },
      ],
    },
    {
      icon: PackageOpen,
      category: "Returns",
      questions: [
        {
          q: "What's your return policy?",
          a: "Equipment can be returned within 30 days if unused and in original condition. Special items like custom Batarangs are non-returnable.",
        },
        {
          q: "How do I initiate a return?",
          a: "Contact our support team through secure channels. We'll provide discrete return packaging and pickup.",
        },
      ],
    },
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const currentIndex =
      openIndex === `${categoryIndex}-${questionIndex}`
        ? null
        : `${categoryIndex}-${questionIndex}`;
    setOpenIndex(currentIndex);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              TACTICAL SUPPORT
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Common questions about Batman's Armory operations and procedures
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mt-8"></div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                  <category.icon className="h-5 w-5 text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {category.category}
                </h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="border border-gray-800 rounded-lg hover:border-yellow-500/30 transition-all duration-300"
                  >
                    <button
                      onClick={() =>
                        toggleQuestion(categoryIndex, questionIndex)
                      }
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-gray-200">{faq.q}</span>
                      {openIndex === `${categoryIndex}-${questionIndex}` ? (
                        <ChevronUp className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-yellow-400" />
                      )}
                    </button>

                    {openIndex === `${categoryIndex}-${questionIndex}` && (
                      <div className="px-4 pb-4 text-gray-400">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Note */}
        <div className="mt-12 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center">
          <Headphones className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Still need assistance?</h3>
          <p className="text-gray-400 mb-4">
            Our tactical support team is available 24/7 for urgent equipment
            inquiries
          </p>
          <button
            onClick={() => (window.location.href = "/contact")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium rounded-lg hover:opacity-90 transition-all duration-300"
          >
            <Lock className="h-4 w-4" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Faq;
