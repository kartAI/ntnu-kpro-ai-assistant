"use client";

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
    const arkivGPTText = "- Du kan bruke arkiv gpt til å se på hva som har skjed på tomta før"
    const cadaidText = "- Om du allerede har plantegninger så kan du skjekke hva de inneholder."
    const digitalTilraksdataText = "- Om du vet hvor du vil bygge kan du tegne dette området og se om det er noen hinder for å bygge der."    
    const threeDVisningText = "- Om du har en 3D tegning av hva du ønsker å bygge kan du legge in denne og se den."
    const planpratText = "- Om du ikke er helt sikker på hva du vil bygge men trenger å vite noe om byggelover så slå av en prat med PlanChat"
    

    return(
        <section data-cy="todo-list"
            className="border border-gray-300 rounded-lg p-6 shadow-sm bg-blue-50 mx-auto row-span-3 lg:col-span-2 space-y-4">
            <h1 className="font-bold text-xl">Gjøremål</h1>
            {hasInputPickAddress? <p data-cy="arkivgpt-text">{arkivGPTText}</p> : <p data-cy="address-text">{addressText}</p>}
            {hasInputCadaidWidget? null : <p data-cy="cadaid-text">{cadaidText}</p>}
            {hasInputDigitalTiltaksdataWidget? null : <p data-cy="digital-tilraksdata-text">{digitalTilraksdataText}</p>}
            {hasInputThreeDVisningWidget? null : <p data-cy="three-d-visning-text">{threeDVisningText}</p>}
            <p data-cy="planprat-text" >{planpratText}</p>
        </section>
    )
}