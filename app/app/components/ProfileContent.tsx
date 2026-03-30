"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  Mail,
  MapPin,
  ExternalLink,
  Pencil,
  X,
  Check,
  LogOut,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  skills: string | null;
}

export default function ProfileContent() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    website: "",
    skills: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          name: data.name || "",
          title: data.title || "",
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          skills: data.skills || "",
        });
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setUser(updated);
    setEditing(false);
    setSaving(false);
  }

  function startEditing() {
    setForm({
      name: user?.name || "",
      title: user?.title || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      skills: user?.skills || "",
    });
    setEditing(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="type-body text-text-tertiary">Loading profile...</div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const skillsList = user.skills
    ? user.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 mt-10">
      {/* Header */}
      <div className="flex flex-col items-center sm:flex-row sm:items-end gap-6">
        {/* Avatar */}
        <div className="relative h-32 w-32 shrink-0 rounded-full border-4 border-background bg-surface-2 overflow-hidden shadow-(--shadow-mid)">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=e8432a`}
            alt="Profile picture"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Name & Title */}
        <div className="flex-1 text-center sm:text-left pb-2">
          {editing ? (
            <div className="space-y-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 type-headline text-text-primary focus:border-accent focus:outline-none"
                placeholder="Your name"
              />
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 type-body text-text-secondary focus:border-accent focus:outline-none"
                placeholder="Your title (e.g. Full-Stack Developer)"
              />
            </div>
          ) : (
            <>
              <h1 className="type-headline text-text-primary">{user.name}</h1>
              {user.title && (
                <p className="type-body text-text-secondary">{user.title}</p>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pb-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
              >
                <Check size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-3"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startEditing}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-3 hover:text-text-primary"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-3 hover:text-error"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {/* About */}
        <section className="rounded-xl border border-border bg-surface-1 p-6">
          <h2 className="type-title text-text-primary mb-4">About</h2>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 type-body text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none resize-none"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="type-body text-text-secondary">
              {user.bio || "No bio yet. Click Edit Profile to add one."}
            </p>
          )}
        </section>

        {/* Details */}
        <section className="rounded-xl border border-border bg-surface-1 p-6">
          <h2 className="type-title text-text-primary mb-4">Details</h2>
          {editing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-accent shrink-0" />
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 type-body text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                  placeholder="Your location"
                />
              </div>
              <div className="flex items-center gap-3">
                <ExternalLink size={18} className="text-accent shrink-0" />
                <input
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 type-body text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                  placeholder="Your website or portfolio URL"
                />
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              <li className="flex items-center gap-3 type-body text-text-secondary">
                <Mail size={18} className="text-accent shrink-0" />
                {user.email}
              </li>
              {user.location && (
                <li className="flex items-center gap-3 type-body text-text-secondary">
                  <MapPin size={18} className="text-accent shrink-0" />
                  {user.location}
                </li>
              )}
              {user.website && (
                <li className="flex items-center gap-3 type-body text-text-secondary">
                  <ExternalLink size={18} className="text-accent shrink-0" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-text-primary transition-colors"
                  >
                    {user.website}
                  </a>
                </li>
              )}
            </ul>
          )}
        </section>
      </div>

      {/* Skills */}
      <section className="mt-8 rounded-xl border border-border bg-surface-1 p-6">
        <h2 className="type-title text-text-primary mb-4">Skills</h2>
        {editing ? (
          <input
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 type-body text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
            placeholder="Comma-separated skills (e.g. React, TypeScript, Python)"
          />
        ) : skillsList.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-primary-tint px-4 py-1.5 text-sm font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="type-body text-text-tertiary">
            No skills added yet. Click Edit Profile to add some.
          </p>
        )}
      </section>
    </div>
  );
}
