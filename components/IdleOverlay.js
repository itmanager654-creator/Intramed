'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// After 30 seconds with no activity the whole screen turns black and the logo spins in 3D at the centre.
// Any touch, click, key press or scroll removes it. Not shown on the admin panel.
const IDLE_MS = 30000;

export default function IdleOverlay() {
  const path = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (path?.startsWith('/admin') || path?.startsWith('/accounts')) { setShow(false); return; }
    let t;
    const arm = () => { clearTimeout(t); setShow(false); t = setTimeout(() => setShow(true), IDLE_MS); };
    const evs = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    evs.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm();
    return () => { clearTimeout(t); evs.forEach((e) => window.removeEventListener(e, arm)); };
  }, [path]);

  if (!show) return null;
  return (
    <div className="idle-screen" role="dialog" aria-label="Screen saver" aria-modal="true">
      <div className="idle-logo">
        <img src="/logo-light.png" alt="" className="idle-logo-img" />
      </div>
    </div>
  );
}
