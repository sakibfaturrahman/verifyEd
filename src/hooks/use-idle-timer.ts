"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseIdleTimerOptions {
  timeoutInMinutes?: number;
  onTimeout: () => void;
}

export function useIdleTimer({
  timeoutInMinutes = 30,
  onTimeout,
}: UseIdleTimerOptions) {
  const timeoutMs = timeoutInMinutes * 60 * 1000;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActiveRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    lastActiveRef.current = Date.now();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutMs);
  }, [timeoutMs, onTimeout]);

  useEffect(() => {
    // Daftar event interaksi pengguna
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    // Throttle listener agar tidak membebani performa saat mouse bergerak terus-menerus
    let throttleTimeout: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          resetTimer();
          throttleTimeout = null;
        }, 1000); // Evaluasi paling cepat tiap 1 detik
      }
    };

    // Pasang listener di window
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Jalankan timer pertama kali
    resetTimer();

    // Deteksi jika user kembali ke tab setelah browser ditinggal / laptop sleep
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const idleDuration = Date.now() - lastActiveRef.current;
        if (idleDuration >= timeoutMs) {
          onTimeout();
        } else {
          resetTimer();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (throttleTimeout) clearTimeout(throttleTimeout);

      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetTimer, timeoutMs, onTimeout]);
}
