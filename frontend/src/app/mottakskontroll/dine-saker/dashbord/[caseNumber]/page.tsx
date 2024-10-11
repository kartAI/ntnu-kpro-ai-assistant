"use client";

import { useParams } from "next/navigation";
import { getCase, CaseData } from "../../../../../types/cases";
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import React from "react";

export default function CaseDashboard() {
  const { caseNumber } = useParams();  // Get caseNumber from the dynamic route
  

  /** Convert from string to number for getCase function */
  const caseNumberAsNumber = Number(caseNumber);

  const ApplicationData : CaseData | undefined = getCase(100239);

  /** Handle date */
  const formatDate = (date: Date | undefined): string => {
    // If date is undefined, return a fallback value
    if (!date) {
        return "No date provided";
    }
    return date.toLocaleDateString('no-NO');  // Format date to 'DD.MM.YYYY'
};

  
  return (
    <div>
      <h1 data-cy="title"><strong>Oversikt over søknadsanalyse</strong></h1>
  

      {caseNumber ? (
        
        <div className="grid grid-cols-2 gap-2">
          <p><strong>Saksnummer:</strong> {ApplicationData?.caseNumber}</p>
          <p><strong>Adresse:</strong> {ApplicationData?.address}</p>
          <p><strong>Eiendom:</strong> GNR: {ApplicationData?.farmUnit}, BNR: {ApplicationData?.propertyUnit}</p>
          <p><strong>Innsendingsdato:</strong> {formatDate(ApplicationData?.receiveDate)}</p>
          <p><strong>Frist:</strong> {ApplicationData?.deadline}</p>
        </div>


        

      ) : (
        <p>No case number provided</p>
      )}
    </div>
  );
}
