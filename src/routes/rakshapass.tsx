import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Printer, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRakshaNet } from "@/lib/rakshanet-store";

export const Route = createFileRoute("/rakshapass")({
  head: () => ({
    meta: [
      { title: "RakshaPass — Good Samaritan Assistance Record | RakshaNet" },
      {
        name: "description",
        content:
          "A printable digital record of assistance provided at an accident: incident ID, responder ID, location, time, actions and emergency-services notification.",
      },
      { property: "og:title", content: "RakshaPass — Good Samaritan Assistance Record" },
      {
        property: "og:description",
        content: "Documentation of help provided during an accident response.",
      },
    ],
  }),
  component: RakshaPassPage,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="sm:col-span-2 text-sm font-medium">{value}</dd>
    </div>
  );
}

function RakshaPassPage() {
  const { incident, responder } = useRakshaNet();

  if (!incident) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <ShieldPlus className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">No assistance record yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A RakshaPass is generated once assistance has been provided at an incident.
        </p>
        <Button asChild variant="emergency" size="lg" className="mt-6">
          <Link to="/emergency">Start an incident</Link>
        </Button>
      </div>
    );
  }

  const dt = new Date(incident.createdAt);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge className="bg-verified-soft text-verified">Step 4 · Assure &amp; handover</Badge>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">RakshaPass</h1>
        </div>
        <Button variant="trust" size="lg" onClick={() => window.print()}>
          <Printer /> Print / Download
        </Button>
      </div>

      <Card className="mt-6 border-verified/40 shadow-card">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-emergency-gradient text-emergency-foreground">
                <ShieldPlus className="size-6" />
              </span>
              <div>
                <p className="font-display text-lg font-bold">Good Samaritan Assistance Record</p>
                <p className="text-xs text-muted-foreground">
                  Issued by RakshaNet Community First-Response Network
                </p>
              </div>
            </div>
            <Badge className="gap-1 bg-verified text-verified-foreground">
              <BadgeCheck className="size-3.5" /> Verified
            </Badge>
          </div>

          <dl className="divide-y divide-border">
            <Row label="Incident ID" value={incident.id} />
            <Row
              label="Responder"
              value={responder ? `${responder.name} · ${responder.id} · ${responder.training}` : "Bystander (unregistered)"}
            />
            <Row label="Location" value={incident.location.label} />
            <Row
              label="Coordinates"
              value={`${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`}
            />
            <Row label="Date &amp; time" value={dt.toLocaleString("en-IN")} />
            <Row
              label="Assistance provided"
              value={incident.assistance.length ? incident.assistance.join(" · ") : "Scene support and monitoring"}
            />
            <Row
              label="Emergency services"
              value={
                incident.servicesNotified
                  ? "112 and 108 notified at activation · dispatch acknowledged"
                  : "Notification pending"
              }
            />
            <Row
              label="Handover"
              value={
                incident.stage === "handover"
                  ? "Handed over to ambulance crew on scene"
                  : "Handover not yet recorded"
              }
            />
          </dl>

          <Separator className="my-6" />

          <p className="rounded-xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Important:</strong> RakshaPass is documentation of
            assistance rendered. It records what happened and when — it does not itself create legal
            immunity or confer any legal status. Good Samaritan protections come from the applicable
            law and guidelines, not from this record.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
