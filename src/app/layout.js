"use client";

import "../styles/globals.css";
import { useState, useEffect } from "react";
import { AppProvider } from "../lib/AppContext";
import CustomCursor from "../components/ui/CustomCursor";
import AudioPlayer from "../components/ui/AudioPlayer";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <title>Happy 18th Birthday, Eka Meilani</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Cinzel:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>
          <CustomCursor />
          <AudioPlayer />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
