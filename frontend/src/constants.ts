import { StrategyInfo, StrategyType } from "./types";

export const STRATEGIES: Record<StrategyType, StrategyInfo> = {
  fcfs: {
    id: "fcfs",
    name: "FIRST COME FIRST SERVED (FCFS)",
    isPreemptive: false,
    description: "Patients are treated in the exact order they arrive at the triage desk. It's the most basic 'queue' system used in standard clinics.",
    selectionCriteria: "Process that arrives first is executed first.",
    decisionMode: "Non-preemptive (once started, runs till completion or blocking)",
    implementationRules: [
      "Use FIFO queue",
      "Execute processes in order of arrival time",
      "Ignore burst size"
    ],
    keyBehavior: [
      "No interruption",
      "Long process delays others (Convoy Effect)"
    ],
    advantages: [
      "Simple to manage for administrative staff.",
      "Fair in terms of arrival sequence.",
      "No patient is skipped if they arrived earlier."
    ],
    disadvantages: [
      "The 'Convoy Effect': A patient with a minor issue might wait a long time behind someone with a complex treatment.",
      "High average waiting time during peak hours.",
      "Not suitable for emergency rooms where urgency matters."
    ]
  },
  sjf: {
    id: "sjf",
    name: "SHORTEST JOB FIRST (SJF)",
    isPreemptive: false,
    description: "The doctor always picks the patient who requires the shortest treatment duration next. This minimizes the total number of people waiting in the lobby.",
    selectionCriteria: "Process with smallest burst time is selected",
    decisionMode: "Non-preemptive",
    implementationRules: [
      "Among available processes, pick minimum BT",
      "If CPU is free, choose shortest job from ready queue",
      "Sort ready queue by burst time"
    ],
    keyBehavior: [
      "Minimizes average waiting time",
      "Can cause starvation of long jobs"
    ],
    advantages: [
      "Provides the minimum possible average waiting time.",
      "Quickly clears out patients with minor issues."
    ],
    disadvantages: [
      "Patients with complex, long-duration treatments may face 'Starvation' (waiting indefinitely).",
      "Requires doctors to accurately predict treatment duration in advance."
    ]
  },
  srtn: {
    id: "srtn",
    name: "SHORTEST REMAINING TIME FIRST (SRTF)",
    isPreemptive: true,
    description: "If a new patient arrives whose treatment will take less time than what's left for the current patient, the doctor switches to the new patient immediately.",
    selectionCriteria: "Process with smallest remaining time runs",
    decisionMode: "Preemptive",
    implementationRules: [
      "At every arrival, compare remaining times",
      "If new process has smaller BT → preempt current",
      "Continuously update remaining burst time"
    ],
    keyBehavior: [
      "Frequent context switching",
      "Best response for short jobs"
    ],
    advantages: [
      "Extremely responsive to patients with very quick needs.",
      "Better overall patient flow than non-preemptive strategies."
    ],
    disadvantages: [
      "Frequent interruptions can be stressful for medical staff.",
      "Long-duration treatments are frequently interrupted."
    ]
  },
  rr: {
    id: "rr",
    name: "ROUND ROBIN (RR)",
    isPreemptive: true,
    description: "Each patient gets a fixed amount of time (e.g., 5 mins) with the doctor. If they need more, they go back to the queue and wait for their next turn.",
    selectionCriteria: "Each process gets fixed time quantum (TQ)",
    decisionMode: "Preemptive",
    implementationRules: [
      "Use circular FIFO queue",
      "Execute process for TQ",
      "If not finished → move to end of queue",
      "If finished → remove"
    ],
    keyBehavior: [
      "Fair scheduling",
      "Time quantum is critical: Too small → many context switches; Too large → behaves like FCFS"
    ],
    advantages: [
      "Guaranteed response time for every patient.",
      "Very fair; no single patient can monopolize the doctor's time.",
      "Good for initial consultations and check-ups."
    ],
    disadvantages: [
      "High overhead if the time-slot is too short (constant switching).",
      "Total treatment time increases due to multiple visits."
    ]
  },
  pnp: {
    id: "pnp",
    name: "NON-PREEMPTIVE PRIORITY",
    isPreemptive: false,
    description: "Patients are treated based on their Severity Level (Emergency Priority). The most critical cases are seen as soon as the doctor is free.",
    selectionCriteria: "Process with highest priority runs first (Lower number = higher priority)",
    decisionMode: "Non-preemptive",
    implementationRules: [
      "Sort ready queue by priority",
      "Once selected → run till completion"
    ],
    keyBehavior: [
      "Important tasks run first",
      "Starvation possible (Solution: Aging)"
    ],
    advantages: [
      "Ensures that emergency cases are prioritized over routine check-ups.",
      "Matches real-world medical triage protocols."
    ],
    disadvantages: [
      "Low-severity patients may wait for a very long time if many emergencies arrive.",
      "Priority levels must be assigned accurately by triage nurses."
    ]
  },
  pp: {
    id: "pp",
    name: "PREEMPTIVE PRIORITY",
    isPreemptive: true,
    description: "If a high-severity emergency patient arrives while the doctor is treating a lower-severity case, the doctor immediately stops and attends to the emergency.",
    selectionCriteria: "Process with highest priority runs",
    decisionMode: "Preemptive",
    implementationRules: [
      "If new process arrives with higher priority → preempt current",
      "Always run highest priority available process"
    ],
    keyBehavior: [
      "Better response for critical tasks",
      "High context switching"
    ],
    advantages: [
      "Immediate response to life-threatening emergencies.",
      "Highest level of responsiveness for critical care."
    ],
    disadvantages: [
      "Maximum number of interruptions for routine treatments.",
      "Requires highly organized staff to manage interrupted sessions."
    ]
  }
};
