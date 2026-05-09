"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [riddleSolved, setRiddleSolved] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [giftOpened, setGiftOpened] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  return (
    <AppContext.Provider
      value={{
        riddleSolved,
        setRiddleSolved,
        currentPage,
        setCurrentPage,
        giftOpened,
        setGiftOpened,
        launched,
        setLaunched,
        letterOpened,
        setLetterOpened,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
