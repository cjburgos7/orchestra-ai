"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  projectName: string;
};

export default function LaunchModal({ open, onClose, projectName }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
          <span className="text-white font-bold">O</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Launch {projectName}</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          Deployment orchestration is coming soon. Orchestra will wire hosting, domains, payments,
          and zero-downtime rollouts — all from one calm workflow.
        </p>
        <ul className="space-y-2 mb-6 text-sm text-slate-600">
          {["Custom domain setup", "Production deploy", "Stripe billing", "Analytics"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {item}
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled
          className="w-full bg-slate-100 text-slate-400 py-3 rounded-xl font-semibold text-sm mb-2 cursor-not-allowed"
        >
          Deploy to production (soon)
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full text-slate-600 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50"
        >
          Keep refining
        </button>
      </div>
    </div>
  );
}
