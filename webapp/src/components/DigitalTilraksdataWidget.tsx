"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

interface DigitalTiltaksdataWidgetProps {
    hasInputDigitalTiltaksdataWidget: boolean;
    setHasInputDigitalTiltaksdataWidget: (value: boolean) => void;
}

export function DigitalTiltaksdataWidget({hasInputDigitalTiltaksdataWidget, setHasInputDigitalTiltaksdataWidget}:DigitalTiltaksdataWidgetProps) {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    useEffect(() => {
        if (hasInputDigitalTiltaksdataWidget) {
            localStorage.setItem("hasInputDigitalTiltaksdataWidget", JSON.stringify(hasInputDigitalTiltaksdataWidget));
        }
    })

    useEffect(() => {
        const storedHasInputDigitalTiltaksdataWidget = localStorage.getItem("hasInputDigitalTiltaksdataWidget")

        if (storedHasInputDigitalTiltaksdataWidget) {
            try {
                const parsedHasInputDigitalTiltaksdataWidget: boolean = JSON.parse(storedHasInputDigitalTiltaksdataWidget) as boolean;
                setHasInputDigitalTiltaksdataWidget(parsedHasInputDigitalTiltaksdataWidget);
            } catch {
                console.error("respons could not be parsed");
                
            }
        }
    })
    const applyInput= () => {
        setHasInputDigitalTiltaksdataWidget(true);
        setIsOverlayOpen(false);
    };
    



    const toggleOverlay = () => setIsOverlayOpen(!isOverlayOpen);
    return(
        <section data-cy="digital-tiltaksdata-widget"
            className="Border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer lg:col-span-2"
            onClick={toggleOverlay}>
            
            {hasInputDigitalTiltaksdataWidget? 
            <div> 
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-xl">Analyser bygg området</h1>
                <Image src={hasInputDigitalTiltaksdataWidget? "/Ikoner/Dark/SVG/Check, Success.svg" : "/Ikoner/Dark/SVG/Warning.svg"}
                    alt={hasInputDigitalTiltaksdataWidget? "hake" : "varselsymbol"}
                    className="bg-kartAI-blue rounded-sm p-1"
                    width={30}
                    height={30}/> 

            </div>
            <ul data-cy="map-feedback"
                className="text-red-600">
                <li>Høy konsentrasjon av radon</li>
                <li>Nær fuldyrket jord</li>
                <li>Nær maringrense</li>
                <li>Skadefare</li>
            </ul>
        </div>
            :
            <div> 
                <div className="flex justify-between items-center">
                    <h1 className="font-bold">Analyser bygg området</h1>
                    <Image src={hasInputDigitalTiltaksdataWidget? "/Ikoner/Dark/SVG/Check, Success.svg" : "/Ikoner/Dark/SVG/Warning.svg"}
                        alt={hasInputDigitalTiltaksdataWidget? "hake" : "varselsymbol"}
                        className="bg-kartAI-blue rounded-sm p-1"
                        width={30}
                        height={30}/> 

                </div>
                <p>Tegn opp området du tenker å bygge på for å se om det er noen hindringer for å bygge der</p>
            </div>
            }

            
            {isOverlayOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h1><strong>Trykk på kartet for å merkere hvor du vil bygge</strong></h1>
                        <Image data-cy="mock-map"
                            src="/actionMap.png" 
                            alt="kart" 
                            height={500} 
                            width={500} 
                            onClick={applyInput}/>
                        <div className="flex justify-end gap-4">
                            <Button data-cy="cancel-3d-widget"
                                onClick={toggleOverlay}
                                className="bg-kartAI-blue hover:bg-red-600 mt-2"
                            >
                                Lukk
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}