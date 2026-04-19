"use client";

import React, { useState } from "react";
import {
  DashSidebar,
  DayHeader,
  TaskList,
  StatsRow,
  MentorCard,
  CohortFeed,
} from "@/components/dashboard/Sections";

export default function DashboardPage() {
  const [active, setActive] = useState("home");
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <DashSidebar active={active} onNav={setActive} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <DayHeader day={23} total={50} />
        <div style={{ padding: "32px 40px 80px" }}>
          <StatsRow />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 20,
            }}
          >
            <TaskList />
            <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
              <MentorCard />
              <CohortFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
