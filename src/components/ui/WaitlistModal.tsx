"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { copy } from "@/data/copy";
import { Button } from "./Button";
import { Modal } from "./Modal";

const WaitlistContext = createContext<() => void>(() => {});

/** Opens the "Doors open soon" modal from any CTA. */
export function useWaitlist() {
  return useContext(WaitlistContext);
}

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  return (
    <WaitlistContext.Provider value={show}>
      {children}
      <WaitlistModal open={open} onClose={() => setOpen(false)} />
    </WaitlistContext.Provider>
  );
}

const t = copy.waitlist;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Stubbed waitlist: validates and shows success, sends nothing anywhere (v1 scope).
 * Swap `submit` for a real request when there's a backend.
 */
export function WaitlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!email) return setError(t.errorEmpty);
    if (!EMAIL.test(email)) return setError(t.errorInvalid);
    setError(null);
    setState("sending");
    await new Promise((r) => setTimeout(r, 650));
    setState("done");
  };

  const close = () => {
    onClose();
    // Reset after the close so the next visitor sees the form again.
    setTimeout(() => {
      setState("idle");
      setError(null);
    }, 300);
  };

  return (
    <Modal open={open} onClose={close} title={state === "done" ? t.successTitle : t.title}>
      {state === "done" ? (
        <p className="text-lead text-paper-dim" role="status">
          {t.successBody}
        </p>
      ) : (
        <form onSubmit={submit} noValidate>
          <p className="text-paper-dim">{t.body}</p>
          <label htmlFor={inputId} className="mono-label mt-6 block text-paper-dim">
            {t.emailLabel}
          </label>
          <input
            id={inputId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder={t.placeholder}
            className="mt-2 h-12 w-full rounded-[10px] border border-line-strong bg-ink px-4 font-mono text-paper placeholder:text-paper-dim/70 focus-visible:border-paper focus-visible:outline-none aria-[invalid=true]:border-onair"
          />
          {error && (
            <p id={errorId} role="alert" className="mt-2 font-mono text-[0.8125rem] text-onair">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={state === "sending"}>
            {state === "sending" ? t.sending : t.submit}
          </Button>
        </form>
      )}
    </Modal>
  );
}
