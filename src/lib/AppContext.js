"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [riddleSolved, setRiddleSolved] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [giftOpened, setGiftOpened] = useState(false);
  const [launched, setLaunched] = useState(false); // after intro
  const [letterOpened, setLetterOpened] = useState(false);

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
