"use client";

import { useParams } from "next/navigation";
import { getCase, CaseData } from "../../../../../types/cases";
import Checklist from "../../../../_components/Checklist";
import Summary from "../../../../_components/Summary";
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

  
  /** Dummy data for AI summary */
  const aiSummary = [
    "Ola Nordmann søker om tillatelse til å utvide sin eksisterende terrasse med 20 kvadratmeter. Den nye terrassen vil gå fra 15 kvm til totalt 35 kvm.",
    "Terrassen skal bygges i impregnert treverk med rekkverk av glass og aluminium.",
    "Terrassen vil ha en høyde på 1,2 meter fra bakken.",
    "Den skal plasseres på eiendommens sørside, som vender mot en privat hage.",
    "Det planlegges også integrering av en trapp for bedre tilgang til hagen."
  ];

  return (
    <div>
      <h1 data-cy="title"><strong>Oversikt over søknadsanalyse</strong></h1>
  

      {caseNumber ? (
        <div>
        <div className="grid grid-cols-2 gap-2">
          <p><strong>Saksnummer:</strong> {ApplicationData?.caseNumber}</p>
          <p><strong>Adresse:</strong> {ApplicationData?.address}</p>
          <p><strong>Eiendom:</strong> GNR: {ApplicationData?.farmUnit}, BNR: {ApplicationData?.propertyUnit}</p>
          <p><strong>Innsendingsdato:</strong> {formatDate(ApplicationData?.receiveDate)}</p>
          <p><strong>Frist:</strong> {ApplicationData?.deadline}</p>
        </div>

        <div data-cy="sjekkliste">
          <Checklist /> 
        </div>
        <div data-cy="summary">
          <Summary summaryData={aiSummary}/>
        </div>
        </div>

      ) : (
        <p>No case number provided</p>
      )}
    </div>
  );
}
