"use client";
import React, { useState } from "react";
import { PickAddress } from "../../../../components/PickAddress";
import { TodoList } from "../../../../components/TodoList";
import { CadaidWidget } from "../../../../components/CadaidWidget";
import { DigitalTiltaksdataWidget } from "../../../../components/DigitalTilraksdataWidget";
import { ThreeDVisningWidget } from "../../../../components/ThreeDVisningWidgit";


export default function Dashboard() {
    const [hasInputPickAddress, setHasInputPickAddress] = useState<boolean>(false)
    const [hasInputCadaidWidget, setHasInputCadaidWidget] = useState<boolean>(false)
    const [hasInputDigitalTiltaksdataWidget, setHasInputDigitalTiltaksdataWidget] = useState<boolean>(false)
    const [hasInputThreeDVisningWidget, sethasInputThreeDVisningWidget] = useState<boolean>(false)
    return(
        <div>
            <h1 id="heading"></h1>
            <PickAddress setHasInputPickAddress={setHasInputPickAddress}/>
            <section>
                <TodoList hasInputPickAddress={hasInputPickAddress}
                    hasInputCadaidWidget={hasInputCadaidWidget}
                    hasInputDigitalTiltaksdataWidget={hasInputDigitalTiltaksdataWidget}
                    hasInputThreeDVisningWidget={hasInputThreeDVisningWidget}
                    />
                <CadaidWidget/>
                <DigitalTiltaksdataWidget/>
                <div id="planprat"/>
                <ThreeDVisningWidget/>
                <div id="document-overview"/>
                <div id="arkiv-gpt"/>
                <button id="start-aplication-button">
                    <h2>gå til søknad</h2>
                </button>

            </section>
        </div>
    )
}