import React from "react";
import { StrategyInfo } from "../types";
import { CheckCircle2, XCircle, Info, Stethoscope, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  info: StrategyInfo;
}

export const StrategyInfoPanel: React.FC<Props> = ({ info }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-white/5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">{info.name}</h2>
        </div>
        <div className="flex">
          <span
            className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
              info.isPreemptive
                ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            }`}
          >
            {info.isPreemptive ? "Preemptive" : "Non-preemptive"}
          </span>
        </div>
      </div>

      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Algorithm Theory</h4>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
          {info.theory}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Selection Criteria</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">{info.selectionCriteria}</p>
        </div>
        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
          <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Decision Mode</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">{info.decisionMode}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Implementation Rules
            </h3>
            <ul className="space-y-2">
              {info.implementationRules?.map((rule, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Key Behavior
            </h3>
            <ul className="space-y-2">
              {info.keyBehavior?.map((behavior, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  {behavior}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Advantages
            </h3>
            <ul className="space-y-2">
              {info.advantages.map((adv, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  {adv}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Disadvantages
            </h3>
            <ul className="space-y-2">
              {info.disadvantages.map((dis, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  {dis}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
