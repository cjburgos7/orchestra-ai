"use client";

import { createContext, useCallback, useContext, useState } from "react";

type OrchestraFlowContextValue = {
  signInOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  scrollToGenerate: (options?: { focus?: boolean }) => void;
};

const OrchestraFlowContext = createContext<OrchestraFlowContextValue | null>(null);

export function OrchestraFlowProvider({ children }: { children: React.ReactNode }) {
  const [signInOpen, setSignInOpen] = useState(false);

  const scrollToGenerate = useCallback((options?: { focus?: boolean }) => {
    document.getElementById("generate")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (options?.focus) {
      window.setTimeout(() => {
        const input = document.getElementById("startup-idea");
        input?.focus();
        input?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, []);

  const value: OrchestraFlowContextValue = {
    signInOpen,
    openSignIn: () => setSignInOpen(true),
    closeSignIn: () => setSignInOpen(false),
    scrollToGenerate,
  };

  return (
    <OrchestraFlowContext.Provider value={value}>
      {children}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </OrchestraFlowContext.Provider>
  );
}

export function useOrchestraFlow() {
  const ctx = useContext(OrchestraFlowContext);
  if (!ctx) {
    throw new Error("useOrchestraFlow must be used within OrchestraFlowProvider");
  }
  return ctx;
}

function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="signin-title"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-white text-sm font-bold">O</span>
          </div>
          <div>
            <h2 id="signin-title" className="text-[18px] font-bold text-slate-900">
              Sign in to Orchestra
            </h2>
            <p className="text-[13px] text-slate-500">Coming soon — accounts are on the way</p>
          </div>
        </div>

        <p className="text-[14px] text-slate-600 leading-relaxed mb-6">
          Soon you&apos;ll be able to save startups, pick up where you left off, and sync projects
          across devices. For now, keep building — your previews work without an account.
        </p>

        <ul className="space-y-2.5 mb-7">
          {["Save generated startups", "Persist style directions", "Resume launch workflows"].map(
            (item) => (
              <li key={item} className="flex items-center gap-2.5 text-[13px] text-slate-600">
                <span className="w-5 h-5 rounded-md bg-green-50 border border-green-100 flex items-center justify-center text-green-600 text-[10px]">
                  ✓
                </span>
                {item}
              </li>
            )
          )}
        </ul>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled
            className="w-full bg-slate-100 text-slate-400 py-3 rounded-xl font-semibold text-[14px] cursor-not-allowed"
          >
            Sign in with email (soon)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-slate-600 py-3 rounded-xl font-semibold text-[14px] hover:bg-slate-50 transition-colors"
          >
            Continue without account
          </button>
        </div>
      </div>
    </div>
  );
}
