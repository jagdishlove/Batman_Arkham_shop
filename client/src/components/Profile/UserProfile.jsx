import { Shield } from "lucide-react";
import { useStandardQuery } from "@/lib/useStandardQuery";
import { get } from "@/lib/http";
import { formatDate } from "@/utils";

const UserProfile = () => {
  const {
    data: users,
    isLoading,
    error,
  } = useStandardQuery(["admin-users"], () => get("/auth/users"), {
    errorMsg: "Failed to fetch users",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent" />
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
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Shield className="w-8 h-8 text-yellow-400" />
          <div>
            <h2 className="text-2xl font-light text-white">
              REGISTERED AGENTS
            </h2>
            <p className="text-sm text-gray-400">
              Total active agents in the network
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
          <span className="text-yellow-400 font-medium">
            {users?.length || 0} Users
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-gray-900/30 border border-gray-800 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900/50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-400">
                NAME
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">
                EMAIL
              </th>

              <th className="px-6 py-3 text-xs font-medium text-gray-400">
                JOINED
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-900/30">
                <td className="px-6 py-4 text-sm text-white">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {formatDate(user.createdAt, { format: "short" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProfile;
