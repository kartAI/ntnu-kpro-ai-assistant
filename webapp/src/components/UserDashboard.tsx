"use client";
import React, { useEffect, useState } from "react";
import { PickAddress } from "~/components/PickAddress";
import { TodoList } from "~/components/TodoList";
import { CadaidWidget } from "~/components/CadaidWidget";
import { DigitalTiltaksdataWidget } from "~/components/DigitalTilraksdataWidget";
import { ThreeDVisningWidget } from "~/components/ThreeDVisningWidgit";
import { Button } from "~/components/ui/button";
import CaseDocumentsComponent from "~/components/CaseDocuments";
import { ArkivGPTWidget } from "~/components/ArkivGPTWidget";
import { useRouter } from 'next/navigation';

interface UserDashboardProps {
  BASE_URL: string;
}

export default function UserDashboard({BASE_URL}: UserDashboardProps) {
  const [hasInputPickAddress, setHasInputPickAddress] = useState<boolean>(false);
  const [hasInputCadaidWidget, setHasInputCadaidWidget] = useState<boolean>(false);
  const [hasInputDigitalTiltaksdataWidget, setHasInputDigitalTiltaksdataWidget] = useState<boolean>(false);
  const [hasInputThreeDVisningWidget, setHasInputThreeDVisningWidget] = useState<boolean>(false);

  const router = useRouter();

  const handleNavigation = () => {
      router.push('https://www.kristiansand.kommune.no/');
  };


  const [documentList, setDocumentList] = useState<typeof documents>([]);

  useEffect(() => {
    if (hasInputCadaidWidget) {
      setDocumentList(prevList => [...prevList, ...documents]);
    }
  }, [hasInputCadaidWidget]);

  const documents = [
    { name: 'Plantegning.pdf', url: BASE_URL + '/' + 'Plantegning.pdf' },
    { name: 'Snitt_øst.jpg', url: BASE_URL + '/' + 'Snitt_øst.jpg' },
    { name: 'Snitt_vest.jpg', url: BASE_URL + '/' + 'Snitt_vest.jpg' },
    { name: 'Snitt_nord.jpg', url: BASE_URL + '/' + 'Snitt_nord.jpg' },
  ];

    return(
      <div className="ml-14 mr-14 min-h-screen">
        <h1 data-cy="title" 
          className="text-3xl">
            <strong>Organiser min byggeidee</strong>
        </h1>
        <p className="mt-4 mb-4">På denne siden kan du legge inn det du vet om dine byggeplan og få respons fra våre KI hjelpere</p>
        <PickAddress setHasInputPickAddress={setHasInputPickAddress} hasInputPickAddress={hasInputPickAddress}/>
        <section className="mt-4 grid lg:grid-cols-6 grid-cols-1 lg:grid-rows-2 gap-10">
          <TodoList
            hasInputPickAddress={hasInputPickAddress}
            hasInputCadaidWidget={hasInputCadaidWidget}
            hasInputDigitalTiltaksdataWidget={hasInputDigitalTiltaksdataWidget}
            hasInputThreeDVisningWidget={hasInputThreeDVisningWidget}
          />
          <CadaidWidget
            setHasInputCadaidWidget={setHasInputCadaidWidget}
            hasInputCadaidWidget={hasInputCadaidWidget}
            reportUrl={BASE_URL + "/cadaid"}
          />
          <div data-cy="planprat" 
            className="Border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer row-span-3 lg:col-span-2">
            <h1>planprat</h1>
          </div>
          <DigitalTiltaksdataWidget
            hasInputDigitalTiltaksdataWidget={hasInputDigitalTiltaksdataWidget}
            setHasInputDigitalTiltaksdataWidget={setHasInputDigitalTiltaksdataWidget}
          />
          <ArkivGPTWidget hasInputPickAddress={hasInputPickAddress}/>
          <div className=" grid grid-cols-1 lg:flex gap-10 w-full lg:col-span-6">
            <ThreeDVisningWidget
              setHasInputThreeDVisningWidget={setHasInputThreeDVisningWidget}
              hasInputThreeDVisningWidget={hasInputThreeDVisningWidget}
            />
            <div>
                <CaseDocumentsComponent
                    data-cy="document-overview"
                    documents={documentList}
                    />

            </div>

            <Button data-cy="start-application-button" 
              className="bg-kartAI-blue"
              onClick={handleNavigation}>
              Gå til søknad
            </Button>
          </div>
        </section>
      </div>
    );

}