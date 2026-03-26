import React from "react";
import { Patient } from "../types";
import { Plus, Trash2, Sparkles, Ambulance } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  showSeverity: boolean;
}

export const PatientIntake: React.FC<Props> = ({ patients, setPatients, showSeverity }) => {
  const [numPatients, setNumPatients] = React.useState(patients.length);

  const addPatient = () => {
    const newId = patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 1;
    const newPatients = [...patients, { id: newId, at: 0, td: 1, severity: 1 }];
    setPatients(newPatients);
    setNumPatients(newPatients.length);
  };

  const removePatient = (id: number) => {
    if (patients.length > 1) {
      const newPatients = patients.filter((p) => p.id !== id);
      setPatients(newPatients);
      setNumPatients(newPatients.length);
    }
  };

  const generatePatients = (n: number) => {
    const newPatients: Patient[] = Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      at: Math.floor(Math.random() * 5),
      td: Math.floor(Math.random() * 10) + 1,
      severity: Math.floor(Math.random() * 5) + 1,
    }));
    setPatients(newPatients);
    setNumPatients(n);
  };

  const updatePatient = (id: number, field: keyof Patient, value: number) => {
    setPatients(
      patients.map((p) => (p.id === id ? { ...p, [field]: Math.max(0, value) } : p))
    );
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-white/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Ambulance className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Patient Intake & Triage
        </h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Count:</label>
            <input
              type="number"
              min="1"
              max="15"
              value={numPatients}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setNumPatients(val);
                generatePatients(val);
              }}
              className="w-12 bg-transparent border-none outline-none text-sm font-bold text-blue-600 dark:text-blue-400"
            />
          </div>

          <button
            onClick={() => generatePatients(patients.length)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all active:scale-95"
            title="Randomize values"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Randomize
          </button>

          <button
            onClick={addPatient}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Emergency
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-separate border-spacing-y-2 min-w-[600px]">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-4 py-2 font-semibold">Patient</th>
              <th className="px-4 py-2 font-semibold">Arrival Time</th>
              <th className="px-4 py-2 font-semibold">Treatment Duration</th>
              {showSeverity && <th className="px-4 py-2 font-semibold">Severity Level</th>}
              <th className="px-4 py-2 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {patients.map((p) => (
                <motion.tr
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors group"
                >
                  <td className="px-4 py-3 rounded-l-xl border-y border-l border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-blue-600 dark:text-blue-400">P{p.id}</span>
                  </td>
                  <td className="px-4 py-3 border-y border-slate-100 dark:border-slate-700">
                    <input
                      type="number"
                      value={p.at}
                      onChange={(e) => updatePatient(p.id, "at", parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-200"
                    />
                  </td>
                  <td className="px-4 py-3 border-y border-slate-100 dark:border-slate-700">
                    <input
                      type="number"
                      value={p.td}
                      onChange={(e) => updatePatient(p.id, "td", parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-200"
                    />
                  </td>
                  {showSeverity && (
                    <td className="px-4 py-3 border-y border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          p.severity === 1 ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" :
                          p.severity === 2 ? "bg-orange-500" :
                          p.severity === 3 ? "bg-amber-500" :
                          "bg-slate-300 dark:bg-slate-600"
                        }`} />
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={p.severity}
                          onChange={(e) => updatePatient(p.id, "severity", parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                        />
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3 rounded-r-xl border-y border-r border-slate-100 dark:border-slate-700 text-center">
                    <button
                      onClick={() => removePatient(p.id)}
                      disabled={patients.length <= 1}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
