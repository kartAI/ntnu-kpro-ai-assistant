import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { applications } from "~/types/application";

export default function Overview() {

  return (
    <main>
      {/* Navbar here */}
      <DataTable columns={columns} data={applications} />
    </main>
  );
}
