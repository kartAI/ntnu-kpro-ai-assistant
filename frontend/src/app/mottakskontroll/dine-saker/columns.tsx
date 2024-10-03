"use client";

import { type Row, type ColumnDef } from "@tanstack/react-table";
import { type Application } from "~/types/application";
import ColumnHeader from "./ColumnHeader";

// Add or remove columns here
const columnConfigMap = new Map<
  string, // Accessor key
  {
    hasSort: boolean; // Whether the column should be sortable
    headerName: string;
    cellFunction?: (row: Row<Application>) => string; // Optional function for formatting the cell data
  }
>([
  ["id", { hasSort: false, headerName: "Saksnummer" }],
  ["address", { hasSort: true, headerName: "Adresse" }],
  ["name", { hasSort: true, headerName: "Navn" }],
  [
    "date",
    {
      hasSort: true,
      headerName: "Innsendingsdato",
      cellFunction: (row) => {
        const date = row.original.date;
        return date.toLocaleDateString();
      },
    },
  ],
]);

export const columns: ColumnDef<Application>[] = Array.from(
  columnConfigMap,
).map(([accessorKey, { hasSort, headerName: header, cellFunction }]) => ({
  accessorKey,
  header: ({ column }) => ColumnHeader(column, header, hasSort),
  ...(cellFunction && { cell: ({ row }) => cellFunction(row) }), // Conditionally include the cell function if it exists
}));
