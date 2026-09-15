import {
  Activity,
  BarChart3,
  Inbox,
  Settings,
  ShieldCheck,
  Truck,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Truck size={21} />
        </div>

        <div>
          <div className="brand-name">
            RapidDispatch
          </div>

          <div className="brand-subtitle">
            LIVE OPERATIONS
          </div>
        </div>
      </div>

      <div className="workspace-label">
        WORKSPACE
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active">
          <Inbox size={18} />
          <span>Support Queue</span>
          <span className="nav-count">
            Live
          </span>
        </div>

        <div className="nav-item">
          <Activity size={18} />
          <span>Live Operations</span>
        </div>

        <div className="nav-item">
          <BarChart3 size={18} />
          <span>Analytics</span>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="security-card">
          <div className="security-icon">
            <ShieldCheck size={18} />
          </div>

          <div>
            <strong>Live Sync Active</strong>
            <span>Protected workspace</span>
          </div>
        </div>

        <div className="nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;