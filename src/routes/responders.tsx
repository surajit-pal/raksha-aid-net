import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { BadgeCheck, Clock, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RESPONDERS, STAGE_LABEL, useRakshaNet } from "@/lib/rakshanet-store";
import { FlowStrip } from "@/components/raksha/flow-strip";

export const Route = createFileRoute("/responders")({
  head: () => ({
    meta: [
      { title: "Nearby Micro-Responders | RakshaNet" },
      {
        name: "description",
        content:
          "Verified petrol-pump, dhaba, toll and student micro-responders ranked by estimated time-to-help, with live request and ETA tracking.",
      },
      { property: "og:title", content: "Nearby Micro-Responders | RakshaNet" },
      {
        property: "og:description",
        content: "Request the closest trained helper and track their ETA in real time.",
      },
    ],
  }),
  component: RespondersPage,
});

function RespondersPage() {
  const { incident, responder, requestResponder, advanceStage } = useRakshaNet();
  const ranked = [...RESPONDERS].sort((a, b) => a.etaMin - b.etaMin);

  useEffect(() => {
    if (incident?.stage === "requested") {
      const t = setTimeout(() => {
        advanceStage("accepted");
        toast.success("Responder accepted", { description: "They are moving to the scene now." });
        setTimeout(() => advanceStage("en_route"), 2500);
      }, 2000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [incident?.stage, advanceStage]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Badge className="bg-emergency-soft text-emergency">Step 3 · Connect</Badge>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Nearby micro-responders</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ranked by estimated time-to-help, not distance. Every responder is background-checked and
        drill-trained.
      </p>

      {!incident && (
        <Card className="mt-6 border-emergency/30 shadow-card">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">No active incident. Activate RakshaNet to request help.</p>
            <Button asChild variant="emergency">
              <Link to="/emergency">Activate RakshaNet</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {incident && responder && (
        <Card className="mt-6 border-verified/40 bg-verified-soft shadow-card">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-verified">
                  {STAGE_LABEL[incident.stage]}
                </p>
                <p className="mt-1 text-lg font-bold">
                  {responder.name} · {responder.id}
                </p>
                <p className="text-sm text-muted-foreground">{responder.role}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-bold text-verified">{responder.etaMin} min</p>
                <p className="text-xs text-muted-foreground">estimated arrival</p>
              </div>
            </div>
            <FlowStrip className="mt-5" activeIndex={incident.stage === "handover" ? 4 : 2} />
          </CardContent>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {ranked.map((r) => {
          const selected = incident?.responderId === r.id;
          return (
            <Card key={r.id} className="shadow-card">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold">{r.name}</h2>
                    {r.verified ? (
                      <Badge className="gap-1 bg-verified text-verified-foreground">
                        <BadgeCheck className="size-3.5" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Verification pending</Badge>
                    )}
                    <Badge variant="outline">{r.training}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{r.role}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" /> {r.distanceKm} km away
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Clock className="size-3.5" /> ETA {r.etaMin} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Navigation className="size-3.5" /> {r.drills} drills completed
                    </span>
                  </div>
                </div>
                <Button
                  variant={selected ? "verified" : "trust"}
                  size="lg"
                  disabled={!incident || !!incident.responderId}
                  onClick={() => {
                    requestResponder(r.id);
                    toast.info(`Request sent to ${r.name}`, { description: "Waiting for acceptance…" });
                  }}
                  className="sm:w-44"
                >
                  {selected ? STAGE_LABEL[incident!.stage] : "Request Responder"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {incident?.responderId && (
        <Button asChild variant="emergency" size="lg" className="mt-6 w-full">
          <Link to="/dashboard">Open responder view</Link>
        </Button>
      )}
    </div>
  );
}
