import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Box,
  Camera,
  Code2,
  Cpu,
  Film,
  Gamepad2,
  Globe,
  LayoutDashboard,
  Loader2,
  Music,
  Server,
  Smartphone,
  Sparkles,
  User,
  Video,
  Waves,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import LoginButton from "../components/LoginButton";
import Logo from "../components/Logo";
import { useCreateSession } from "../hooks/useQueries";

const projectTypes = [
  {
    id: "video",
    icon: <Video className="w-6 h-6" />,
    label: "Cinematic 3D Video",
    desc: "Long realistic animated 3D videos with multi-scene timelines",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
  },
  {
    id: "4d",
    icon: <Cpu className="w-6 h-6" />,
    label: "4D Animation",
    desc: "True 4D hypercube projections, tesseracts, and dimensional rotation",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    id: "image",
    icon: <Camera className="w-6 h-6" />,
    label: "Image Generation",
    desc: "Generate realistic images and visual art with AI",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
  },
  {
    id: "avatar",
    icon: <User className="w-6 h-6" />,
    label: "Avatar Creation",
    desc: "Build and customize your 3D clone avatar",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-400/20",
  },
  {
    id: "sounddirection",
    icon: <Music className="w-6 h-6" />,
    label: "Sound Direction",
    desc: "Compose layered soundscapes and music automatically",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
  },
  {
    id: "landing",
    icon: <Globe className="w-6 h-6" />,
    label: "Landing Page",
    desc: "Marketing site with hero, features, and CTA",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    id: "fullstack",
    icon: <Code2 className="w-6 h-6" />,
    label: "Full Stack App",
    desc: "CRUD interface with data management",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
  {
    id: "3d",
    icon: <Box className="w-6 h-6" />,
    label: "3D Scene",
    desc: "WebGL 3D scene with Three.js and animations",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
  },
  {
    id: "animation",
    icon: <Film className="w-6 h-6" />,
    label: "Animation / Video",
    desc: "Canvas animations, motion graphics, video-like sequences",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  {
    id: "mobile",
    icon: <Smartphone className="w-6 h-6" />,
    label: "Mobile UI",
    desc: "Touch-friendly mobile-first interface",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  {
    id: "dashboard",
    icon: <LayoutDashboard className="w-6 h-6" />,
    label: "Dashboard",
    desc: "Analytics with charts and KPI cards",
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
  },
  {
    id: "game",
    icon: <Gamepad2 className="w-6 h-6" />,
    label: "Game",
    desc: "Interactive browser-based game with sound",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
  },
  {
    id: "sound",
    icon: <Waves className="w-6 h-6" />,
    label: "Sound / Music",
    desc: "Audio apps, synthesizers, music tools",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  {
    id: "api",
    icon: <Server className="w-6 h-6" />,
    label: "API Docs",
    desc: "API documentation and testing interface",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
];

export default function NewSessionPage() {
  const navigate = useNavigate();
  const createSession = useCreateSession();
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState("video");
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
          <div className="space-y-3">
            <span className="text-sm font-medium text-foreground/80">
              Project Type
            </span>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              data-ocid="newsession.types.list"
            >
              {projectTypes.map((type, idx) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  data-ocid={`newsession.types.item.${idx + 1}`}
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
