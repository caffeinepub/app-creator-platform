import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Box,
  Code2,
  Film,
  Gamepad2,
  Globe,
  Image,
  Layers,
  LayoutDashboard,
  Loader2,
  Music,
  Play,
  Radio,
  Smartphone,
  Sparkles,
  User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import LoginButton from "../components/LoginButton";
import Logo from "../components/Logo";
import { useCreateSession } from "../hooks/useQueries";

type ProjectTypeItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
  group: "Apps" | "Creative";
};

const projectTypes: ProjectTypeItem[] = [
  {
    id: "fullstack",
    icon: <Code2 className="w-6 h-6" />,
    label: "Full-Stack App",
    desc: "CRUD interface with data management",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    group: "Apps",
  },
  {
    id: "landing",
    icon: <Globe className="w-6 h-6" />,
    label: "Landing Page",
    desc: "Marketing site with hero, features, and CTA",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    group: "Apps",
  },
  {
    id: "mobile",
    icon: <Smartphone className="w-6 h-6" />,
    label: "Mobile UI",
    desc: "Touch-friendly mobile-first interface",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    group: "Apps",
  },
  {
    id: "dashboard",
    icon: <LayoutDashboard className="w-6 h-6" />,
    label: "Dashboard",
    desc: "Analytics with charts and KPI cards",
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
    group: "Apps",
  },
  {
    id: "game",
    icon: <Gamepad2 className="w-6 h-6" />,
    label: "Game",
    desc: "Interactive browser-based game with sound",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    group: "Apps",
  },
  {
    id: "3d",
    icon: <Box className="w-6 h-6" />,
    label: "3D Scene",
    desc: "WebGL 3D scene with Three.js and animations",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
    group: "Creative",
  },
  {
    id: "video",
    icon: <Film className="w-6 h-6" />,
    label: "Cinematic Video",
    desc: "Multi-scene 3D timelines with video export",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    group: "Creative",
  },
  {
    id: "4d",
    icon: <Layers className="w-6 h-6" />,
    label: "4D Animation",
    desc: "True 4D hypercube projections and tesseracts",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    group: "Creative",
  },
  {
    id: "animation",
    icon: <Play className="w-6 h-6" />,
    label: "Animation",
    desc: "Canvas animations, motion graphics, sequences",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    group: "Creative",
  },
  {
    id: "sound",
    icon: <Music className="w-6 h-6" />,
    label: "Music & Sound",
    desc: "Synthesizers, music tools, audio apps",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    group: "Creative",
  },
  {
    id: "image",
    icon: <Image className="w-6 h-6" />,
    label: "Generative Art",
    desc: "Procedural art, visual effects, canvas art",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    group: "Creative",
  },
  {
    id: "avatar",
    icon: <User className="w-6 h-6" />,
    label: "3D Avatar",
    desc: "Build and customize a 3D avatar",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-400/20",
    group: "Creative",
  },
  {
    id: "sounddirection",
    icon: <Radio className="w-6 h-6" />,
    label: "Sound Director",
    desc: "Compose layered soundscapes automatically",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    group: "Creative",
  },
];

const appsTypes = projectTypes.filter((t) => t.group === "Apps");
const creativeTypes = projectTypes.filter((t) => t.group === "Creative");

export default function NewSessionPage() {
  const navigate = useNavigate();
  const createSession = useCreateSession();
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState("fullstack");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a project name.");
      return;
    }
    setError("");
    try {
      const session = await createSession.mutateAsync({
        name: trimmed,
        projectType: selectedType,
      });
      if (session) {
        navigate({
          to: "/sessions/$sessionId",
          params: { sessionId: session.id },
        });
      } else {
        setError("Failed to create session. Please try again.");
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e?.message || "Failed to create session. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !createSession.isPending) {
      handleCreate();
    }
  };

  function TypeGrid({
    types,
    startIdx,
  }: { types: ProjectTypeItem[]; startIdx: number }) {
    return (
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        data-ocid="newsession.types.list"
      >
        {types.map((type, i) => (
          <button
            type="button"
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            data-ocid={`newsession.types.item.${startIdx + i + 1}`}
            className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
              selectedType === type.id
                ? `${type.bg} ${type.border} border-2`
                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
            }`}
          >
            {selectedType === type.id && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current opacity-60" />
            )}
            <div className={`${type.color} mb-2`}>{type.icon}</div>
            <div className="text-sm font-medium text-foreground mb-1">
              {type.label}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {type.desc}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="hover:opacity-80 transition-opacity"
          >
            <Logo size="small" />
          </button>
          <LoginButton />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate({ to: "/sessions" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          data-ocid="newsession.back.button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sessions
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            New Session
          </h1>
          <p className="text-muted-foreground text-sm">
            Give your project a name and choose what you want to build.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Project name */}
          <div className="space-y-3">
            <label
              htmlFor="proj-name"
              className="text-sm font-medium text-foreground/80"
            >
              Project Name
            </label>
            <input
              id="proj-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Solar System 3D, Particle Galaxy, My Portfolio..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 transition-all"
              data-ocid="newsession.name.input"
            />
            {error && (
              <p
                className="text-xs text-red-400"
                data-ocid="newsession.name.error_state"
              >
                {error}
              </p>
            )}
          </div>

          {/* Project type */}
          <div className="space-y-5">
            <span className="text-sm font-medium text-foreground/80">
              Project Type
            </span>

            {/* Apps group */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Apps
              </p>
              <TypeGrid types={appsTypes} startIdx={0} />
            </div>

            {/* Creative group */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Creative
              </p>
              <TypeGrid types={creativeTypes} startIdx={appsTypes.length} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleCreate}
            disabled={createSession.isPending || !name.trim()}
            className="w-full btn-primary py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-lg shadow-brand/20 hover:shadow-brand/30 hover:-translate-y-0.5"
            data-ocid="newsession.submit_button"
          >
            {createSession.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Create Session
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
