import { Shield } from "lucide-react";
import { useStandardQuery } from "@/lib/useStandardQuery";
import { get } from "@/lib/http";
import { formatDate } from "@/utils";

const ContactSection = () => {
  const {
    data: { contacts } = {},
    isLoading,
    error,
  } = useStandardQuery(["contact-messages"], () => get("/contact"), {
    errorMsg: "Failed to fetch contact messages",
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-800/50 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-light flex items-center gap-2">
        <Shield className="w-6 h-6 text-yellow-400" />
        CONTACT MESSAGES
      </h2>

      <div className="bg-gray-900/30 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contacts?.map((message) => (
                <tr key={message._id} className="hover:bg-gray-900/30">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {message.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {message.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    <p className="line-clamp-2">{message.message}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(message.createdAt, { format: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
