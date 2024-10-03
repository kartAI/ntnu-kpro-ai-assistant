import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type Application } from "~/types/application";

const ColumnHeader = (
  column: Column<Application>,
  name: string,
  hasSort: boolean,
) => {
  // If the column is sortable, the header text should be wrapped with a clickable button with a sort icon
  // If not, the header text should be displayed as plain text
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
