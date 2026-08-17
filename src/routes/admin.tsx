import { createFileRoute } from "@tanstack/react-router";
import { Activity, Clock, Timer, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlowStrip } from "@/components/raksha/flow-strip";
import { RESPONDERS, STAGE_LABEL, useRakshaNet } from "@/lib/rakshanet-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Network Operations Dashboard | RakshaNet" },
      {
        name: "description",
        content:
          "Active incidents, available responders, responders en route, median time-to-first-help and bystander intervention rate across the RakshaNet network.",
      },
      { property: "og:title", content: "Network Operations Dashboard | RakshaNet" },
      {
        property: "og:description",
        content: "Live operational metrics for the community first-response network.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { incident, responder } = useRakshaNet();
  const activeIncidents = incident ? 4 : 3;
  const enRoute = incident && ["accepted", "en_route"].includes(incident.stage) ? 3 : 2;

  const stats = [
    { icon: Activity, label: "Active incidents", value: String(activeIncidents), tone: "text-emergency" },
    { icon: Users, label: "Available responders", value: String(RESPONDERS.length + 37), tone: "text-trust" },
    { icon: Timer, label: "Responders en route", value: String(enRoute), tone: "text-warn" },
    { icon: Clock, label: "Median time-to-first-help", value: "4m 12s", tone: "text-verified" },
    { icon: TrendingUp, label: "Bystander intervention rate", value: "68%", tone: "text-verified" },
  ];

  const feed = [
    { id: "RN-20260817-4412", place: "NH-44, Panipat bypass", status: "Responder arrived", tone: "verified" },
    { id: "RN-20260817-4408", place: "Mumbai–Pune Expy, km 42", status: "Ambulance en route", tone: "trust" },
    { id: "RN-20260817-4401", place: "ORR, Hyderabad", status: "Handover complete", tone: "verified" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Badge className="bg-trust-soft text-trust">Network operations</Badge>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Admin dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Live view of the RakshaNet corridor network (simulated demo data).
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-5">
              <s.icon className={`size-5 ${s.tone}`} />
              <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Response chain</CardTitle>
          </CardHeader>
          <CardContent>
            <FlowStrip activeIndex={incident ? (incident.stage === "handover" ? 4 : 2) : 1} />
            <div className="mt-6 rounded-2xl border border-border bg-trust-soft/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-trust">
                Corridor map · NH-48 Gurugram sector
              </p>
              <div className="relative mt-4 h-44 overflow-hidden rounded-xl border border-border bg-card">
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-border" />
                {[
                  { left: "8%", label: "Accident", cls: "bg-emergency text-emergency-foreground" },
                  { left: "34%", label: "Responder", cls: "bg-warn text-primary-foreground" },
                  { left: "62%", label: "108 Unit", cls: "bg-trust text-trust-foreground" },
                  { left: "88%", label: "Hospital", cls: "bg-verified text-verified-foreground" },
                ].map((n) => (
                  <div
                    key={n.label}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                    style={{ left: n.left }}
                  >
                    <span
                      className={`mx-auto flex size-8 items-center justify-center rounded-full text-[10px] font-bold ${n.cls}`}
                    >
                      ●
                    </span>
                    <span className="mt-2 block text-[11px] font-semibold">{n.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Live incident feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {incident && (
              <div className="rounded-xl border border-emergency/40 bg-emergency-soft p-3">
                <p className="text-sm font-bold">{incident.id}</p>
                <p className="text-xs text-muted-foreground">{incident.location.label}</p>
                <p className="mt-1 text-xs font-semibold text-emergency">
                  {STAGE_LABEL[incident.stage]}
                  {responder ? ` · ${responder.name}` : ""}
                </p>
              </div>
            )}
            {feed.map((f) => (
              <div key={f.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-bold">{f.id}</p>
                <p className="text-xs text-muted-foreground">{f.place}</p>
                <p
                  className={`mt-1 text-xs font-semibold ${f.tone === "verified" ? "text-verified" : "text-trust"}`}
                >
                  {f.status}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
