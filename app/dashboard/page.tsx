"use client";

import React, { useState } from "react";
import {
  DashSidebar,
  DashHeader,
  StatsRow,
  RoyaltiesChart,
  FocusList,
  NextPayoutCard,
  FoundingBatch,
} from "@/components/dashboard/Sections";

export default function DashboardPage() {
  const [active, setActive] = useState("home");
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <DashSidebar active={active} onNav={setActive} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <DashHeader />
        <div style={{ padding: "32px 40px 80px" }}>
          <StatsRow />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 20,
            }}
          >
            <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
              <RoyaltiesChart />
              <FocusList />
            </div>
            <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
              <NextPayoutCard />
              <FoundingBatch />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
