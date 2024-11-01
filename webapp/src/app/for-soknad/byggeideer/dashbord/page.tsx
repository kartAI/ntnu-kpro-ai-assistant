"use client";
import { BooleanValuesProvider } from "~/components/BooleanValuesProvider";
import ForSoknadDashboradPage from "~/components/ForSoknadDashboardPage"
  

export default function Dashboard() {


    

    

    return(
    <BooleanValuesProvider>
        <ForSoknadDashboradPage />
      </BooleanValuesProvider>
    );

}