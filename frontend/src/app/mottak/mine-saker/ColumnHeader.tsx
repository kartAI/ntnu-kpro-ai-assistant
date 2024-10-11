'use client';

import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type Application } from "~/types/application";

/**
 * Creates a column header with a sort button if the column is sortable, or plain text if not
 *
 * @param column The column to create the header for
 * @param name The name of the column
 * @param hasSort Whether the column is sortable
 * @returns
 */
const ColumnHeader = (
  column: Column<Application>,
  name: string,
  hasSort: boolean,
) => {
  return hasSort ? (
    <Button variant="ghost" onClick={() => column.toggleSorting()}>
      {name}
      {/* Handles which icon is displayed for the sorting */}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  ) : (
    <p>{name}</p>
  );
};

export default ColumnHeader;
