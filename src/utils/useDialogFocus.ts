import { useEffect, useRef, type RefObject } from 'react';

export function useDialogFocus(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void, focusFirstInput = true) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, textarea, a[href], [tabindex="0"]')).filter(node => node.offsetParent !== null);
    ((focusFirstInput && dialog.querySelector<HTMLInputElement>('input')) || focusable()[0] || dialog).focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    dialog.addEventListener('keydown', onKey);
    return () => { dialog.removeEventListener('keydown', onKey); if (previous?.isConnected) previous.focus(); };
  }, [open, ref]);
}
