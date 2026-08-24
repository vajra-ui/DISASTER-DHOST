import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, MapPinned, Users, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Safety Dosth — Real-time safe navigation" },
      {
        name: "description",
        content:
          "Safety Dosth plans safer routes with live GPS, verified places, weather and community reports, and keeps your trusted circle in the loop.",
      },
      { property: "og:title", content: "Safety Dosth — Real-time safe navigation" },
      {
        property: "og:description",
        content: "Your Route. Your Dosth. Your Safety. Safer routes backed by real data, never guesses.",
      },
    ],
  }),
  component: Landing,
});

const SLIDES = [
  {
    icon: Radar,
    title: "Routes rated on real signals",
    body: "We compare live routes using verified public places, weather and community reports. Nothing is invented — missing data is shown as unavailable.",
  },
  {
    icon: Users,
    title: "Your trusted circle, one tap away",
    body: "Share a live journey link with the people who matter. They see your position and ETA until you arrive.",
  },
  {
    icon: MapPinned,
    title: "DOSTH MODE for the tense moments",
    body: "Instant access to nearby hospitals and police, plus a loud alert and an SOS message to your circle.",
  },
];

function Landing() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"splash" | "onboarding">("splash");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        navigate({ to: "/home" });
        return;
      }
      if (localStorage.getItem("sd-onboarded") === "1") {
        navigate({ to: "/auth" });
        return;
      }
      setPhase("onboarding");
    }, 1400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [navigate]);

  function next() {
    if (slide < SLIDES.length - 1) {
      setSlide(slide + 1);
      return;
    }
    localStorage.setItem("sd-onboarded", "1");
    navigate({ to: "/auth" });
  }

  if (phase === "splash") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center brand-gradient px-6 text-center">
        <span className="flex size-20 animate-scale-in items-center justify-center rounded-3xl bg-card shadow-lg">
          <ShieldCheck className="size-10 text-primary" />
        </span>
        <h1 className="mt-6 animate-fade-up font-display text-3xl font-semibold text-primary-foreground">
          Safety Dosth
        </h1>
        <p className="mt-2 animate-fade-in text-sm text-primary-foreground/85">
          Your Route. Your Dosth. Your Safety.
        </p>
      </div>
    );
  }

  const Current = SLIDES[slide]!;
  const Icon = Current.icon;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-sm animate-fade-up pt-10">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="size-8" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-semibold">{Current.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{Current.body}</p>
      </div>

      <div className="mx-auto w-full max-w-sm space-y-5">
        <div className="flex justify-center gap-2">
          {SLIDES.map((s, i) => (
            <span
              key={s.title}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
        <Button className="w-full" size="lg" onClick={next}>
          {slide === SLIDES.length - 1 ? "Get started" : "Next"}
        </Button>
        <button
          type="button"
          className="w-full text-center text-sm text-muted-foreground"
          onClick={() => {
            localStorage.setItem("sd-onboarded", "1");
            navigate({ to: "/auth" });
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
