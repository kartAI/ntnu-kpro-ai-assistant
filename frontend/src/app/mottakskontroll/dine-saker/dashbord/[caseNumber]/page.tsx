"use client";

import { useParams } from "next/navigation";
import React from "react";

export default function CaseDashboard() {
  const { caseNumber } = useParams();

  return (
    <div>
      <h1>Dashbord for saksnummer: {caseNumber}</h1>
    </div>
  );
}
