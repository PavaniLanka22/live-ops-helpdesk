import {
  Wifi,
  WifiOff,
} from "lucide-react";

const ConnectionStatus = ({ connected }) => {
  return (
    <div
      className={`connection-status ${
        connected ? "online" : "offline"
      }`}
    >
      {connected ? (
        <>
          <span className="status-pulse" />
          <Wifi size={14} />
          <span>Live connection</span>
        </>
      ) : (
        <>
          <WifiOff size={14} />
          <span>
            Connection lost · Reconnecting...
          </span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;