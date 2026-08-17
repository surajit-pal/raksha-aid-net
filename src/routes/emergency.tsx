import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MapPin, Phone, Siren } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlowStrip } from "@/components/raksha/flow-strip";
import { useRakshaNet, type Triage } from "@/lib/rakshanet-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Activate RakshaNet — Emergency Response" },
      {
        name: "description",
        content:
          "Activate RakshaNet to capture location, generate an incident ID, alert emergency services and answer four quick triage questions.",
      },
      { property: "og:title", content: "Activate RakshaNet — Emergency Response" },
      {
        property: "og:description",
        content: "One tap starts location capture, service notification and responder dispatch.",
      },
    ],
  }),
  component: EmergencyPage,
});

const QUESTIONS: { key: keyof Triage; q: string; help: string }[] = [
  { key: "conscious", q: "Is the person conscious?", help: "Tap their shoulder and speak loudly." },
  { key: "breathing", q: "Are they breathing normally?", help: "Watch the chest for 10 seconds." },
  { key: "bleeding", q: "Is there severe bleeding?", help: "Blood soaking clothes or pooling." },
];

function EmergencyPage() {
  const { incident, activate, setTriage } = useRakshaNet();
  const [locating, setLocating] = useState(false);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!incident) return;
    const t = setTimeout(() => setNotified(true), 1400);
    return () => clearTimeout(t);
  }, [incident]);

  const onActivate = () => {
    setLocating(true);
    setTimeout(() => {
      const inc = activate();
      setLocating(false);
      setNotified(false);
      toast.success(`Incident ${inc.id} created`, { description: "Location captured." });
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {!incident ? (
        <div className="text-center">
          <Badge className="bg-emergency-soft text-emergency">Step 1 · Activate</Badge>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">You are the first responder.</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            One tap captures your location, opens an incident, alerts 112/108 and pings verified
            micro-responders around you.
          </p>

          <div className="mt-10 flex justify-center">
            <Button
              variant="emergency"
              size="xl"
              className="pulse-ring relative h-40 w-full max-w-md rounded-3xl text-2xl"
              onClick={onActivate}
              disabled={locating}
            >
              {locating ? (
                <>
                  <Loader2 className="animate-spin" /> Capturing location…
                </>
              ) : (
                <>
                  <Siren className="!size-7" /> ACTIVATE RAKSHANET
                </>
              )}
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Prototype: location is simulated. In a real emergency always dial 112.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <FlowStrip activeIndex={notified ? 3 : 1} />

          <Card className="border-emergency/30 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Incident {incident.id}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Opened {new Date(incident.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <Badge className="bg-emergency text-emergency-foreground">LIVE</Badge>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <MapPin className="size-3.5" /> Location captured
                </p>
                <p className="mt-2 text-sm font-medium">{incident.location.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)} · ±12 m
                </p>
              </div>
              <div
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  notified ? "border-verified/40 bg-verified-soft" : "border-border bg-muted/40",
                )}
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Phone className="size-3.5" /> Emergency services
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                  {notified ? (
                    <>
                      <CheckCircle2 className="size-4 text-verified" /> 112 &amp; 108 notified
                    </>
                  ) : (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Transmitting incident…
                    </>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ambulance dispatch acknowledged · ETA 18 min (simulated)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick assessment</CardTitle>
              <p className="text-sm text-muted-foreground">
                Answer only what you can see safely. Never move the person unless there is fire or
                traffic danger.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {QUESTIONS.map((q) => (
                <div key={q.key}>
                  <p className="text-base font-semibold">{q.q}</p>
                  <p className="text-xs text-muted-foreground">{q.help}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(["yes", "no", "unsure"] as const).map((opt) => {
                      const active = incident.triage[q.key] === opt;
                      return (
                        <Button
                          key={opt}
                          size="lg"
                          variant={active ? "trust" : "outline"}
                          onClick={() => setTriage({ [q.key]: opt } as Partial<Triage>)}
                          className="capitalize"
                        >
                          {opt}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div>
                <p className="text-base font-semibold">How many people are injured?</p>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Button
                      key={n}
                      size="lg"
                      variant={incident.triage.injured === n ? "trust" : "outline"}
                      onClick={() => setTriage({ injured: n })}
                    >
                      {n === 5 ? "5+" : n}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="emergency" size="lg" className="flex-1">
              <Link to="/guide">🎙️ Guide me now</Link>
            </Button>
            <Button asChild variant="trust" size="lg" className="flex-1">
              <Link to="/responders">Find nearby responders</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
