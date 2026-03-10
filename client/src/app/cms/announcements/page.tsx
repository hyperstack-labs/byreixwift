import React from "react";
import { AnnouncementsManager } from "@/components/cms";

export default function AnnouncementsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <AnnouncementsManager />
    </div>
  );
}

/*
The AnnouncementContext helps to create the connection
between AnnouncementBanner.tsx and AnnouncementManager.tsx until a backend is integrated,
localstorage was used for temporary data persistence until database is integrated,
the root layout was wrapped with announcement provider so the banner will render site wide with realtime quick update.
*/
