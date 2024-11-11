"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface pickAddressProps {
    setHasInputPickAddress: (value: boolean) => void;
    hasInputPickAddress: boolean;

}

export function PickAddress({setHasInputPickAddress, hasInputPickAddress}: pickAddressProps) {
    const [address, setAddress] = useState<string>();
    const [property, setProperty] = useState<string>();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [inputAddress, setInputAddress] = useState<string>('');
    const [inputGnr, setInputGnr] = useState<string>();
    const [inputBnr, setInputBnr] = useState<string>();
    const [inputAttempted, setInputAttempted] = useState<boolean>(false);

    useEffect(() => {
        // Only store in localStorage if values are valid (non-empty)
        if (address && inputBnr && inputGnr && hasInputPickAddress) {
            localStorage.setItem("address", address);
            localStorage.setItem("bnr", inputBnr);
            localStorage.setItem("gnr", inputGnr);
            localStorage.setItem("hasInputPickAddress", JSON.stringify(hasInputPickAddress));
        }
    }, [address, inputBnr, inputGnr, hasInputPickAddress]);
    
    useEffect(() => {
        // Load from localStorage on initial render
        const storedAddress = localStorage.getItem("address");
        const storedBnr = localStorage.getItem("bnr");
        const storedGnr = localStorage.getItem("gnr");
        const storedHasInputPickAddress = localStorage.getItem("hasInputPickAddress");

        if (storedAddress && storedBnr && storedGnr && storedHasInputPickAddress) {
            setAddress(storedAddress);
            setInputBnr(storedBnr);
            setInputGnr(storedGnr);
            setProperty(`Gnr. ${storedGnr}, Bnr. ${storedBnr}`);
            const parsedHasInputPickAddress = JSON.parse(storedHasInputPickAddress) as boolean;
            setHasInputPickAddress(parsedHasInputPickAddress);
        }
    }, [setHasInputPickAddress]);


    
    function setAdressAndProperty() {
        console.log(inputAddress + inputBnr + inputGnr)
        if (inputAddress && inputBnr && inputGnr) {
            setAddress(inputAddress)
            setHasInputPickAddress(true)
            setProperty(`Gnr. ${inputGnr}, Bnr. ${inputBnr}`);
            handleToggleOverlay()
        } 
        setInputAttempted(true)
        
    }

    const handleToggleOverlay = () => {
      setShowOverlay(!showOverlay); 
    };

    return(
        <section data-cy="pick-address"
            className="flex gap-6">
            <section>
                <h1>Adresse:</h1>
                <h1 className={address? "text-black" : "text-red-600"}>{address? address : "Ingen addresse valgt"}</h1>
            </section>
            <section>
                <h1>Eiendom:</h1>
                <h1 className={property? "text-black" : "text-red-600"}>{property? property : "Ingen tomt valgt"}</h1>
            </section>
            <Button onClick={handleToggleOverlay}
                className="px-4 py-2 bg-kartAI-blue">
                Velg adresse og eiendom
            </Button>
            {showOverlay && (
            <div data-cy="pick-address-overlay"  
                className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                    <h2 className="text-xl font-semibold mb-4">Velg adresse og tomt</h2>
                    
                    {/* Input fields */}
                    <input data-cy="input-address"
                        type="text" 
                        placeholder="Adresse" 
                        className="border p-2 w-full" 
                        onChange={(e) => setInputAddress(e.target.value)}
                    
                    />
                    {!inputAddress && inputAttempted ?  
                    <p className="text-red-600 text-right">DU MÅ FYLLE UT ADRESSE</p>
                    :
                    null}
                    <input data-cy="input-bnr" 
                        type="text" 
                        placeholder="Bruksnummer (Bnr.)" 
                        className="border p-2 w-full mt-4" 
                        onChange={(e) => setInputBnr(e.target.value)}
                    />
                    {!inputBnr && inputAttempted ?  
                    <p className="text-red-600 text-right">DU MÅ FYLLE UT BRUKSNUMMER (Bnr.)</p>
                    :
                    null}
                    <input data-cy="input-gnr" 
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
                        <Button data-cy="overlay-cancel-button"
                            className=" bg-kartAI-blue hover:bg-red-600"
                            onClick={handleToggleOverlay}>
                            Lukk
                        </Button>
                        <Button data-cy="overlay-confirm-button"
                            className=" bg-kartAI-blue"
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