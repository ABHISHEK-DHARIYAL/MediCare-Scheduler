import React from "react";
import { PatientResult } from "../types";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

interface Props {
  results: PatientResult[];
}

export const PatientLedger: React.FC<Props> = ({ results }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-white/5">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Patient Result Ledger</h2>
      </div>
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Arrival</th>
              <th className="px-4 py-3 font-semibold">Treatment</th>
              <th className="px-4 py-3 font-semibold">Completion</th>
              <th className="px-4 py-3 font-semibold">Turnaround</th>
              <th className="px-4 py-3 font-semibold">Waiting</th>
            </tr>
          </thead>
          <tbody>
            {results.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-200">P{p.id}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.at}m</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.td}m</td>
                <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">{p.ct}m</td>
                <td className="px-4 py-3 font-medium text-indigo-600 dark:text-indigo-400">{p.tat}m</td>
                <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">{p.wt}m</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
