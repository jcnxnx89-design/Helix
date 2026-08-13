import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/remote/")({
  head: () => ({
    meta: [
      { title: "Phone Remote — Helix" },
      { name: "description", content: "Turn your phone into a remote control for the Helix TV screen." },
      { property: "og:title", content: "Phone Remote — Helix" },
      { property: "og:description", content: "Turn your phone into a remote for your Helix screen." },
    ],
  }),
  component: RemoteEntry,
});

function RemoteEntry() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/15 text-primary">
          <Smartphone className="size-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Pair your remote</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the code shown on your TV screen, or scan its QR code.
          </p>
        </div>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABCD1234"
          aria-label="Pairing code"
          className="h-14 rounded-2xl text-center font-display text-xl tracking-[0.3em]"
        />
        <Button
          className="h-12 w-full text-base"
          disabled={code.trim().length < 4}
          onClick={() => void navigate({ to: "/remote/$code", params: { code: code.trim() } })}
        >
          Connect
        </Button>
      </div>
    </div>
  );
}
