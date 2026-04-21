import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function NavActions({ children }) {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    setTarget(document.getElementById('nav-actions'));
  }, []);

  if (!target) return null;
  return createPortal(children, target);
}
