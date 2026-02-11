import { RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside, {
      capture: true,
    });
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
  }, [ref, onOutsideClick]);
}
