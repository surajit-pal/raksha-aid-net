import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Guide Me — Voice-First Emergency Guidance | RakshaNet" },
      {
        name: "description",
        content:
          "Large-button, spoken step-by-step bystander guidance for scene safety, severe bleeding and monitoring an unconscious person.",
      },
      { property: "og:title", content: "Guide Me — Voice-First Emergency Guidance" },
      {
        property: "og:description",
        content: "Simple spoken first-response steps. No diagnosis, only safe actions.",
      },
    ],
  }),
  component: GuidePage,
});

type Track = { id: string; label: string; steps: { title: string; detail: string }[] };

const TRACKS: Track[] = [
  {
    id: "scene",
    label: "Make the scene safe",
    steps: [
      {
        title: "Protect yourself first",
        detail:
          "Stop your vehicle safely on the shoulder. Switch on hazard lights. Do not stand in the traffic lane.",
      },
      {
        title: "Warn oncoming traffic",
        detail:
          "Place a triangle, cone or any bright object about fifty steps before the accident scene.",
      },
      {
        title: "Check for fire or fuel",
        detail:
          "If you smell petrol or see smoke, stay back and keep everyone away. Do not light anything.",
      },
      {
        title: "Call for help",
        detail:
          "Dial one one two. Tell them the highway name, the nearest landmark and how many people are hurt.",
      },
    ],
  },
  {
    id: "bleeding",
    label: "Control severe bleeding",
    steps: [
      {
        title: "Cover your hands",
        detail: "Use gloves, a plastic bag or a clean cloth between your hands and the blood.",
      },
      {
        title: "Press hard and directly",
        detail:
          "Place a clean cloth on the wound and press firmly with the heel of your hand. Do not lift to check.",
      },
      {
        title: "Keep pressing",
        detail:
          "If the cloth soaks through, add another cloth on top. Keep steady pressure until help arrives.",
      },
      {
        title: "Keep them warm and talking",
        detail:
          "Cover them with a jacket or blanket. Speak calmly and keep telling them help is on the way.",
      },
    ],
  },
  {
    id: "unconscious",
    label: "Monitor an unconscious person",
    steps: [
      {
        title: "Check response",
        detail: "Tap the shoulder firmly and ask loudly if they can hear you. Do not shake the head.",
      },
      {
        title: "Watch the breathing",
        detail:
          "Look at the chest for ten seconds. If the chest is rising and falling, they are breathing.",
      },
      {
        title: "Do not move the neck",
        detail:
          "Keep the head, neck and back in a straight line. Only move them if there is fire or traffic danger.",
      },
      {
        title: "Stay and keep watching",
        detail:
          "If breathing stops, tell the ambulance operator immediately and follow their instructions.",
      },
    ],
  },
];

function GuidePage() {
  const [trackId, setTrackId] = useState<string>("scene");
  const [step, setStep] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const stopRef = useRef<() => void>(() => {});

  const track = TRACKS.find((t) => t.id === trackId)!;
  const current = track.steps[step]!;

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92;
    u.pitch = 1;
    u.lang = "en-IN";
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
    stopRef.current = () => {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    };
  };

  const guideMe = () => speak(`Step ${step + 1}. ${current.title}. ${current.detail}`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Badge className="bg-emergency-soft text-emergency">Step 2 · Guidance</Badge>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Guide Me</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tap a situation, then press Guide Me and listen. Keep your hands free for the person.
      </p>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {TRACKS.map((t) => (
          <Button
            key={t.id}
            size="lg"
            variant={t.id === trackId ? "trust" : "outline"}
            className="h-auto whitespace-normal py-4"
            onClick={() => {
              setTrackId(t.id);
              setStep(0);
              stopRef.current();
            }}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <Card className="mt-6 border-trust/25 shadow-card">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>
              Step {step + 1} of {track.steps.length}
            </span>
            <span>{track.label}</span>
          </div>
          <Progress className="mt-3" value={((step + 1) / track.steps.length) * 100} />

          <h2 className="mt-6 text-2xl font-bold sm:text-3xl">{current.title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{current.detail}</p>

          <div className="mt-8 grid gap-3">
            <Button
              variant="emergency"
              size="xl"
              onClick={speaking ? () => stopRef.current() : guideMe}
              disabled={!supported}
              className={cn(speaking && "pulse-ring relative")}
            >
              {speaking ? (
                <>
                  <Square /> Stop reading
                </>
              ) : (
                <>🎙️ Guide Me</>
              )}
            </Button>
            {!supported && (
              <p className="text-center text-xs text-muted-foreground">
                Voice output isn&apos;t available in this browser — read the steps above.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                variant="outline"
                disabled={step === 0}
                onClick={() => {
                  stopRef.current();
                  setStep((s) => Math.max(0, s - 1));
                }}
              >
                <ChevronLeft /> Back
              </Button>
              <Button
                size="lg"
                variant="trust"
                disabled={step === track.steps.length - 1}
                onClick={() => {
                  stopRef.current();
                  setStep((s) => Math.min(track.steps.length - 1, s + 1));
                }}
              >
                Next <ChevronRight />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3 rounded-xl border border-warn/40 bg-emergency-soft p-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warn" />
        <p className="text-sm text-foreground/80">
          RakshaNet gives safe first-response guidance only. It does not diagnose injuries or replace
          a doctor. Always follow the emergency operator&apos;s instructions.
        </p>
      </div>

      <Button asChild variant="trust" size="lg" className="mt-6 w-full">
        <Link to="/responders">Get a trained responder here</Link>
      </Button>
    </div>
  );
}
