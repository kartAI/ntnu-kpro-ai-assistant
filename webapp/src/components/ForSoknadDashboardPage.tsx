import React, { useEffect, useState } from "react";
import { PickAddress } from "~/components/PickAddress";
import { TodoList } from "~/components/TodoList";
import { CadaidWidget } from "~/components/CadaidWidget";
import { DigitalTiltaksdataWidget } from "./DigitalTilraksdataWidget";
import { ThreeDVisningWidget } from "./ThreeDVisningWidgit";
import { Button } from "~/components/ui/button";
import CaseDocumentsComponent from "~/components/CaseDocuments";
import ResultAI from "~/components/ResultAI"
import { useBooleanValuesContext } from "./BooleanValuesProvider";

const BASE_URL = "/for-soknad/byggeideer/dashbord";
const documents = [
  { name: 'Plantegning.pdf', url: BASE_URL + '/' + 'Plantegning.pdf' },
  { name: 'Snitt_øst.jpg', url: BASE_URL + '/' + 'Snitt_øst.jpg' },
  { name: 'Snitt_vest.jpg', url: BASE_URL + '/' + 'Snitt_vest.jpg' },
  { name: 'Snitt_nord.jpg', url: BASE_URL + '/' + 'Snitt_nord.jpg' },
];

export default function Dashboard() {
  const {
    hasInputPickAddress,
    setHasInputPickAddress,
    hasInputCadaidWidget,
    setHasInputCadaidWidget,
    hasInputDigitalTiltaksdataWidget,
    setHasInputDigitalTiltaksdataWidget,
    hasInputThreeDVisningWidget,
    setHasInputThreeDVisningWidget,
  } = useBooleanValuesContext();

  const [documentList, setDocumentList] = useState<typeof documents>([]);

  useEffect(() => {
    if (hasInputCadaidWidget) {
      setDocumentList(prevList => [...prevList, ...documents]);
    }
  }, [hasInputCadaidWidget]);

  return (
    <div>
      <h1 data-cy="title" className="text-3xl"><strong>Byggeidee Dashbord</strong></h1>
      <PickAddress setHasInputPickAddress={setHasInputPickAddress} />
      <section className="mt-4 grid md:grid-cols-6 grid-rows-1 md:grid-rows-2 gap-10 ">
        <TodoList
          hasInputPickAddress={hasInputPickAddress}
          hasInputCadaidWidget={hasInputCadaidWidget}
          hasInputDigitalTiltaksdataWidget={hasInputDigitalTiltaksdataWidget}
          hasInputThreeDVisningWidget={hasInputThreeDVisningWidget}
        />
        <CadaidWidget
          setHasInputCadaidWidget={setHasInputCadaidWidget}
          hasInputCadaidWidget={hasInputCadaidWidget}
          reportUrl={BASE_URL + "/cadaid"}
        />
        <div data-cy="planprat" className="Border rounded-md p-4 shadow-md hover:shadow-lg transition-all cursor-pointer row-span-3 col-span-2">
          <h1>planprat</h1>
        </div>
        <DigitalTiltaksdataWidget
          hasInputDigitalTiltaksdataWidget={hasInputDigitalTiltaksdataWidget}
          setHasInputDigitalTiltaksdataWidget={setHasInputDigitalTiltaksdataWidget}
        />
        <div className="col-span-2">
          <ResultAI
            data-cy="arkiv-gpt"
            title={"ArkivGPT"}
            status={hasInputPickAddress ? 'success' : 'failure'}
            feedback={hasInputPickAddress ? "Arkivdata funnet" : "Ingen tomt valgt"}
            reportUrl={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
          />
        </div>
        <div className="col-span-6 row-span-3 flex gap-10">
          <ThreeDVisningWidget
            setHasInputThreeDVisningWidget={setHasInputThreeDVisningWidget}
            hasInputThreeDVisningWidget={hasInputThreeDVisningWidget}
          />
          <CaseDocumentsComponent
            data-cy="document-overview"
            documents={hasInputCadaidWidget ? documents : []}
          />
          <Button data-cy="start-application-button" className="bg-kartAI-blue">
            Gå til søknad
          </Button>
        </div>
      </section>
    </div>
  );
}
