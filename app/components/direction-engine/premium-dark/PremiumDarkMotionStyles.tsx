export function PremiumDarkMotionStyles() {
  return (
    <style>{`
      @keyframes pd-orb-drift {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(3%, -2%); }
      }
      @keyframes pd-orb-drift-reverse {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-4%, 3%); }
      }
      @keyframes pd-orb-pulse {
        0%, 100% { opacity: 0.12; transform: scale(1); }
        50% { opacity: 0.22; transform: scale(1.06); }
      }
      @keyframes pd-scroll-cue {
        0%, 100% { transform: scaleY(1); opacity: 0.5; }
        50% { transform: scaleY(1.15); opacity: 1; }
      }
      .pd-orb-drift { animation: pd-orb-drift 16s ease-in-out infinite; }
      .pd-orb-drift-reverse { animation: pd-orb-drift-reverse 20s ease-in-out infinite; }
      .pd-orb-pulse { animation: pd-orb-pulse 8s ease-in-out infinite; }
      .pd-scroll-cue { animation: pd-scroll-cue 2.4s ease-in-out infinite; transform-origin: top; }
      .pd-section + .pd-section::before {
        content: "";
        position: absolute;
        top: 0;
        left: 10%;
        right: 10%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        pointer-events: none;
      }
      .pd-world { background: #0a0a0c; }
    `}</style>
  );
}
