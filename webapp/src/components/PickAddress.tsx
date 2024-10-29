"use client";
import React, { useState } from "react";

interface pickAddressProps {
    setHasInputPickAddress:webapp/src/components/DigitalTilraksdataWidget.tsx,

}
export function PickAddress({setHasInputPickAddress}: pickAddressProps) {
    const [address, setAddress] = useState<string>("Ingen adresse valgt")
    const [property, setProperty] = useState<string>("Ingen eiendom valgt")
    const [showOverlay, setShowOverlay] = useState(false);
    const [inputAddress, setInputAddress] = useState('');
    const [inputGnr, setInputGnr] = useState('');
    const [inputBnr, setInputBnr] = useState('');

    function setAdressAndProperty() {
        if (inputAddress && inputBnr && inputGnr) {
            setAddress(inputAddress)
            setProperty(`Gnr. ${inputGnr}, Bnr. ${inputBnr}`)
            setHasInputPickAddress(true)
            handleToggleOverlay()
        } 
        
    }

    const handleToggleOverlay = () => {
      setShowOverlay(!showOverlay);
    };

    return(
        <section id="pick-address"
            className="flex">
            <section>
                <h1>Adresse:</h1>
                <h1>{address}</h1>
            </section>
            <section>
                <h1>Eiendom:</h1>
                <h1>{property}</h1>
            </section>
            <button onClick={handleToggleOverlay}>
                Velg adresse og eiendom
            </button>
            {showOverlay && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                    <h2 className="text-xl font-semibold mb-4">Velg adresse og tomt</h2>
                    
                    {/* Input fields */}
                    <input 
                        type="text" 
                        placeholder="First Input" 
                        className="border p-2 w-full mb-4" 
                        onChange={(e) => setInputAddress(e.target.value)}
                    
                    />
                    <input 
                        type="text" 
                        placeholder="Second Input" 
                        className="border p-2 w-full mb-4" 
                        onChange={(e) => setInputGnr(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Third Input" 
                        className="border p-2 w-full mb-4" 
                        onChange={(e) => setInputBnr(e.target.value)}
                    />

                    {/* Close button */}
                    <button 
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"

                    onClick={handleToggleOverlay}
                    >
                        Lukk
                    </button>
                    <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={setAdressAndProperty}>
                        Aksepter
                    </button>
                </div>
            </div>
        )}

        </section>
    )
}