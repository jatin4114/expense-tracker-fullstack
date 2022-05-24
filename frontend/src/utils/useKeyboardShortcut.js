import { useEffect } from "react";

// listens for a single key press anywhere on the page and calls the
// callback - ignores it while the user is typing in an input/textarea
// so it doesnt fire while someone's just typing "n" into a title field
export function useKeyboardShortcut(key, callback, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e) {
      const tag = e.target.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (isTyping) return;

      if (e.key === key) {
        callback(e);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, enabled]);
}
