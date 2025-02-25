
import { useEffect, useState } from "react";
import { Circle } from "lucide-react";

export const StatusBar = () => {
  const [connected, setConnected] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Circle size={8} className={connected ? "text-primary" : "text-destructive"} />
        <span>{connected ? "Connected" : "Disconnected"}</span>
      </div>
      <div>{time.toLocaleTimeString()}</div>
    </div>
  );
};
