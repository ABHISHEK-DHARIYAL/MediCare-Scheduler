#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <map>
#include <iomanip>

using namespace std;

struct Patient {
    int id;
    int at; // Arrival Time
    int td; // Treatment Duration
    int severity; // Priority
    int remainingTd;
    int ct; // Completion Time
    int tat; // Turnaround Time
    int wt; // Waiting Time
};

struct TimelineEntry {
    string pid;
    int startTime;
    int endTime;
    int duration;
};

void printJson(const vector<Patient>& results, const vector<TimelineEntry>& timeline) {
    cout << "{" << endl;
    cout << "  \"success\": true," << endl;
    cout << "  \"results\": [" << endl;
    for (size_t i = 0; i < results.size(); ++i) {
        cout << "    {" << endl;
        cout << "      \"id\": " << results[i].id << "," << endl;
        cout << "      \"at\": " << results[i].at << "," << endl;
        cout << "      \"td\": " << results[i].td << "," << endl;
        cout << "      \"severity\": " << results[i].severity << "," << endl;
        cout << "      \"ct\": " << results[i].ct << "," << endl;
        cout << "      \"tat\": " << results[i].tat << "," << endl;
        cout << "      \"wt\": " << results[i].wt << endl;
        cout << "    }" << (i == results.size() - 1 ? "" : ",") << endl;
    }
    cout << "  ]," << endl;
    cout << "  \"timeline\": [" << endl;
    for (size_t i = 0; i < timeline.size(); ++i) {
        cout << "    {" << endl;
        cout << "      \"pid\": \"" << timeline[i].pid << "\"," << endl;
        cout << "      \"startTime\": " << timeline[i].startTime << "," << endl;
        cout << "      \"endTime\": " << timeline[i].endTime << "," << endl;
        cout << "      \"duration\": " << timeline[i].duration << endl;
        cout << "    }" << (i == timeline.size() - 1 ? "" : ",") << endl;
    }
    cout << "  ]," << endl;

    double totalWt = 0, totalTat = 0;
    for (const auto& p : results) {
        totalWt += p.wt;
        totalTat += p.tat;
    }
    cout << "  \"avgWt\": " << (results.empty() ? 0 : totalWt / results.size()) << "," << endl;
    cout << "  \"avgTat\": " << (results.empty() ? 0 : totalTat / results.size()) << endl;
    cout << "}" << endl;
}

void solveFCFS(vector<Patient> patients) {
    sort(patients.begin(), patients.end(), [](const Patient& a, const Patient& b) {
        return a.at < b.at;
    });

    int currentTime = 0;
    vector<TimelineEntry> timeline;
    vector<Patient> results;

    for (auto& p : patients) {
        if (currentTime < p.at) {
            timeline.push_back({"IDLE", currentTime, p.at, p.at - currentTime});
            currentTime = p.at;
        }
        int startTime = currentTime;
        currentTime += p.td;
        p.ct = currentTime;
        p.tat = p.ct - p.at;
        p.wt = p.tat - p.td;
        results.push_back(p);
        timeline.push_back({to_string(p.id), startTime, currentTime, p.td});
    }
    printJson(results, timeline);
}

void solveSJF(vector<Patient> patients) {
    int currentTime = 0;
    vector<TimelineEntry> timeline;
    vector<Patient> results;
    vector<Patient> remaining = patients;

    while (!remaining.empty()) {
        vector<Patient*> available;
        for (auto& p : remaining) {
            if (p.at <= currentTime) available.push_back(&p);
        }

        if (available.empty()) {
            int nextArrival = remaining[0].at;
            for (const auto& p : remaining) nextArrival = min(nextArrival, p.at);
            timeline.push_back({"IDLE", currentTime, nextArrival, nextArrival - currentTime});
            currentTime = nextArrival;
            continue;
        }

        auto it = min_element(available.begin(), available.end(), [](Patient* a, Patient* b) {
            return a->td < b->td;
        });

        Patient* next = *it;
        int startTime = currentTime;
        currentTime += next->td;
        next->ct = currentTime;
        next->tat = next->ct - next->at;
        next->wt = next->tat - next->td;
        results.push_back(*next);
        timeline.push_back({to_string(next->id), startTime, currentTime, next->td});

        for (auto remIt = remaining.begin(); remIt != remaining.end(); ++remIt) {
            if (remIt->id == next->id) {
                remaining.erase(remIt);
                break;
            }
        }
    }
    printJson(results, timeline);
}

