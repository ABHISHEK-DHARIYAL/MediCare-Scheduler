import React, { useState, useEffect } from "react";
import { Patient, PatientResult, TimelineEntry } from "./types";
import { STRATEGIES } from "./constants";
import { PatientIntake } from "./components/PatientIntake";
import { TreatmentTimeline } from "./components/TreatmentTimeline";
import { PatientLedger } from "./components/PatientLedger";
import { StrategyInfoPanel } from "./components/StrategyInfo";
import { ExecutionLog } from "./components/ExecutionLog";
import { 
  Hospital, 
  Play, 
  RotateCcw, 
  Clock, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_PATIENTS: Patient[] = [
  { id: 1, at: 0, td: 5, severity: 2 },
  { id: 2, at: 1, td: 3, severity: 1 },
  { id: 3, at: 2, td: 8, severity: 3 },
  { id: 4, at: 3, td: 6, severity: 2 },
];

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [strategy, setStrategy] = useState<string>("fcfs");
  const [timeSlice, setTimeSlice] = useState<number>(2);
  const [results, setResults] = useState<PatientResult[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [avgWt, setAvgWt] = useState<number>(0);
  const [avgTat, setAvgTat] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || 
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const selectedStrategyInfo = STRATEGIES[strategy as keyof typeof STRATEGIES];

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          strategy,
          input: patients,
          quantum: timeSlice,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setTimeline(data.timeline);
        setSteps(data.steps || []);
        setAvgWt(data.avgWt);
        setAvgTat(data.avgTat);
      } else {
        setError(data.message || "Simulation failed");
      }
    } catch (err: any) {
      setError("Failed to connect to the hospital backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetSystem = () => {
    setPatients(INITIAL_PATIENTS);
    setResults([]);
    setTimeline([]);
    setSteps([]);
    setAvgWt(0);
    setAvgTat(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
              <Hospital className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">MediCare</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
              <Activity className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
              <span>System: <span className="text-emerald-500 font-bold">Optimal</span></span>
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Top Section: Controls & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Strategy Selection */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-xl border border-white/20 dark:border-white/5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5 md:6 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Control Center
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Treatment Strategy</label>
                  <select
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700 dark:text-slate-200"
                  >
                    {Object.values(STRATEGIES).map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <AnimatePresence>
                  {strategy === "rr" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Quantum Time Slot</label>
                        <span className="text-[10px] font-bold text-blue-400 dark:text-blue-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/30">Required</span>
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 dark:text-blue-500" />
                        <input
                          type="number"
                          min="1"
                          value={timeSlice}
                          onChange={(e) => setTimeSlice(parseInt(e.target.value) || 1)}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold text-blue-700 dark:text-blue-300"
                          placeholder="e.g. 2"
                        />
                      </div>
                      <p className="text-[10px] text-blue-500/70 dark:text-blue-400/70 italic">Each patient gets this many minutes before switching.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    onClick={runSimulation}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Play className="w-5 h-5 fill-current" />
                    )}
                    Start Treatment Simulation
                  </button>
                  <button
                    onClick={resetSystem}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl font-bold transition-all active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset System
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Summary */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Avg Waiting</p>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{(avgWt || 0).toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1.5">min</span>
                    </div>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Avg Turnaround</p>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{(avgTat || 0).toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1.5">min</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Patient Intake & Triage */}
          <div className="lg:col-span-8 space-y-6">
            <PatientIntake 
              patients={patients} 
              setPatients={setPatients} 
              showSeverity={strategy.includes("p")} 
            />
            
            <AnimatePresence>
              {strategy.includes("p") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-amber-50/50 dark:bg-amber-900/20 backdrop-blur-md rounded-2xl p-6 border border-amber-100 dark:border-amber-900/30 shadow-lg shadow-amber-100/20 dark:shadow-none"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Emergency Triage Overview
                    </h3>
                    <button 
                      onClick={() => {
                        setPatients(patients.map(p => ({
                          ...p,
                          severity: Math.floor(Math.random() * 5) + 1
                        })));
                      }}
                      className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                    >
                      Auto-Assign Severities
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {patients.map(p => (
                      <div key={p.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-amber-100 dark:border-amber-900/30 shadow-sm">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">P{p.id}</span>
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${
                            p.severity === 1 ? "bg-rose-500 animate-pulse" :
                            p.severity === 2 ? "bg-orange-500" :
                            p.severity === 3 ? "bg-amber-500" :
                            "bg-slate-400 dark:bg-slate-600"
                          }`} />
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300">Lvl {p.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] text-amber-600/70 dark:text-amber-400/70 italic">
                    Lower Level = Higher Urgency (Level 1 is Critical Emergency).
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Visualization */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 md:space-y-8"
            >
              <TreatmentTimeline entries={timeline} />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                <div className="lg:col-span-7 space-y-6 md:space-y-8">
                  <PatientLedger results={results} />
                  <ExecutionLog steps={steps} />
                </div>
                <div className="lg:col-span-5">
                  <StrategyInfoPanel info={selectedStrategyInfo} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {results.length === 0 && !loading && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ready for Simulation</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Configure your patient list and select a treatment strategy to visualize the hospital flow.</p>
            </div>
            <button
              onClick={runSimulation}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:gap-3 transition-all"
            >
              Run initial simulation <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Hospital className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">MediCare Scheduler v1.0</span>
          </div>
          <p className="text-sm text-slate-400 font-medium tracking-tight">
            Designed for Hospital Patient Flow & Treatment Management
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
