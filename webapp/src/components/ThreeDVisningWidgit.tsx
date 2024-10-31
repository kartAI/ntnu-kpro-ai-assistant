"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import EmbeddedFrame from "./EmbeddedFrame";

interface ThreeDVisningWidgetProps {
    setHasInputThreeDVisningWidget: React.Dispatch<React.SetStateAction<boolean>>;
    hasInputThreeDVisningWidget: boolean;
}
export function ThreeDVisningWidget({setHasInputThreeDVisningWidget, hasInputThreeDVisningWidget}: ThreeDVisningWidgetProps) {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const applyInput = () => {
        setHasInputThreeDVisningWidget(true);
        setIsOverlayOpen(false);
    };

    const toggleOverlay = () => setIsOverlayOpen(!isOverlayOpen);
    return(
        <section data-cy="3d-visning-widget"
            className={`border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer col-span-2 ${hasInputThreeDVisningWidget? "flex-1" :  "flex-none"}`}
            onClick={toggleOverlay}>
            
            {hasInputThreeDVisningWidget? 
            <EmbeddedFrame data-cy="tiltaksvisning"  
                src="https://byggesak3d.norkart.no/view/bf204afe-e50e-4ac6-8839-ebd9406167ac" 
                title="3D tiltaksvisning"
                height={"50"}
                 /> 
            :
            <div> 
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-xl">Last opp 3d visning</h1>
                    <Image src={hasInputThreeDVisningWidget? "/Ikoner/Dark/SVG/Check, Success.svg" : "/Ikoner/Dark/SVG/Warning.svg"}
                        alt={hasInputThreeDVisningWidget? "hake" : "varselsymbol"}
                        className="bg-kartAI-blue rounded-sm p-1"
                        width={30}
                        height={30}/> 

                </div>
                <p>Om du har en lenke til en 3d visning av hva du tenker å bygge kan du legge det til her</p>
            </div>
            }

            
            {isOverlayOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h1><strong>Leg til din 3d visnings lenke</strong></h1>
                        <p className="text-lg mb-4">Lenke: http://localhost:3000/for-soknad/3d-situasjon</p>
                        <div className="flex justify-end gap-4">
                            <Button
                                onClick={toggleOverlay}
                                className="bg-kartAI-blue hover:bg-red-600"
                            >
                                Lukk
                            </Button>
                            <Button
                                onClick={applyInput}
                                className="bg-kartAI-blue"
                            >
                                Leg til lenke
                            </Button>

                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}