void solveSRTN(vector<Patient> patients) {
    int currentTime = 0;
    vector<TimelineEntry> timeline;
    vector<Patient> results;
    for (auto& p : patients) p.remainingTd = p.td;
    
    string lastPid = "";

    while (true) {
        Patient* next = nullptr;
        int minTd = 1e9;

        for (auto& p : patients) {
            if (p.at <= currentTime && p.remainingTd > 0) {
                if (p.remainingTd < minTd) {
                    minTd = p.remainingTd;
                    next = &p;
                }
            }
        }

        if (next == nullptr) {
            bool allDone = true;
            int nextArrival = 1e9;
            for (const auto& p : patients) {
                if (p.remainingTd > 0) {
                    allDone = false;
                    nextArrival = min(nextArrival, p.at);
                }
            }
            if (allDone) break;

            if (lastPid != "IDLE") {
                timeline.push_back({"IDLE", currentTime, currentTime + 1, 1});
            } else {
                timeline.back().endTime++;
                timeline.back().duration++;
            }
            currentTime++;
            lastPid = "IDLE";
            continue;
        }

        if (lastPid != to_string(next->id)) {
            timeline.push_back({to_string(next->id), currentTime, currentTime + 1, 1});
        } else {
            timeline.back().endTime++;
            timeline.back().duration++;
        }

        next->remainingTd--;
        currentTime++;
        lastPid = to_string(next->id);

        if (next->remainingTd == 0) {
            next->ct = currentTime;
            next->tat = next->ct - next->at;
            next->wt = next->tat - next->td;
            results.push_back(*next);
        }
    }
    printJson(results, timeline);
}

void solveRR(vector<Patient> patients, int quantum) {
    int currentTime = 0;
    vector<TimelineEntry> timeline;
    vector<Patient> results;
    for (auto& p : patients) p.remainingTd = p.td;

    queue<int> q;
    vector<bool> inQueue(patients.size() + 1, false);
    int completed = 0;

    sort(patients.begin(), patients.end(), [](const Patient& a, const Patient& b) {
        return a.at < b.at;
    });

    while (completed < patients.size()) {
        for (int i = 0; i < (int)patients.size(); ++i) {
            if (patients[i].at <= currentTime && !inQueue[patients[i].id] && patients[i].remainingTd > 0) {
                q.push(i);
                inQueue[patients[i].id] = true;
            }
        }

        if (q.empty()) {
            int nextArrival = 1e9;
            for (const auto& p : patients) {
                if (p.remainingTd > 0) nextArrival = min(nextArrival, p.at);
            }
            timeline.push_back({"IDLE", currentTime, nextArrival, nextArrival - currentTime});
            currentTime = nextArrival;
            continue;
        }

        int idx = q.front();
        q.pop();

        int executeTime = min(patients[idx].remainingTd, quantum);
        timeline.push_back({to_string(patients[idx].id), currentTime, currentTime + executeTime, executeTime});
        
        currentTime += executeTime;
        patients[idx].remainingTd -= executeTime;

        for (int i = 0; i < (int)patients.size(); ++i) {
            if (patients[i].at <= currentTime && !inQueue[patients[i].id] && patients[i].remainingTd > 0) {
                q.push(i);
                inQueue[patients[i].id] = true;
            }
        }

        if (patients[idx].remainingTd > 0) {
            q.push(idx);
        } else {
            patients[idx].ct = currentTime;
            patients[idx].tat = patients[idx].ct - patients[idx].at;
            patients[idx].wt = patients[idx].tat - patients[idx].td;
            results.push_back(patients[idx]);
            completed++;
        }
    }
    printJson(results, timeline);
}

