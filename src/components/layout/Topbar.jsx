import { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import ProfileDropdown from "../common/ProfileDropdown";

export default function Topbar({ onMenuClick }) {
  const [query, setQuery] = useState("");

  return (
    <nav className="flex items-center gap-3 bg-white border-b border-[#e8e2f5] px-4 py-3 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-secondary transition-colors shrink-0"
      >
        <Menu size={16} className="text-gray-500" />
      </button>

      {/* <div className="flex flex-1 items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 h-9 overflow-hidden">
        <Search size={14} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search or type command..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-gray-500 placeholder-gray-400 outline-none w-0 min-w-0"
        />
        <kbd className="hidden sm:inline text-xs text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono shrink-0">
          ⌘K
        </kbd>
      </div> */}

      <div className="flex items-center gap-1.5 ml-auto">
        {/* <button className="relative flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:bg-secondary transition-colors">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-400 rounded-full border-2 border-white" />
        </button> */}

        <ProfileDropdown />
      </div>
    </nav>
  );
}
