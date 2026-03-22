import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveCallerUserProfile } from "../hooks/useQueries";
import IconBuilderModal from "./IconBuilderModal";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setError("");
    try {
      await saveProfile({ name: trimmed });
    } catch (err: unknown) {
      setError(
        (err as Error)?.message || "Failed to save profile. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md space-y-6 border border-border/50 shadow-2xl">
        <div className="text-center space-y-2">
          <Logo size="small" />
          <h2 className="text-2xl font-bold text-foreground mt-4">Welcome!</h2>
          <p className="text-muted-foreground text-sm">
            Set up your profile to get started.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <UserAvatar size="large" fallbackInitials={name || "?"} />
          <IconBuilderModal
            trigger={
              <button
                type="button"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                ✏️ Edit Icon
              </button>
            }
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="pl-10"
                maxLength={50}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isPending || !name.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </form>

        {identity && (
          <p className="text-xs text-muted-foreground text-center truncate">
            Principal: {identity.getPrincipal().toString().slice(0, 20)}…
          </p>
        )}
      </div>
    </div>
  );
}
