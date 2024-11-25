"use client";
import UserDashboard from "~/components/UserDashboard";

export default function Dashboard() {
  const BASE_URL = "/under-soknad/byggeideer/dashbord";
    return(
      <UserDashboard BASE_URL={BASE_URL}/>
    );

}