"use client";

import { useParams } from "next/navigation";
import React from "react";

const CaseDashboard: React.FC = () => {
  const { caseNumber } = useParams();

  return (
    <div>
      <h1>Dashbord for saksnummer: {caseNumber}</h1>
    </div>
  );
};

export default CaseDashboard;
