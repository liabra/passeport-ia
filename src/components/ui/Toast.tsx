"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ToastMessage {
  id: number;
  texte: string;
}

interface ToastContextValue {
  afficher: (texte: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const compteur = useRef(0);

  const afficher = useCallback((texte: string) => {
    const id = ++compteur.current;
    setMessages((prev) => [...prev, { id, texte }]);
    window.setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ afficher }}>
      {children}
      {/* Région live : les messages sont annoncés aux lecteurs d'écran. */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {messages.map((m) => (
          <p
            key={m.id}
            role="status"
            className="pointer-events-auto max-w-md rounded-carte border-2 border-encre bg-carte px-5 py-3 text-center text-base font-semibold text-encre shadow-dure"
          >
            {m.texte}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans <ToastProvider>");
  return ctx;
}
