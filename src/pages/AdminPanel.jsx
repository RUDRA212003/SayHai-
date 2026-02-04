import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { ShieldAlert, UserX, UserCheck, Mail, Clock } from "lucide-react";
import PageLoader from "../components/PageLoader";

const AdminPanel = () => {
  const { adminUsers, getAllUsers, toggleBlockUser, isMessagesLoading } = useChatStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  if (isMessagesLoading) return <PageLoader />;

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDarkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
            <ShieldAlert className="size-8 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Security Command</h1>
            <p className="text-sm text-zinc-500 italic">Manage nodes and network integrity</p>
          </div>
        </div>

        <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500">User Node</th>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500">Security Status</th>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500">Last Pulse</th>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {adminUsers?.map((user) => (
                  <tr key={user._id} className="hover:bg-yellow-500/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={user.profilePic || "/avatar.png"} className="size-10 rounded-full object-cover border-2 border-zinc-800" />
                        <div>
                          <p className="font-bold text-sm">{user.fullName}</p>
                          <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase font-medium">
                            <Mail className="size-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${user.isVerified ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                          {user.isVerified ? "VERIFIED" : "PENDING"}
                        </span>
                        {user.isBlocked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit bg-red-500/10 text-red-500">
                            SUSPENDED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Clock className="size-3" />
                        {new Date(user.lastLogin || user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleBlockUser(user._id)}
                        className={`p-2 rounded-xl transition-all ${
                          user.isBlocked 
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
                            : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        }`}
                        title={user.isBlocked ? "Restore Node" : "Sever Connection"}
                      >
                        {user.isBlocked ? <UserCheck className="size-5" /> : <UserX className="size-5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;