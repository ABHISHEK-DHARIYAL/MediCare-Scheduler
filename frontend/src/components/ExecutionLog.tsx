import React from "react";
import { motion } from "framer-motion";
import { ListOrdered, ChevronRight } from "lucide-react";

interface Props {
  steps: string[];
}

export const ExecutionLog: React.FC<Props> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-white/5">
      <div className="flex items-center gap-2 mb-6">
        <ListOrdered className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Step-by-Step Execution Log</h2>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors"
          >
            <div className="mt-1 shrink-0">
              <ChevronRight className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              {step}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
