import { Smartphone, X } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { useRemoteHost } from "@/components/remote/remote-host";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PairPhoneButton() {
  const [open, setOpen] = useState(false);
  const { status, startPairing } = useRemoteHost();

  return (
    <>
      <Button
        variant={status === "connected" ? "default" : "ghost"}
        size="sm"
        data-focusable
        className="gap-2 rounded-full"
        onClick={() => {
          setOpen(true);
          if (status === "idle" || status === "error") void startPairing();
        }}
      >
        <Smartphone className="size-4" />
        <span className="hidden sm:inline">
          {status === "connected" ? "Phone connected" : "Pair phone"}
        </span>
        {status === "connected" ? (
          <span className="size-2 rounded-full bg-primary" aria-hidden />
        ) : null}
      </Button>
      <PairDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export function PairDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { status, code, pairUrl, error, expiresAt, startPairing, disconnect } = useRemoteHost();
  const [qr, setQr] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!pairUrl) {
      setQr(null);
      return;
    }
    let cancelled = false;
    void QRCode.toDataURL(pairUrl, {
      width: 320,
      margin: 1,
      color: { dark: "#0b0d12", light: "#ffffff" },
    }).then((url) => {
      if (!cancelled) setQr(url);
    });
    return () => {
      cancelled = true;
    };
  }, [pairUrl]);

  useEffect(() => {
    if (!expiresAt || status === "connected") {
      setSecondsLeft(null);
      return;
    }
    const tick = () => setSecondsLeft(Math.max(0, Math.round((expiresAt - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, status]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-surface">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {status === "connected" ? "Phone connected" : "Connect your phone"}
          </DialogTitle>
          <DialogDescription>
            {status === "connected"
              ? "Your phone is now controlling this screen."
              : "Scan this QR code with your phone to turn it into a remote."}
          </DialogDescription>
        </DialogHeader>

        {status === "error" ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            {error ?? "Pairing failed."}
            <Button className="mt-3 w-full" onClick={() => void startPairing()}>
              Try again
            </Button>
          </div>
        ) : status === "connected" ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-primary/15 text-primary">
              <Smartphone className="size-9" />
            </div>
            <p className="text-sm text-muted-foreground">
              Use the D-pad on your phone to move around, and OK to select.
            </p>
            <Button variant="outline" className="w-full" onClick={() => void disconnect()}>
              <X className="size-4" /> Disconnect remote
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-fit rounded-3xl bg-white p-3">
              {qr ? (
                <img src={qr} alt="Pairing QR code" className="size-56" />
              ) : (
                <div className="size-56 animate-pulse rounded-xl bg-surface-2" />
              )}
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Or enter this code at /remote
              </p>
              <p className="font-display text-3xl font-bold tracking-[0.3em]">{code ?? "••••••••"}</p>
              {secondsLeft != null ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {secondsLeft > 0
                    ? `Expires in ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
                    : "This code expired."}
                </p>
              ) : null}
            </div>
            {secondsLeft === 0 ? (
              <Button className="w-full" onClick={() => void startPairing()}>
                Generate a new code
              </Button>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
