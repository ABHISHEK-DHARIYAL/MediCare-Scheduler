import { LucideIcon } from "lucide-react";

export interface Patient {
  id: number;
  at: number; // Arrival Time
  td: number; // Treatment Duration
  severity?: number; // Priority
}

export interface PatientResult extends Patient {
  ct: number; // Completion Time
  tat: number; // Turnaround Time
  wt: number; // Waiting Time
}

export interface TimelineEntry {
  pid: number | string; // Patient ID or "IDLE"
  startTime: number;
  endTime: number;
  duration: number;
  color: string;
}

export interface SimulationResult {
  results: PatientResult[];
  timeline: TimelineEntry[];
  avgWt: number;
  avgTat: number;
  steps?: string[];
}

export type StrategyType = "fcfs" | "sjf" | "srtn" | "rr" | "pnp" | "pp";

export interface StrategyInfo {
  id: StrategyType;
  name: string;
  isPreemptive: boolean;
  description: string;
  advantages: string[];
  disadvantages: string[];
  theory?: string;
  selectionCriteria?: string;
  decisionMode?: string;
  implementationRules?: string[];
  keyBehavior?: string[];
}
