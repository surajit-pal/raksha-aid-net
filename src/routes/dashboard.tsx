import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, MapPin, Radio } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STAGE_LABEL, useRakshaNet, type ResponderStage } from "@/lib/rakshanet-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Responder Dashboard | RakshaNet" },
      {
        name: "description",
        content:
          "Micro-responder console: accept incoming accident alerts, move through en route, arrived, assistance provided and handover.",
      },
      { property: "og:title", content: "Responder Dashboard | RakshaNet" },
      {
        property: "og:description",
        content: "Accept alerts and log each stage from dispatch to handover.",
      },
    ],
  }),
  component: ResponderDashboard,
});

const STAGES: ResponderStage[] = ["accepted", "en_route", "arrived", "assisted", "handover"];

const ASSIST_OPTIONS = [
  "Scene secured",
  "Traffic warning placed",
  "Bleeding controlled with direct pressure",
  "Airway monitored",
  "Victim kept warm and reassured",
  "Ambulance guided to exact spot",
];

function ResponderDashboard() {
  const { incident, responder, advanceStage, addAssistance } = useRakshaNet();

  if (!incident) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Radio className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">No active alerts</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You are on standby. Alerts appear here the moment an incident opens near you.
        </p>
        <Button asChild variant="emergency" size="lg" className="mt-6">
          <Link to="/emergency">Simulate an incident</Link>
        </Button>
      </div>
    );
  }

  const stageIndex = STAGES.indexOf(incident.stage);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Badge className="bg-trust-soft text-trust">Responder console</Badge>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
        {responder ? responder.name : "Micro-responder"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {responder ? `${responder.id} · ${responder.training}` : "Awaiting assignment"}
      </p>

      <Card className="mt-6 border-emergency/30 shadow-card">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="size-5 text-emergency" /> Incoming alert · {incident.id}
            </CardTitle>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> {incident.location.label}
            </p>
          </div>
          <Badge className="bg-emergency text-emergency-foreground">
            {STAGE_LABEL[incident.stage]}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          {[
            ["Conscious", incident.triage.conscious ?? "—"],
            ["Breathing", incident.triage.breathing ?? "—"],
            ["Severe bleeding", incident.triage.bleeding ?? "—"],
            ["Injured", incident.triage.injured ? String(incident.triage.injured) : "—"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</p>
              <p className="mt-1 text-sm font-semibold capitalize">{v}</p>
            </div>
          ))}
          <div className="sm:col-span-4 rounded-xl border border-border bg-muted/40 p-3 text-sm">
            ETA to scene:{" "}
            <span className="font-semibold">{responder ? `${responder.etaMin} min` : "—"}</span> ·
            Ambulance ETA <span className="font-semibold">18 min</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Response timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {STAGES.map((s, i) => {
            const done = stageIndex >= i;
            const isNext = stageIndex === i - 1 || (stageIndex < 0 && i === 0);
            return (
              <div
                key={s}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors",
                  done ? "border-verified/40 bg-verified-soft" : "border-border",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  {done ? (
                    <CheckCircle2 className="size-4 text-verified" />
                  ) : (
                    <span className="size-4 rounded-full border border-border" />
                  )}
                  {STAGE_LABEL[s]}
                </span>
                {!done && (
                  <Button
                    size="sm"
                    variant={isNext ? "emergency" : "outline"}
                    disabled={!isNext}
                    onClick={() => {
                      advanceStage(s);
                      toast.success(STAGE_LABEL[s]);
                    }}
                  >
                    Mark {s === "accepted" ? "accepted" : STAGE_LABEL[s].toLowerCase()}
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="mt-6 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Log assistance provided</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {ASSIST_OPTIONS.map((a) => {
            const on = incident.assistance.includes(a);
            return (
              <Button
                key={a}
                size="sm"
                variant={on ? "verified" : "outline"}
                onClick={() => addAssistance(a)}
              >
                {a}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {incident.stage === "handover" && (
        <Button asChild variant="trust" size="lg" className="mt-6 w-full">
          <Link to="/rakshapass">Generate RakshaPass</Link>
        </Button>
      )}
    </div>
  );
}
