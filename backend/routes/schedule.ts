import express from "express";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { runScheduler } from "../services/scheduler.js";

const router = express.Router();

interface Patient {
  id: number;
  at: number; // Arrival Time
  td: number; // Treatment Duration
  severity: number; // Priority
}

/**
 * @route POST /api/schedule
 * @desc Run the scheduling algorithm using the C++ engine or Node.js fallback
 */
router.post("/", (req, res) => {
  const { strategy, input, quantum } = req.body;

  if (!strategy || !input) {
    return res.status(400).json({ success: false, message: "Missing strategy or input data" });
  }

  const patients: Patient[] = input.map((p: any, index: number) => ({
    id: index + 1,
    at: Number(p.at),
    td: Number(p.td),
    severity: Number(p.severity || 0),
  }));

  const cppBinary = path.join(process.cwd(), "scheduler");

  // If binary exists, use it. Otherwise, fallback to Node.js implementation.
  if (fs.existsSync(cppBinary)) {
    const args = [strategy, patients.length.toString()];
    patients.forEach((p) => {
      args.push(p.at.toString(), p.td.toString(), p.severity.toString());
    });
    if (strategy === "rr") {
      args.push((quantum || 2).toString());
    }

    const command = `${cppBinary} ${args.join(" ")}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal engine error during execution" });
      }
      try {
        const result = JSON.parse(stdout);
        return res.json({ success: true, ...result, engine: "cpp" });
      } catch (err) {
        console.error("Failed to parse C++ output:", stdout);
        return res.status(500).json({ success: false, message: "Invalid output format from engine" });
      }
    });
  } else {
    // Node.js Fallback
    try {
      const result = runScheduler(strategy, patients, quantum);
      return res.json({ success: true, ...result, engine: "nodejs" });
    } catch (error: any) {
      console.error(`Node.js execution error: ${error.message}`);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
});

export default router;
