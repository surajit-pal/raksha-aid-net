import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  HeartPulse,
  MapPin,
  ScrollText,
  ShieldCheck,
  Siren,
  Users,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FlowStrip } from "@/components/raksha/flow-strip";
import { useRakshaNet } from "@/lib/rakshanet-store";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RakshaNet — Help in India's Golden Hour" },
      {
        name: "description",
        content:
          "When every minute matters, help shouldn't have to wait. RakshaNet guides bystanders, connects verified micro-responders and documents assistance.",
      },
      { property: "og:title", content: "RakshaNet — Help in India's Golden Hour" },
      {
        property: "og:description",
        content:
          "Guide, connect, assure, handover — a community first-response network for road accidents.",
      },
    ],
  }),
  component: Index,
});

const PILLARS = [
  {
    icon: HeartPulse,
    title: "GUIDE",
    body: "Voice-first, step-by-step actions any bystander can follow in the first 90 seconds.",
  },
  {
    icon: Users,
    title: "CONNECT",
    body: "Alerts the nearest verified micro-responders and emergency services at the same time.",
  },
  {
    icon: ShieldCheck,
    title: "ASSURE",
    body: "Good Samaritan rights explained up-front so fear never delays a life-saving action.",
  },
  {
    icon: ScrollText,
    title: "HANDOVER",
    body: "Clean handover to ambulance crews plus a RakshaPass assistance record.",
  },
];

function Index() {
  const { runDemo } = useRakshaNet();

  return (
    <div>
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Siren className="size-3.5" /> Golden hour response · India
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            When every minute matters, help shouldn&apos;t have to wait.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-primary-foreground/80 sm:text-lg">
            Nearly every road-accident death in India is a race against the first hour. RakshaNet
            turns the people already at the scene into a guided, verified, accountable first-response
            layer — before the ambulance arrives.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="emergency" size="xl" className="pulse-ring relative">
              <Link to="/emergency">ACTIVATE RAKSHANET</Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
              onClick={() => {
                runDemo();
                toast.success("Demo incident loaded", {
                  description: "Responder MR-2291 is en route. Explore any screen.",
                });
              }}
            >
              <PlayCircle /> Run demo scenario
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["1.7 lakh", "road deaths a year"],
              ["<60 min", "the golden hour"],
              ["4 min", "median RakshaNet first-help"],
              ["100%", "responders verified"],
            ].map(([k, v]) => (
              <div key={v} className="rounded-xl border border-white/15 bg-white/5 p-4">
                <dt className="font-display text-2xl font-bold">{k}</dt>
                <dd className="mt-1 text-xs text-primary-foreground/70">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">Why bystanders freeze</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "They don't know what to do",
              b: "Without training, the safest instinct is to stand back. Minutes with survivable bleeding are lost.",
            },
            {
              t: "They don't know who can help",
              b: "The petrol pump 400 m away may have a first-aid trained worker — nobody knows to call them.",
            },
            {
              t: "They fear the consequences",
              b: "Police questioning, hospital paperwork and court appearances still deter people from helping.",
            },
          ].map((c) => (
            <Card key={c.t} className="shadow-card">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold sm:text-3xl">The RakshaNet flow</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            One activation triggers all four stages in parallel.
          </p>
          <FlowStrip className="mt-6" />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <Card key={p.title} className="border-border shadow-card">
                <CardContent className="p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-trust-soft text-trust">
                    <p.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-bold tracking-widest text-emergency">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: MapPin, t: "Live incident map", d: "Location, triage and responder status in one view.", to: "/admin" as const },
            { icon: Clock, t: "Time-to-first-help", d: "Every second measured, from activation to handover.", to: "/dashboard" as const },
            { icon: ShieldCheck, t: "RakshaPass record", d: "Printable Good Samaritan assistance documentation.", to: "/rakshapass" as const },
          ].map((c) => (
            <Link key={c.t} to={c.to} className="group">
              <Card className="h-full shadow-card transition-transform group-hover:-translate-y-1">
                <CardContent className="p-6">
                  <c.icon className="size-5 text-trust" />
                  <h3 className="mt-4 font-semibold">{c.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
