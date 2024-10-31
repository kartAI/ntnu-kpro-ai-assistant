"use client";
import React, { useEffect, useState } from "react";
import { PickAddress } from "~/components/PickAddress";
import { TodoList } from "~/components/TodoList";
import { CadaidWidget } from "~/components/CadaidWidget";
import { DigitalTiltaksdataWidget } from "~/components/DigitalTilraksdataWidget";
import { ThreeDVisningWidget } from "~/components/ThreeDVisningWidgit";
import { Button } from "~/components/ui/button";
import CaseDocumentsComponent from "~/components/CaseDocuments";
import ResultAI from "~/components/ResultAI";

const BASE_URL = "/for-soknad/byggeideer/dashbord"
const documents = [
    { name: 'Plantegning.pdf', url: BASE_URL + '/' + 'Plantegning.pdf' },
    { name: 'Snitt_øst.jpg', url: BASE_URL + '/' + 'Snitt_øst.jpg' },
    { name: 'Snitt_vest.jpg', url: BASE_URL + '/' + 'Snitt_vest.jpg' },
    { name: 'Snitt_nord.jpg', url: BASE_URL + '/' + 'Snitt_nord.jpg' },
  ];

export default function Dashboard() {
    
    const [hasInputPickAddress, setHasInputPickAddress] = useState<boolean>(() => {
        const savedHasInputPickAddress = sessionStorage.getItem('hasInputPickAddress');
        return savedHasInputPickAddress ? JSON.parse(savedHasInputPickAddress) as boolean : false; 
    });
    const [hasInputCadaidWidget, setHasInputCadaidWidget] = useState<boolean>(() => {
        const saveHasInputCadaidWidget = sessionStorage.getItem('hasInputCadaidWidget');
        return saveHasInputCadaidWidget ? JSON.parse(saveHasInputCadaidWidget) as boolean : false;
    });   
    const [hasInputDigitalTiltaksdataWidget, setHasInputDigitalTiltaksdataWidget] = useState<boolean>(() => {
        const saveHasInputDigitalTiltaksdataWidget = sessionStorage.getItem('hasInputDigitalTiltaksdataWidget');
        return saveHasInputDigitalTiltaksdataWidget ? JSON.parse(saveHasInputDigitalTiltaksdataWidget) as boolean : false;
    });   
    const [hasInputThreeDVisningWidget, setHasInputThreeDVisningWidget] = useState<boolean>(() => {
        const saveHasInputThreeDVisningWidget = sessionStorage.getItem('hasInputThreeDVisningWidget');
        return saveHasInputThreeDVisningWidget ? JSON.parse(saveHasInputThreeDVisningWidget) as boolean : false;
    });   
    const [documentList, setDocumentList] = useState<typeof documents>([]);


    useEffect(() => {
        sessionStorage.setItem('hasInputPickAddress', JSON.stringify(hasInputPickAddress));
    }, [hasInputPickAddress]);

    useEffect(() => {
        sessionStorage.setItem('hasInputCadaidWidget', JSON.stringify(hasInputCadaidWidget));
    }, [hasInputCadaidWidget]);

    useEffect(() => {
        sessionStorage.setItem('hasInputDigitalTiltaksdataWidget', JSON.stringify(hasInputDigitalTiltaksdataWidget));
    }, [hasInputDigitalTiltaksdataWidget]);

    useEffect(() => {
        sessionStorage.setItem('hasInputThreeDVisningWidget', JSON.stringify(hasInputThreeDVisningWidget));
    }, [hasInputThreeDVisningWidget]);

    useEffect(() => {
        if (hasInputCadaidWidget) {
          setDocumentList(prevList => [...prevList, ...documents]);
        }
      }, [hasInputCadaidWidget]);
    

    

    

    return(
        <div className="ml-14 mr-14 mb-10" >
            <h1 data-cy="title"
                className="text-3xl"><strong>Byggeidee Dashbord</strong></h1>
            <PickAddress setHasInputPickAddress={setHasInputPickAddress}/>
            <section className="mt-4 grid  md:grid-cols-6 grid-rows-1 md:grid-rows-2 gap-10 ">
                <TodoList hasInputPickAddress={hasInputPickAddress}
                    hasInputCadaidWidget={hasInputCadaidWidget}
                    hasInputDigitalTiltaksdataWidget={hasInputDigitalTiltaksdataWidget}
                    hasInputThreeDVisningWidget={hasInputThreeDVisningWidget}
                    />
                <CadaidWidget setHasInputCadaidWidget={setHasInputCadaidWidget} 
                    hasInputCadaidWidget={hasInputCadaidWidget}
                    reportUrl={BASE_URL + "/cadaid"}/>
                <div data-cy="planprat"
                    className="Border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer row-span-3 col-span-2">
                    <h1>planprat</h1>
                </div>
                <DigitalTiltaksdataWidget hasInputDigitalTiltaksdataWidget={hasInputDigitalTiltaksdataWidget}
                    setHasInputDigitalTiltaksdataWidget={setHasInputDigitalTiltaksdataWidget}/>
                <div className="col-span-2">
                    <ResultAI data-cy="arkiv-gpt" 
                            title={"ArkivGPT"} 
                            status={hasInputPickAddress? 'success' : 'failure'} 
                            feedback={hasInputPickAddress? "Arkivdata funnet" : "Ingen tomt valgt"} 
                            reportUrl={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} />

                </div>
                <div className="col-span-6 row-span-3 flex gap-10">
                    <ThreeDVisningWidget setHasInputThreeDVisningWidget={setHasInputThreeDVisningWidget} 
                    hasInputThreeDVisningWidget={hasInputThreeDVisningWidget}/>
                    <CaseDocumentsComponent data-cy="document-overview" 
                        documents={hasInputCadaidWidget? documents : []}/>
                    <Button data-cy="start-aplication-button" 
                        className="bg-kartAI-blue">
                        Gå til søknad
                    </Button>
                </div>
            </section>
        </div>
    )
}