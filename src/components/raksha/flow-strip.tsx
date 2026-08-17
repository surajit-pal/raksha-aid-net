import { AlertTriangle, ArrowRight, BellRing, HeartPulse, Hospital, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: AlertTriangle, label: "Accident", tone: "emergency" },
  { icon: HeartPulse, label: "Guidance", tone: "warn" },
  { icon: Users, label: "Nearby Responder", tone: "trust" },
  { icon: BellRing, label: "Emergency Services", tone: "trust" },
  { icon: Hospital, label: "Hospital", tone: "verified" },
] as const;

const TONE: Record<string, string> = {
  emergency: "bg-emergency-soft text-emergency",
  warn: "bg-emergency-soft text-warn",
  trust: "bg-trust-soft text-trust",
  verified: "bg-verified-soft text-verified",
};

export function FlowStrip({
  activeIndex = -1,
  className,
}: {
  activeIndex?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 sm:gap-3", className)}>
      {STEPS.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-card transition-all",
              i <= activeIndex && "border-transparent ring-2 ring-verified/50",
            )}
          >
            <span className={cn("flex size-8 items-center justify-center rounded-lg", TONE[s.tone])}>
              <s.icon className="size-4" />
            </span>
            <span className="text-xs font-semibold sm:text-sm">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && <ArrowRight className="size-4 shrink-0 text-muted-foreground" />}
        </div>
      ))}
    </div>
  );
}
