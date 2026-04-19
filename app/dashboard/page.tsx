"use client";

import React, { useState } from "react";
import { DashSidebar } from "@/components/dashboard/Sections";
import {
  OverviewView,
  RoyaltiesView,
  BooksView,
  EtsyView,
  FoundingBatchView,
  CalendarView,
} from "@/components/dashboard/Views";

const VIEWS: Record<string, React.ComponentType> = {
  home: OverviewView,
  royalties: RoyaltiesView,
  books: BooksView,
  etsy: EtsyView,
  cohort: FoundingBatchView,
  calendar: CalendarView,
};

export default function DashboardPage() {
  const [active, setActive] = useState<string>("home");
  const ActiveView = VIEWS[active] ?? OverviewView;
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <DashSidebar active={active} onNav={setActive} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <ActiveView />
      </main>
    </div>
  );
}
