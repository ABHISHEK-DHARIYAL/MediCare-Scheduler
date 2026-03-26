interface Patient {
  id: number;
  at: number; // Arrival Time
  td: number; // Treatment Duration
  severity: number; // Priority
}

interface TimelineEntry {
  pid: string;
  startTime: number;
  endTime: number;
  duration: number;
}

interface PatientResult {
  id: number;
  at: number;
  td: number;
  ct: number; // Completion Time
  tat: number; // Turnaround Time
  wt: number; // Waiting Time
}

const calculateAverages = (results: PatientResult[]) => {
  if (results.length === 0) return { avgWt: 0, avgTat: 0 };
  const totalWt = results.reduce((sum, r) => sum + r.wt, 0);
  const totalTat = results.reduce((sum, r) => sum + r.tat, 0);
  return {
    avgWt: totalWt / results.length,
    avgTat: totalTat / results.length,
  };
};

export const runScheduler = (strategy: string, patients: Patient[], quantum: number = 2) => {
  let result;
  switch (strategy.toLowerCase()) {
    case "fcfs":
      result = fcfs(patients);
      break;
    case "sjf":
      result = sjf(patients);
      break;
    case "srtn":
      result = srtn(patients);
      break;
    case "rr":
      result = rr(patients, quantum);
      break;
    case "pnp":
    case "priority":
      result = pnp(patients);
      break;
    case "pp":
      result = pp(patients);
      break;
    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }
  
  const averages = calculateAverages(result.results);
  return { ...result, ...averages };
};

const fcfs = (patients: Patient[]) => {
  const sorted = [...patients].sort((a, b) => a.at - b.at);
  const timeline: TimelineEntry[] = [];
  const results: PatientResult[] = [];
  let currentTime = 0;

  sorted.forEach((p) => {
    if (currentTime < p.at) {
      timeline.push({ pid: "IDLE", startTime: currentTime, endTime: p.at, duration: p.at - currentTime });
      currentTime = p.at;
    }
    const startTime = currentTime;
    const endTime = startTime + p.td;
    timeline.push({ pid: p.id.toString(), startTime, endTime, duration: p.td });
    
    const tat = endTime - p.at;
    const wt = tat - p.td;
    results.push({ id: p.id, at: p.at, td: p.td, ct: endTime, tat, wt });
    currentTime = endTime;
  });

  return { timeline, results: results.sort((a, b) => a.id - b.id) };
};

const sjf = (patients: Patient[]) => {
  let currentTime = 0;
  const timeline: TimelineEntry[] = [];
  const results: PatientResult[] = [];
  const remaining = [...patients];
  const completed: number[] = [];

  while (completed.length < patients.length) {
    const available = remaining.filter(p => p.at <= currentTime && !completed.includes(p.id));
    
    if (available.length === 0) {
      const nextArrival = Math.min(...remaining.filter(p => !completed.includes(p.id)).map(p => p.at));
      timeline.push({ pid: "IDLE", startTime: currentTime, endTime: nextArrival, duration: nextArrival - currentTime });
      currentTime = nextArrival;
      continue;
    }

    const next = available.sort((a, b) => a.td - b.td || a.at - b.at)[0];
    const startTime = currentTime;
    const endTime = startTime + next.td;
    timeline.push({ pid: next.id.toString(), startTime, endTime, duration: next.td });
    
    const tat = endTime - next.at;
    const wt = tat - next.td;
    results.push({ id: next.id, at: next.at, td: next.td, ct: endTime, tat, wt });
    
    currentTime = endTime;
    completed.push(next.id);
  }

  return { timeline, results: results.sort((a, b) => a.id - b.id) };
};

const srtn = (patients: Patient[]) => {
  let currentTime = 0;
  const timeline: TimelineEntry[] = [];
  const results: PatientResult[] = [];
  const remainingTime = new Map(patients.map(p => [p.id, p.td]));
  const completed: number[] = [];
  let lastPid: string | null = null;
  let lastStartTime = 0;

  while (completed.length < patients.length) {
    const available = patients.filter(p => p.at <= currentTime && !completed.includes(p.id));
    
    if (available.length === 0) {
      if (lastPid) {
        timeline.push({ pid: lastPid, startTime: lastStartTime, endTime: currentTime, duration: currentTime - lastStartTime });
        lastPid = null;
      }
      const nextArrival = Math.min(...patients.filter(p => !completed.includes(p.id)).map(p => p.at));
      timeline.push({ pid: "IDLE", startTime: currentTime, endTime: nextArrival, duration: nextArrival - currentTime });
      currentTime = nextArrival;
      continue;
    }

    const next = available.sort((a, b) => (remainingTime.get(a.id) || 0) - (remainingTime.get(b.id) || 0) || a.at - b.at)[0];
    const pid = next.id.toString();

    if (pid !== lastPid) {
      if (lastPid) {
        timeline.push({ pid: lastPid, startTime: lastStartTime, endTime: currentTime, duration: currentTime - lastStartTime });
      }
      lastPid = pid;
      lastStartTime = currentTime;
    }

    currentTime++;
    remainingTime.set(next.id, (remainingTime.get(next.id) || 0) - 1);

    if (remainingTime.get(next.id) === 0) {
      timeline.push({ pid, startTime: lastStartTime, endTime: currentTime, duration: currentTime - lastStartTime });
      const tat = currentTime - next.at;
      const wt = tat - next.td;
      results.push({ id: next.id, at: next.at, td: next.td, ct: currentTime, tat, wt });
      completed.push(next.id);
      lastPid = null;
    }
  }

  return { timeline, results: results.sort((a, b) => a.id - b.id) };
};

