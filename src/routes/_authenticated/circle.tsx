import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, Plus, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/circle")({
  head: () => ({
    meta: [
      { title: "Trusted circle — Safety Dosth" },
      {
        name: "description",
        content: "Manage the people who receive your live journey links and SOS alerts from Safety Dosth.",
      },
      { property: "og:title", content: "Trusted circle — Safety Dosth" },
      { property: "og:description", content: "The people who get your live journey link when it matters." },
    ],
  }),
  component: CirclePage,
});

interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  relationship: string | null;
}

function CirclePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", relationship: "" });
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("trusted_contacts")
      .select("id,name,phone,email,relationship")
      .order("created_at", { ascending: true });
    if (error) toast.error(error.message);
    setContacts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("Session expired");
      const { error } = await supabase.from("trusted_contacts").insert({
        user_id: userId,
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        relationship: form.relationship || null,
      });
      if (error) throw error;
      setForm({ name: "", phone: "", email: "", relationship: "" });
      setOpen(false);
      await load();
      toast.success("Contact added to your circle");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't add that contact");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from("trusted_contacts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      setContacts((c) => c.filter((x) => x.id !== id));
      toast.success("Contact removed");
    }
  }

  return (
    <AppShell title="Trusted circle" subtitle="They receive your live journey link and SOS alerts">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading your circle…</p>
      ) : contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No trusted contacts yet. Add someone you'd want to reach in a hurry.
        </p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((c) => (
            <li key={c.id} className="surface-card flex items-center gap-3 p-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <UserRound className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {[c.relationship, c.phone ?? c.email].filter(Boolean).join(" · ") || "No contact details"}
                </p>
              </div>
              {c.phone ? (
                <a
                  href={`tel:${c.phone}`}
                  className="flex size-9 items-center justify-center rounded-full bg-safe-soft text-safe"
                  aria-label={`Call ${c.name}`}
                >
                  <Phone className="size-4" />
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => remove(c.id)}
                className="flex size-9 items-center justify-center rounded-full bg-alert-soft text-alert"
                aria-label={`Remove ${c.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <form onSubmit={add} className="surface-card mt-4 space-y-3 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-phone">Phone</Label>
              <Input
                id="c-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-rel">Relationship</Label>
              <Input
                id="c-rel"
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-email">Email</Label>
            <Input
              id="c-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy} className="flex-1">
              {busy ? "Saving…" : "Save contact"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button className="mt-4 w-full" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Add trusted contact
        </Button>
      )}
    </AppShell>
  );
}
