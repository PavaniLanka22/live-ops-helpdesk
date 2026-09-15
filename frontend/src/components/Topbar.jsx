import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";

const Topbar = ({ agentName }) => {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        Operations
        <span>/</span>
        Support Queue
      </div>

      <div className="topbar-actions">
        <div className="search-box">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search tickets..."
          />

          <kbd>Ctrl K</kbd>
        </div>

        <button className="icon-button">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="profile">
          <div className="avatar">
            {agentName.charAt(0)}
          </div>

          <div className="profile-info">
            <strong>{agentName}</strong>
            <span>Support Agent</span>
          </div>

          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;