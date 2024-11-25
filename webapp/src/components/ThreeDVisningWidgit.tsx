"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import EmbeddedFrame from "./EmbeddedFrame";

interface ThreeDVisningWidgetProps {
    setHasInputThreeDVisningWidget: (value: boolean) => void;
    hasInputThreeDVisningWidget: boolean;
}
const mockUrl = "https://byggesak3d.norkart.no/view/bf204afe-e50e-4ac6-8839-ebd9406167ac"

export function ThreeDVisningWidget({setHasInputThreeDVisningWidget, hasInputThreeDVisningWidget}: ThreeDVisningWidgetProps) {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [url, setUrl] = useState<string>('')


    useEffect(() => {
        // Only store in localStorage if values are valid (non-empty)
        if (url) {
            localStorage.setItem("url", url);
        }
        if(hasInputThreeDVisningWidget){
            localStorage.setItem("hasInputThreeDVisningWidget", JSON.stringify(hasInputThreeDVisningWidget));

        }
    }, [url, hasInputThreeDVisningWidget]);

    useEffect(() => {
        // Load from localStorage on initial render
        const storedUrl = localStorage.getItem("url");
      
        const storedHasInputThreeDVisningWidget = localStorage.getItem("hasInputThreeDVisningWidget");

        if (storedUrl && storedHasInputThreeDVisningWidget) {
            setUrl(storedUrl)
            const parsedHasInputThreeDVisningWidget = JSON.parse(storedHasInputThreeDVisningWidget) as boolean;
            setHasInputThreeDVisningWidget(parsedHasInputThreeDVisningWidget);
        }
    }, [setHasInputThreeDVisningWidget]);

    const applyInput = () => {
        setHasInputThreeDVisningWidget(true);
        setIsOverlayOpen(false);
    };

    const toggleOverlay = () => setIsOverlayOpen(!isOverlayOpen);
    return(
        <section data-cy="3d-visning-widget"
            className={`border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer ${hasInputThreeDVisningWidget? "flex-1" :  "flex-none"}`}
            onClick={toggleOverlay}>
            
            {hasInputThreeDVisningWidget? 
            <EmbeddedFrame data-cy="tiltaksvisning"  
                src={url} 
                title="3D tiltaksvisning"
                height={"100"}
                 /> 
            :
            <div> 
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-xl">Last opp 3D visning</h1>
                    <Image src={hasInputThreeDVisningWidget? "/Ikoner/Dark/SVG/Check, Success.svg" : "/Ikoner/Dark/SVG/Warning.svg"}
                        alt={hasInputThreeDVisningWidget? "hake" : "varselsymbol"}
                        className="bg-kartAI-blue rounded-sm p-1"
                        width={30}
                        height={30}/> 

                </div>
                
                <p>Legg til lenke av din 3D visning</p>
            </div>
            }

            
            {isOverlayOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h1><strong>Legg til din 3D visnings lenke</strong></h1>
                        <p className="text-lg mb-4">Lenke: /for-soknad/3d-situasjon</p>
                        <div className="flex justify-end gap-4">
                            <Button
                                onClick={() => {
                                    toggleOverlay()}}
                                className="bg-kartAI-blue hover:bg-red-600"
                            >
                                Lukk
                            </Button>
                            <Button data-cy="apply-3d-url-button"
                                onClick={() => {
                                    setUrl(mockUrl)
                                    applyInput()}}
                                className="bg-kartAI-blue"
                            >
                                Legg til lenke
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}