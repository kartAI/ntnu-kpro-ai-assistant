"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
interface ArkivGPTWidgetProps {
    hasInputPickAddress: boolean;
}

export function ArkivGPTWidget({hasInputPickAddress}: ArkivGPTWidgetProps) {
    const router = useRouter();

    const handleNavigation = () => {
        router.push('/for-soknad/byggeideer/dashbord/arkivgpt');
    };


    return(
        <section data-cy="arkiv-gpt" 
        className="border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer lg:col-span-2"
        onClick={handleNavigation}>
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-xlwebapp/src/app/for-soknad/byggeideer/dashbord/page.tsx">Tomtens arkiv historikk</h1>
                <Image src={hasInputPickAddress? "/Ikoner/Dark/SVG/Check, Success.svg" : "/Ikoner/Dark/SVG/Warning.svg"}
                    alt={hasInputPickAddress? "hake" : "varselsymbol"}
                    className="bg-kartAI-blue rounded-sm p-1"
                    width={30}
                    height={30}/> 

            </div>
            {hasInputPickAddress? 
            <div>
                <p>Les tidligere saker relatert til tomten</p>
            </div> 
            : 
            <p>Ingen arkiv funnet</p>}

    </section>

    )
}