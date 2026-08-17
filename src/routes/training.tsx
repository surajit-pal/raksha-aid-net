import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, CheckCircle2, Circle, Clock, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TRAINING_MODULES, useRakshaNet } from "@/lib/rakshanet-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Micro-Responder Training | RakshaNet" },
      {
        name: "description",
        content:
          "Five short modules — scene safety, severe bleeding, unconscious victims, CPR awareness and Good Samaritan rights — to become a verified micro-responder.",
      },
      { property: "og:title", content: "Micro-Responder Training | RakshaNet" },
      {
        property: "og:description",
        content: "Short, practical training that turns bystanders into verified responders.",
      },
    ],
  }),
  component: TrainingPage,
});

function TrainingPage() {
  const { completedModules, toggleModule } = useRakshaNet();
  const pct = Math.round((completedModules.length / TRAINING_MODULES.length) * 100);
  const verified = completedModules.length === TRAINING_MODULES.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Badge className="bg-trust-soft text-trust">Micro-responder academy</Badge>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Training</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thirty-six minutes total. Finish all five modules to appear as a verified responder on the
        network.
      </p>

      <Card className={cn("mt-6 shadow-card", verified && "border-verified/40 bg-verified-soft")}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Your status
              </p>
              <p className="mt-1 flex items-center gap-2 font-display text-xl font-bold">
                {verified ? (
                  <>
                    <BadgeCheck className="size-5 text-verified" /> Verified Micro-Responder
                  </>
                ) : (
                  <>
                    <GraduationCap className="size-5 text-trust" /> In training
                  </>
                )}
              </p>
            </div>
            <p className="font-display text-3xl font-bold">{pct}%</p>
          </div>
          <Progress className="mt-4" value={pct} />
          <p className="mt-2 text-xs text-muted-foreground">
            {completedModules.length} of {TRAINING_MODULES.length} modules complete
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        {TRAINING_MODULES.map((m) => {
          const done = completedModules.includes(m.id);
          return (
            <Card key={m.id} className="shadow-card">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    done ? "bg-verified-soft text-verified" : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}
                </span>
                <div className="flex-1">
                  <h2 className="text-base font-bold">{m.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{m.summary}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> {m.minutes} min
                  </p>
                </div>
                <Button
                  variant={done ? "outline" : "trust"}
                  size="lg"
                  className="sm:w-40"
                  onClick={() => toggleModule(m.id)}
                >
                  {done ? "Mark incomplete" : "Complete module"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
