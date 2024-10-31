"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
interface CadaidWidgetProps {
    setHasInputCadaidWidget: React.Dispatch<React.SetStateAction<boolean>>;
    hasInputCadaidWidget: boolean;
    reportUrl: string; 
}
interface response {
    message: string;
    type: string;
}

export function CadaidWidget({setHasInputCadaidWidget, hasInputCadaidWidget, reportUrl }: CadaidWidgetProps) {
    const router = useRouter();

    const handleNavigation = () => {
        router.push(reportUrl);
    };
    
    const hardcodedRespons = [{message: "Du har fasade", type: "CONFIRMED"}, 
            {message: "Du mangler snit", type: "MISSING"}, 
            {message: "Du mangler situasjons kart", type: "MISSING" }]
    
    const handleClick = () => {
        handleNavigation();
        if (!hasInputCadaidWidget) {
            setHasInputCadaidWidget(true);
        }
    }

    return(
        <section data-cy="cadaid-widget"
            className="border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer col-span-2"
            onClick={handleClick}>
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-xlwebapp/src/app/for-soknad/byggeideer/dashbord/page.tsx">Få oversikt over plantegninger</h1>
                    <Image src={hasInputCadaidWidget? "/Ikoner/Dark/SVG/Check, Success.svg" : "/Ikoner/Dark/SVG/Warning.svg"}
                        alt={hasInputCadaidWidget? "hake" : "varselsymbol"}
                        className="bg-kartAI-blue rounded-sm p-1"
                        width={30}
                        height={30}/> 

                </div>
                {hasInputCadaidWidget? 
                <ul>
                    {hardcodedRespons.map((response  , index) => (
                        <li className={`${response.type === "MISSING" ? "text-red-600" : "text-black"}`}
                        key={index}>{response.message}</li>
                    ))}
                </ul>   
                : 
                <p>Last opp plantegning for å få oversikt over inholdet</p>}

        </section>
    )
}