const rr = (patients: Patient[], quantum: number) => {
  let currentTime = 0;
  const timeline: TimelineEntry[] = [];
  const results: PatientResult[] = [];
  const remainingTime = new Map(patients.map(p => [p.id, p.td]));
  const queue: number[] = [];
  const completed: number[] = [];
  const inQueue = new Set<number>();

  const sorted = [...patients].sort((a, b) => a.at - b.at);
  let patientIdx = 0;

  while (completed.length < patients.length) {
    while (patientIdx < sorted.length && sorted[patientIdx].at <= currentTime) {
      if (!inQueue.has(sorted[patientIdx].id)) {
        queue.push(sorted[patientIdx].id);
        inQueue.add(sorted[patientIdx].id);
      }
      patientIdx++;
    }

    if (queue.length === 0) {
      const nextArrival = sorted[patientIdx].at;
      timeline.push({ pid: "IDLE", startTime: currentTime, endTime: nextArrival, duration: nextArrival - currentTime });
      currentTime = nextArrival;
      continue;
    }

    const pid = queue.shift()!;
    inQueue.delete(pid);
    const p = patients.find(x => x.id === pid)!;
    const rem = remainingTime.get(pid)!;
    const execTime = Math.min(rem, quantum);

    timeline.push({ pid: pid.toString(), startTime: currentTime, endTime: currentTime + execTime, duration: execTime });
    
    // Check for new arrivals during execution
    const nextTime = currentTime + execTime;
    while (patientIdx < sorted.length && sorted[patientIdx].at <= nextTime) {
      if (!inQueue.has(sorted[patientIdx].id)) {
        queue.push(sorted[patientIdx].id);
        inQueue.add(sorted[patientIdx].id);
      }
      patientIdx++;
    }

    currentTime = nextTime;
    remainingTime.set(pid, rem - execTime);

    if (remainingTime.get(pid) === 0) {
      const tat = currentTime - p.at;
      const wt = tat - p.td;
      results.push({ id: p.id, at: p.at, td: p.td, ct: currentTime, tat, wt });
      completed.push(pid);
    } else {
      queue.push(pid);
      inQueue.add(pid);
    }
  }

  return { timeline, results: results.sort((a, b) => a.id - b.id) };
};

const pnp = (patients: Patient[]) => {
  let currentTime = 0;
  const timeline: TimelineEntry[] = [];
  const results: PatientResult[] = [];
  const remaining = [...patients];
  const completed: number[] = [];

  while (completed.length < patients.length) {
    const available = remaining.filter(p => p.at <= currentTime && !completed.includes(p.id));
    
    if (available.length === 0) {
      const nextArrival = Math.min(...remaining.filter(p => !completed.includes(p.id)).map(p => p.at));
      timeline.push({ pid: "IDLE", startTime: currentTime, endTime: nextArrival, duration: nextArrival - currentTime });
      currentTime = nextArrival;
      continue;
    }

    const next = available.sort((a, b) => a.severity - b.severity || a.at - b.at)[0];
    const startTime = currentTime;
    const endTime = startTime + next.td;
    timeline.push({ pid: next.id.toString(), startTime, endTime, duration: next.td });
    
    const tat = endTime - next.at;
    const wt = tat - next.td;
    results.push({ id: next.id, at: next.at, td: next.td, ct: endTime, tat, wt });
    
    currentTime = endTime;
    completed.push(next.id);
  }

  return { timeline, results: results.sort((a, b) => a.id - b.id) };
};

const pp = (patients: Patient[]) => {
  let currentTime = 0;
  const timeline: TimelineEntry[] = [];
  const results: PatientResult[] = [];
  const remainingTime = new Map(patients.map(p => [p.id, p.td]));
  const completed: number[] = [];
  let lastPid: string | null = null;
  let lastStartTime = 0;

  while (completed.length < patients.length) {
    const available = patients.filter(p => p.at <= currentTime && !completed.includes(p.id));
    
    if (available.length === 0) {
      if (lastPid) {
        timeline.push({ pid: lastPid, startTime: lastStartTime, endTime: currentTime, duration: currentTime - lastStartTime });
        lastPid = null;
      }
      const nextArrival = Math.min(...patients.filter(p => !completed.includes(p.id)).map(p => p.at));
      timeline.push({ pid: "IDLE", startTime: currentTime, endTime: nextArrival, duration: nextArrival - currentTime });
      currentTime = nextArrival;
      continue;
    }

    const next = available.sort((a, b) => a.severity - b.severity || a.at - b.at)[0];
    const pid = next.id.toString();

    if (pid !== lastPid) {
      if (lastPid) {
        timeline.push({ pid: lastPid, startTime: lastStartTime, endTime: currentTime, duration: currentTime - lastStartTime });
      }
      lastPid = pid;
      lastStartTime = currentTime;
    }

    currentTime++;
    remainingTime.set(next.id, (remainingTime.get(next.id) || 0) - 1);

    if (remainingTime.get(next.id) === 0) {
      timeline.push({ pid, startTime: lastStartTime, endTime: currentTime, duration: currentTime - lastStartTime });
      const tat = currentTime - next.at;
      const wt = tat - next.td;
      results.push({ id: next.id, at: next.at, td: next.td, ct: currentTime, tat, wt });
      completed.push(next.id);
      lastPid = null;
    }
  }

  return { timeline, results: results.sort((a, b) => a.id - b.id) };
};
