"use client";

import { useParams } from "next/navigation";
import { getCase, CaseData } from "../../../../../types/cases";
import Checklist from "~/components/Checklist";
import Summary from "~/components/Summary";
import EmbeddedFrame from "~/components/EmbeddedFrame";
import CaseDocumentsComponent from "~/components/CaseDocuments";
import Feedback from "~/components/Feedback";
import ResultAI from "~/components/ResultAI";
import React from "react";
import { Detection } from "~/types/detection";

const fetchDetections = ():  Detection[] => {
  
  const detections: Detection[] = [
    {
      file_name: 'Plantegning.pdf',
      drawing_type: ['plantegning'],
      room_names: 'Mangler rombenevnelse',
    }
  ];
  
  return detections;
}



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

  /* Dummy data for case documents component */

  const BASE_URL = "http://localhost:3000/mottakskontroll/mine-saker/dashbord/1";
  const documents = [
    { name: 'Plantegning.pdf', url: BASE_URL + '/' + 'Plantegning.pdf' },
    { name: 'Snitt_øst.jpg', url: BASE_URL + '/' + 'Snitt_øst.jpg' },
    { name: 'Snitt_vest.jpg', url: BASE_URL + '/' + 'Snitt_vest.jpg' },
    { name: 'Snitt_nord.jpg', url: BASE_URL + '/' + 'Snitt_nord.jpg' },
    { name: 'Bevis_på_nabovarseler.pdf', url: BASE_URL + '/' + 'Bevis_på_nabovarseler.pdf' },
    { name: 'Søknadsdokument.pdf', url: BASE_URL + '/' + 'Søknadsdokument.pdf' },
  ];


  const agents = [
      {
          title: 'CAD-Aid',
          status: 'failure',
          feedback: 'KRITISKE MANGLER',
          reportUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
          title: 'ArkivGPT',
          status: 'success',
          feedback: 'Arkivdata funnet',
          reportUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
          title: 'DOK-analyse',
          status: 'success',
          feedback: 'Dokumenter validert',
          reportUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
          title: '3D-tiltaksvisning',
          status: 'success',
          feedback: 'Se visualisering',
          reportUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
          title: 'Tiltakskart',
          status: 'failure',
          feedback: 'TILTAK MÅ SJEKKES',
          reportUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
  ]

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
        <div>
          <h3 data-cy="title"><strong>Plansituasjon:</strong></h3>
          <EmbeddedFrame data-cy="plansituasjon"  
            src="https://www.arealplaner.no/vennesla4223/arealplaner/53?knr=4223&gnr=5&bnr=547&teigid=214401611" 
            title="plansituasjon" 
            width = '60%'
            height = '500vh'/>
        </div>

        <div>
          <CaseDocumentsComponent documents={documents} />
        </div>

        <div>
          <Feedback />
        </div>
{/* 
        <div>
          <ResultAI title={"ArkivGPT"} status={'success'} feedback={"Arkivdata funnet"} reportUrl={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} />
        </div>
 */}
        </div>


      ) : (
        <p>No case number provided</p>
      )}
    </div>
  );
}
