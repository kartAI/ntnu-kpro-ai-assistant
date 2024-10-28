import { ChevronDownIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "~/components/ui/dropdown-menu";

interface FilterProps {
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  allUniqueItems: Set<string>;
  buttonText: string;
}

const FilterDropdown = ({
  selectedItems,
  setSelectedItems,
  allUniqueItems,
  buttonText,
}: FilterProps) => {
  return (
    <div data-testid="filter">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            data-testid="filter-button"
            variant="outline"
            className="w-[200px] justify-between"
          >
            {selectedItems.length || "Ingen"} {buttonText} valgt
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent data-testid="filter-content" className="w-[200px]">
          <DropdownMenuItem
            key="alle"
            onClick={() => setSelectedItems(Array.from(allUniqueItems))}
          >
            Velg alle
          </DropdownMenuItem>
          <DropdownMenuItem key="ingen" onClick={() => setSelectedItems([])}>
            Fjern alle
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {Array.from(allUniqueItems).map((item) => (
            <DropdownMenuCheckboxItem
              key={item}
              checked={selectedItems.includes(item)}
              onCheckedChange={(checked) => {
                setSelectedItems(
                  checked
                    ? [...selectedItems, item]
                    : selectedItems.filter((m) => m !== item),
                );
              }}
            >
              {item}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterDropdown;
