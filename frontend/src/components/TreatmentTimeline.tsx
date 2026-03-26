import React from "react";
import { TimelineEntry } from "../types";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface Props {
  entries: TimelineEntry[];
}

const COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-purple-600",
  "bg-cyan-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
];

export const TreatmentTimeline: React.FC<Props> = ({ entries }) => {
  if (entries.length === 0) return null;

  const totalTime = entries[entries.length - 1].endTime;

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-white/5 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Treatment Timeline</h2>
      </div>
      
      <div className="relative pt-2 pb-12 overflow-x-auto -mx-6 px-6">
        <div className="flex h-16 w-full min-w-[800px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 relative mb-4">
          {entries.map((entry, index) => {
            const width = (entry.duration / totalTime) * 100;
            const colorClass = entry.pid === "IDLE" 
              ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400" 
              : `${COLORS[Number(entry.pid) % COLORS.length]} text-white`;

            return (
              <motion.div
                key={index}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `${width}%`, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${colorClass} h-full flex items-center justify-center text-xs font-bold border-r border-white/20 dark:border-white/10 last:border-0 relative group ${index === 0 ? 'rounded-l-xl' : ''} ${index === entries.length - 1 ? 'rounded-r-xl' : ''}`}
              >
                <span className="truncate px-1">
                  {entry.pid === "IDLE" ? "Idle" : `P${entry.pid}`}
                </span>
                
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Patient {entry.pid}: {entry.startTime}m → {entry.endTime}m ({entry.duration}m)
                </div>

                {/* Start Time Label (only for the first block) */}
                {index === 0 && (
                  <div className="absolute -bottom-10 left-0 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-px h-3 bg-slate-300 dark:bg-slate-600 mb-1" />
                    <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-sm border border-slate-100 dark:border-slate-700 z-10">
                      {entry.startTime}
                    </div>
                  </div>
                )}
                
                {/* End Time Label (Completion Time - shown for every block) */}
                <div className="absolute -bottom-10 right-0 translate-x-1/2 flex flex-col items-center">
                  <div className="w-px h-3 bg-blue-400 dark:bg-blue-600 mb-1" />
                  <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-sm border border-blue-100 dark:border-blue-900/30 z-10">
                    {entry.endTime}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="absolute bottom-6 left-6 right-6 h-px bg-slate-200 dark:bg-slate-700 min-w-[800px]" />
      </div>
    </div>
  );
};
