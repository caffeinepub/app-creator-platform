import { Bell, Leaf, Music, Sunrise } from "lucide-react";
import React from "react";
import MorningToneSettings from "../components/MorningToneSettings";

const STEPS = [
  {
    icon: Bell,
    label: "Soft Bell",
    desc: "A gentle bell tone to ease you awake",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Leaf,
    label: "Nature Ambience",
    desc: "Calming forest sounds to ground your mind",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Music,
    label: "Uplifting Chord",
    desc: "A major chord to inspire your day",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
];

export default function MorningTonePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 mb-2">
            <Sunrise className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">
            Manifestation Morning Tone
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start each day with intention. A three-step audio sequence designed
            to gently wake you, ground your mind in nature, and uplift your
            spirit with harmonious sound.
          </p>
        </div>

        {/* Sequence Steps Visual */}
        <div className="grid grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: no stable key for static dots
              key={i}
              className="glass-card rounded-2xl p-4 text-center space-y-2"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${step.bg} mx-auto`}
              >
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <p className="font-semibold text-sm">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Settings */}
        <MorningToneSettings />
      </div>
    </div>
  );
}
