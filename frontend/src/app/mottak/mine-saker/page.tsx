'use client';
import DataTable from "./DataTable";
import { columns } from "./columns";
import { applications } from "~/types/application";

export default function Overview() {
  return (
    <main className="h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-xl font-bold">Mine saker:</h1>
      <DataTable columns={columns} data={applications} pageSize={6} />
    </main>
  );
}
