import { Shield } from "lucide-react";
import useCookieStore from "../../store/cookieStore";

const CookieConsent = () => {
  const { consent, setConsent } = useCookieStore();

  if (consent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-yellow-500/20 bg-black/95 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(245,158,11,0.1)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-yellow-400 tracking-wide mb-2">
                The Batcomputer Needs Your Permission
              </h3>
              <p className="text-gray-400 text-sm max-w-3xl">
                We use cookies to enhance your experience in the Batcave. Your
                data helps us improve our arsenal and track criminal activity.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setConsent("accepted")}
              className="min-w-[120px] px-6 py-2.5 bg-yellow-500 text-black font-medium rounded 
                hover:bg-yellow-400 transform hover:scale-105 transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              Accept All
            </button>
            <button
              onClick={() => setConsent("declined")}
              className="min-w-[120px] px-6 py-2.5 bg-gray-900 text-gray-300 font-medium rounded 
                border border-gray-700 hover:border-yellow-500/30 hover:text-white 
                transform hover:scale-105 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-gray-700"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
