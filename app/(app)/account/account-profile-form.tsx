"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  displayName: string;
  bio: string;
}

export default function AccountProfileForm({ displayName, bio }: Props) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [bioVal, setBio] = useState(bio);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name.trim(), bio: bioVal.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Something went wrong. Try again.");
      } else {
        setSaved(true);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          value={name}
          onChange={(e) => { setName(e.target.value); setSaved(false); }}
          maxLength={80}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio (optional)</Label>
        <Textarea
          id="bio"
          value={bioVal}
          onChange={(e) => { setBio(e.target.value); setSaved(false); }}
          rows={3}
          maxLength={400}
          placeholder="A few words about you -- optional"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-green-700">Saved.</p>}
      <Button type="submit" disabled={saving} className="w-fit">
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
