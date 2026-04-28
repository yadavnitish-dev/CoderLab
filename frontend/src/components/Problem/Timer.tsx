import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

interface TimerProps {
  problemId: string;
}

const getInitialTime = (problemId: string): number => {
  if (typeof window === "undefined") return 0;
  const saved = localStorage.getItem(`timer_${problemId}`);
  return saved ? parseInt(saved, 10) : 0;
};

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const Timer: React.FC<TimerProps> = ({ problemId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(() => getInitialTime(problemId));

  useEffect(() => {
    localStorage.setItem(`timer_${problemId}`, seconds.toString());
  }, [seconds, problemId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleToggle = useCallback(() => {
    setIsRunning(!isRunning);
  }, [isRunning]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
    localStorage.removeItem(`timer_${problemId}`);
  }, [problemId]);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleToggle}
        className={`p-1.5 border rounded-sm transition-all ${
          isRunning 
            ? "border-amber-500/30 text-amber-500 hover:bg-amber-500/10" 
            : "border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
        }`}
        title={isRunning ? "Pause" : "Start"}
      >
        {isRunning ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
      </button>
      
      <div className={`flex items-center gap-1.5 px-2 py-1 border ${
        seconds > 0 
          ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" 
          : "border-zinc-800 text-zinc-400"
      } rounded-sm`}>
        <Clock className="size-3" />
        <span className="text-xs font-bold font-mono tracking-wider min-w-[45px]">
          {formatTime(seconds)}
        </span>
      </div>
      
      <button
        onClick={handleReset}
        className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 rounded-sm transition-all"
        title="Reset"
      >
        <RotateCcw className="size-3.5" />
      </button>
    </div>
  );
};

export default Timer;