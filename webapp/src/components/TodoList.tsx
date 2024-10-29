"use client";
import React, { useEffect, useState } from "react";

interface todoListProps {
    hasInputPickAddress: boolean,
    hasInputCadaidWidget: boolean,
    hasInputDigitalTiltaksdataWidget: boolean,
    hasInputThreeDVisningWidget: boolean,

}
export function TodoList({hasInputPickAddress, 
        hasInputCadaidWidget, 
        hasInputDigitalTiltaksdataWidget, 
        hasInputThreeDVisningWidget}:todoListProps) {
    const addressText = "- Et godt sted å starte er å fylle ut hvilken tomt du tenker å bygge på."
    const cacaidText = "- Om du allerede har plantegninger så kan du skjekke hva de inneholder."
    const DigitalTilraksdataText = "- Om du vet hvor du vil bygge kan du merkere dette området og se om det er noen hinder for å bygge der."    
    const threeDVisningtext = "- Om du har en 3d tegning av hva du ønsker å bygge kan du legge in denne og se den."
    const planpradText = "- Om du ikke er helt sikker på hva du vil bygge men trenger å vite noe om byggelover så slå av en prat med PlanPrat"
    const [todoText, setTodoText] = useState<string>(addressText + "\n" 
        + cacaidText + "\n" + DigitalTilraksdataText + "\n" + threeDVisningtext 
        + "\n" + planpradText)
    
    useEffect(() => {
        setTodoText(`${hasInputPickAddress? addressText + "\n"  : ""} 
           + ${hasInputCadaidWidget? cacaidText + "\n" : ""}
           + ${hasInputDigitalTiltaksdataWidget? DigitalTilraksdataText + "\n" : "" }
           + ${hasInputThreeDVisningWidget? threeDVisningtext + "\n" : ""} 
           + ${planpradText}`)
    }, [hasInputPickAddress, hasInputCadaidWidget,hasInputDigitalTiltaksdataWidget, hasInputThreeDVisningWidget])
    return(
        <section id="todo-list">
            <h1>Gjøremål</h1>
            <p>{todoText}</p>
        </section>
    )
}