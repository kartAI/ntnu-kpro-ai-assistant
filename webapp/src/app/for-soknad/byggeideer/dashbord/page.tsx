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

export default function Dashboard() {
    const BASE_URL = "/for-soknad/byggeideer/dashbord"
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

    

    
    const documents = [
        { name: 'Plantegning.pdf', url: BASE_URL + '/' + 'Plantegning.pdf' },
        { name: 'Snitt_øst.jpg', url: BASE_URL + '/' + 'Snitt_øst.jpg' },
        { name: 'Snitt_vest.jpg', url: BASE_URL + '/' + 'Snitt_vest.jpg' },
        { name: 'Snitt_nord.jpg', url: BASE_URL + '/' + 'Snitt_nord.jpg' },
        { name: 'Bevis_på_nabovarseler.pdf', url: BASE_URL + '/' + 'Bevis_på_nabovarseler.pdf' },
        { name: 'Søknadsdokument.pdf', url: BASE_URL + '/' + 'Søknadsdokument.pdf' },
      ];

    return(
        <div className="ml-14 mr-14">
            <h1 data-cy="title"
                className="text-3xl"><strong>Byggeidee Dashbord</strong></h1>
            <PickAddress setHasInputPickAddress={setHasInputPickAddress}/>
            <section className="mt-4 grid  md:grid-cols-6 grid-rows-1 md:grid-rows-3 gap-10 ">
                <TodoList hasInputPickAddress={hasInputPickAddress}
                    hasInputCadaidWidget={hasInputCadaidWidget}
                    hasInputDigitalTiltaksdataWidget={hasInputDigitalTiltaksdataWidget}
                    hasInputThreeDVisningWidget={hasInputThreeDVisningWidget}
                    />
                <div className=" col-span-2 row-span-2">
                    <CaseDocumentsComponent data-cy="document-overview" 
                        documents={documents}/>

                </div>
                <div data-cy="planprat"
                    className="Border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer row-span-2 col-span-2">
                    <h1>planprat</h1>
                </div>
                <CadaidWidget setHasInputCadaidWidget={setHasInputCadaidWidget} 
                    hasInputCadaidWidget={hasInputCadaidWidget}
                    reportUrl={BASE_URL + "/cadaid"}/>
                <DigitalTiltaksdataWidget hasInputDigitalTiltaksdataWidget={hasInputDigitalTiltaksdataWidget}
                    setHasInputDigitalTiltaksdataWidget={setHasInputDigitalTiltaksdataWidget}/>
                
                <div className=" col-span-2">
                    <ResultAI data-cy="arkiv-gpt" 
                        title={"ArkivGPT"} 
                        status={hasInputPickAddress? 'success' : 'failure'} 
                        feedback={hasInputPickAddress? "Arkivdata funnet" : "Ingen tomt valgt"} 
                        reportUrl={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} />

                </div>
            
            </section>
            <div className="md:flex justify-between">
                <ThreeDVisningWidget setHasInputThreeDVisningWidget={setHasInputThreeDVisningWidget} 
                    hasInputThreeDVisningWidget={hasInputThreeDVisningWidget}/>
                <Button data-cy="start-aplication-button" 
                    className="bg-kartAI-blue">
                    
                    Gå til søknad
                </Button>
            </div>
        </div>
    )
}