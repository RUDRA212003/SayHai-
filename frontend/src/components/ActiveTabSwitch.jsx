import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="px-4 py-2">
      <div className="relative flex bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl overflow-hidden shadow-inner">
        
        {/* Animated Sliding Background */}
        <div 
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-yellow-500 rounded-lg transition-all duration-300 ease-out shadow-[0_0_15px_rgba(234,179,8,0.3)] ${
            activeTab === "chats" ? "left-1" : "left-[calc(50%+1px)]"
          }`}
        />

        {/* Chats Tab */}
        <button
          onClick={() => setActiveTab("chats")}
          className={`relative z-10 flex-1 py-2 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
            activeTab === "chats" ? "text-black" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Chats
        </button>

        {/* Contacts Tab */}
        <button
          onClick={() => setActiveTab("contacts")}
          className={`relative z-10 flex-1 py-2 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
            activeTab === "contacts" ? "text-black" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Contacts
        </button>
      </div>
    </div>
  );
}

export default ActiveTabSwitch;