"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";

interface pickAddressProps {
    setHasInputPickAddress: (value: boolean) => void

}
export function PickAddress({setHasInputPickAddress}: pickAddressProps) {
    const [address, setAddress] = useState<string>("Ingen adresse valgt")
    const [property, setProperty] = useState<string>("Ingen eiendom valgt")
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [inputAddress, setInputAddress] = useState<string>('');
    const [inputGnr, setInputGnr] = useState('');
    const [inputBnr, setInputBnr] = useState('');
    const [inputAttempted, setInputAttempted] = useState<boolean>(false)


    function setAdressAndProperty() {
        if (inputAddress && inputBnr && inputGnr) {
            setAddress(inputAddress)
            setProperty(`Gnr. ${inputGnr}, Bnr. ${inputBnr}`)
            setHasInputPickAddress(true)
            handleToggleOverlay()
        } 
        console.log(inputAddress != '')
        setInputAttempted(true)
        
    }

    const handleToggleOverlay = () => {
      setShowOverlay(!showOverlay); 
    };

    return(
        <section id="pick-address"
            className="flex gap-6">
            <section>
                <h1>Adresse:</h1>
                <h1>{address}</h1>
            </section>
            <section>
                <h1>Eiendom:</h1>
                <h1>{property}</h1>
            </section>
            <Button onClick={handleToggleOverlay}
                className="px-4 py-2 bg-kartAI-blue">
                Velg adresse og eiendom
            </Button>
            {showOverlay && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                    <h2 className="text-xl font-semibold mb-4">Velg adresse og tomt</h2>
                    
                    {/* Input fields */}
                    <input 
                        type="text" 
                        placeholder="Adresse" 
                        className="border p-2 w-full" 
                        onChange={(e) => setInputAddress(e.target.value)}
                    
                    />
                    {!inputAddress && inputAttempted ?  
                    <p className="text-red-600 text-right">DU MÅ FYLLE UT ADRESSE</p>
                    :
                    null}
                    <input 
                        type="text" 
                        placeholder="Bruksnummer (Bnr.)" 
                        className="border p-2 w-full mt-4" 
                        onChange={(e) => setInputBnr(e.target.value)}
                    />
                    {!inputBnr && inputAttempted ?  
                    <p className="text-red-600 text-right">DU MÅ FYLLE UT BRUKSNUMMER (Bnr.)</p>
                    :
                    null}
                    <input 
                        type="text" 
                        placeholder="Gårdsnummer (Gnr.)" 
                        className="border p-2 w-full mt-4" 
                        onChange={(e) => setInputGnr(e.target.value)}
                    />
                    {!inputGnr && inputAttempted ?  
                    <p className="text-red-600 text-right">DU MÅ FYLLE UT GÅRDSNUMMER (Gnr.)</p>
                    :
                    null}

                    <div className="flex justify-end gap-4 mt-4">
                        <Button 
                            className=" bg-kartAI-blue hover:bg-red-600"
                            onClick={handleToggleOverlay}>
                            Lukk
                        </Button>
                        <Button className=" bg-kartAI-blue"
                            onClick={setAdressAndProperty}>
                            Aksepter
                        </Button> 
                    </div>
                   
                </div>
            </div>
        )}

        </section>
    )
}