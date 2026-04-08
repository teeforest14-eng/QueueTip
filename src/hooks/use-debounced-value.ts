import { useEffect, useState } from "react";

/** Debounces `value` for `delayMs` (default 300). */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = globalThis.setTimeout(() => setDebounced(value), delayMs);
    return () => globalThis.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