void solvePriorityNP(vector<Patient> patients) {
    int currentTime = 0;
    vector<TimelineEntry> timeline;
    vector<Patient> results;
    vector<Patient> remaining = patients;

    while (!remaining.empty()) {
        vector<Patient*> available;
        for (auto& p : remaining) {
            if (p.at <= currentTime) available.push_back(&p);
        }

        if (available.empty()) {
            int nextArrival = remaining[0].at;
            for (const auto& p : remaining) nextArrival = min(nextArrival, p.at);
            timeline.push_back({"IDLE", currentTime, nextArrival, nextArrival - currentTime});
            currentTime = nextArrival;
            continue;
        }

        auto it = min_element(available.begin(), available.end(), [](Patient* a, Patient* b) {
            return a->severity < b->severity;
        });

        Patient* next = *it;
        int startTime = currentTime;
        currentTime += next->td;
        next->ct = currentTime;
        next->tat = next->ct - next->at;
        next->wt = next->tat - next->td;
        results.push_back(*next);
        timeline.push_back({to_string(next->id), startTime, currentTime, next->td});

        for (auto remIt = remaining.begin(); remIt != remaining.end(); ++remIt) {
            if (remIt->id == next->id) {
                remaining.erase(remIt);
                break;
            }
        }
    }
    printJson(results, timeline);
}

void solvePriorityP(vector<Patient> patients) {
    int currentTime = 0;
    vector<TimelineEntry> timeline;
    vector<Patient> results;
    for (auto& p : patients) p.remainingTd = p.td;
    
    string lastPid = "";

    while (true) {
        Patient* next = nullptr;
        int minSeverity = 1e9;

        for (auto& p : patients) {
            if (p.at <= currentTime && p.remainingTd > 0) {
                if (p.severity < minSeverity) {
                    minSeverity = p.severity;
                    next = &p;
                }
            }
        }

        if (next == nullptr) {
            bool allDone = true;
            int nextArrival = 1e9;
            for (const auto& p : patients) {
                if (p.remainingTd > 0) {
                    allDone = false;
                    nextArrival = min(nextArrival, p.at);
                }
            }
            if (allDone) break;

            if (lastPid != "IDLE") {
                timeline.push_back({"IDLE", currentTime, currentTime + 1, 1});
            } else {
                timeline.back().endTime++;
                timeline.back().duration++;
            }
            currentTime++;
            lastPid = "IDLE";
            continue;
        }

        if (lastPid != to_string(next->id)) {
            timeline.push_back({to_string(next->id), currentTime, currentTime + 1, 1});
        } else {
            timeline.back().endTime++;
            timeline.back().duration++;
        }

        next->remainingTd--;
        currentTime++;
        lastPid = to_string(next->id);

        if (next->remainingTd == 0) {
            next->ct = currentTime;
            next->tat = next->ct - next->at;
            next->wt = next->tat - next->td;
            results.push_back(*next);
        }
    }
    printJson(results, timeline);
}

int main(int argc, char* argv[]) {
    if (argc < 3) return 1;

    string strategy = argv[1];
    int n = stoi(argv[2]);
    int quantum = (argc > 3 + n * 3) ? stoi(argv[3 + n * 3]) : 2;

    vector<Patient> patients;
    for (int i = 0; i < n; ++i) {
        Patient p;
        p.id = i + 1;
        p.at = stoi(argv[3 + i * 3]);
        p.td = stoi(argv[4 + i * 3]);
        p.severity = stoi(argv[5 + i * 3]);
        patients.push_back(p);
    }

    if (strategy == "fcfs") solveFCFS(patients);
    else if (strategy == "sjf") solveSJF(patients);
    else if (strategy == "srtn") solveSRTN(patients);
    else if (strategy == "rr") solveRR(patients, quantum);
    else if (strategy == "pnp") solvePriorityNP(patients);
    else if (strategy == "pp") solvePriorityP(patients);

    return 0;
}
