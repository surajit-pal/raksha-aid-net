import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Triage = {
  conscious: "yes" | "no" | "unsure" | null;
  breathing: "yes" | "no" | "unsure" | null;
  bleeding: "yes" | "no" | "unsure" | null;
  injured: number | null;
};

export type ResponderStage =
  | "idle"
  | "requested"
  | "accepted"
  | "en_route"
  | "arrived"
  | "assisted"
  | "handover";

export type Responder = {
  id: string;
  name: string;
  role: string;
  training: "Level 1 — Basic" | "Level 2 — Intermediate" | "Level 3 — Advanced";
  distanceKm: number;
  etaMin: number;
  verified: boolean;
  drills: number;
};

export type Incident = {
  id: string;
  createdAt: string;
  location: { lat: number; lng: number; label: string };
  triage: Triage;
  servicesNotified: boolean;
  responderId: string | null;
  stage: ResponderStage;
  assistance: string[];
  handoverTo: string | null;
};

export const RESPONDERS: Responder[] = [
  {
    id: "MR-2291",
    name: "Ramesh Yadav",
    role: "Petrol pump attendant · HP Fuels, NH-48",
    training: "Level 3 — Advanced",
    distanceKm: 0.8,
    etaMin: 3,
    verified: true,
    drills: 12,
  },
  {
    id: "MR-1874",
    name: "Sunita Devi",
    role: "Dhaba staff · Sharma Da Dhaba",
    training: "Level 2 — Intermediate",
    distanceKm: 1.4,
    etaMin: 5,
    verified: true,
    drills: 7,
  },
  {
    id: "MR-3310",
    name: "Arjun Nair",
    role: "Student volunteer · NSS, Govt. Polytechnic",
    training: "Level 2 — Intermediate",
    distanceKm: 2.1,
    etaMin: 7,
    verified: true,
    drills: 5,
  },
  {
    id: "MR-1042",
    name: "Iqbal Sheikh",
    role: "Toll plaza operator · Kherki Daula",
    training: "Level 3 — Advanced",
    distanceKm: 3.4,
    etaMin: 9,
    verified: true,
    drills: 18,
  },
  {
    id: "MR-5567",
    name: "Priya Menon",
    role: "Auto driver · Union first-aid cell",
    training: "Level 1 — Basic",
    distanceKm: 2.6,
    etaMin: 11,
    verified: false,
    drills: 2,
  },
];

export const TRAINING_MODULES = [
  {
    id: "scene",
    title: "Accident Scene Safety",
    minutes: 6,
    summary: "Park safely, switch on hazards, place a warning marker, watch for fuel and traffic.",
  },
  {
    id: "bleeding",
    title: "Severe Bleeding Control",
    minutes: 8,
    summary: "Direct firm pressure with clean cloth, keep pressing, elevate if no fracture.",
  },
  {
    id: "unconscious",
    title: "Unconscious Victim Monitoring",
    minutes: 7,
    summary: "Check response and breathing, protect the neck, keep the airway clear, keep watching.",
  },
  {
    id: "cpr",
    title: "CPR Awareness",
    minutes: 10,
    summary: "Recognise no-breathing, call 108 first, hands-only compressions until help arrives.",
  },
  {
    id: "rights",
    title: "Good Samaritan Rights",
    minutes: 5,
    summary: "Your rights while helping, what you must and must not be asked, how to document.",
  },
];

const DEMO_LOCATIONS = [
  { lat: 28.4211, lng: 77.0412, label: "NH-48, near Kherki Daula Toll, Gurugram, Haryana" },
  { lat: 19.0421, lng: 72.8617, label: "Western Express Hwy, near Bandra, Mumbai, Maharashtra" },
  { lat: 12.9611, lng: 77.6387, label: "Outer Ring Rd, near Domlur, Bengaluru, Karnataka" },
];

type Ctx = {
  incident: Incident | null;
  responder: Responder | null;
  completedModules: string[];
  activate: () => Incident;
  setTriage: (t: Partial<Triage>) => void;
  requestResponder: (id: string) => void;
  advanceStage: (stage: ResponderStage) => void;
  addAssistance: (item: string) => void;
  toggleModule: (id: string) => void;
  reset: () => void;
  runDemo: () => void;
};

const StoreContext = createContext<Ctx | null>(null);
const KEY = "rakshanet-state-v1";

function makeIncidentId() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RN-${stamp}-${rand}`;
}

export function RakshaNetProvider({ children }: { children: ReactNode }) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>(["scene", "bleeding"]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.incident) setIncident(parsed.incident);
        if (Array.isArray(parsed.completedModules)) setCompletedModules(parsed.completedModules);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ incident, completedModules }));
    } catch {
      /* ignore */
    }
  }, [incident, completedModules, hydrated]);

  const activate = useCallback(() => {
    const loc = DEMO_LOCATIONS[Math.floor(Math.random() * DEMO_LOCATIONS.length)];
    const next: Incident = {
      id: makeIncidentId(),
      createdAt: new Date().toISOString(),
      location: loc,
      triage: { conscious: null, breathing: null, bleeding: null, injured: null },
      servicesNotified: false,
      responderId: null,
      stage: "idle",
      assistance: [],
      handoverTo: null,
    };
    setIncident(next);
    return next;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      incident,
      responder: incident?.responderId
        ? (RESPONDERS.find((r) => r.id === incident.responderId) ?? null)
        : null,
      completedModules,
      activate,
      setTriage: (t) =>
        setIncident((i) => (i ? { ...i, triage: { ...i.triage, ...t }, servicesNotified: true } : i)),
      requestResponder: (id) =>
        setIncident((i) => (i ? { ...i, responderId: id, stage: "requested" } : i)),
      advanceStage: (stage) => setIncident((i) => (i ? { ...i, stage } : i)),
      addAssistance: (item) =>
        setIncident((i) =>
          i ? { ...i, assistance: i.assistance.includes(item) ? i.assistance : [...i.assistance, item] } : i,
        ),
      toggleModule: (id) =>
        setCompletedModules((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id])),
      reset: () => setIncident(null),
      runDemo: () => {
        const loc = DEMO_LOCATIONS[0];
        setIncident({
          id: makeIncidentId(),
          createdAt: new Date().toISOString(),
          location: loc,
          triage: { conscious: "no", breathing: "yes", bleeding: "yes", injured: 2 },
          servicesNotified: true,
          responderId: "MR-2291",
          stage: "en_route",
          assistance: ["Scene secured", "Bleeding controlled with direct pressure"],
          handoverTo: null,
        });
      },
    }),
    [incident, completedModules, activate],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useRakshaNet() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useRakshaNet must be used inside RakshaNetProvider");
  return ctx;
}

export const STAGE_LABEL: Record<ResponderStage, string> = {
  idle: "No responder requested",
  requested: "Request sent",
  accepted: "Accepted",
  en_route: "En route",
  arrived: "Arrived on scene",
  assisted: "Assistance provided",
  handover: "Handed over to emergency services",
};
