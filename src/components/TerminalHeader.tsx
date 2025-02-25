
import { Signal, Wifi } from "lucide-react";

export const TerminalHeader = () => {
  return (
    <div className="terminal-header">
      <Signal size={16} />
      <Wifi size={16} />
      <span>ADSB Terminal v1.0.0</span>
    </div>
  );
};
