"use client"

import {
  type ColumnDef,
  flexRender,
  type SortingState,
  getSortedRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
    onSortingChange: (updater) => {
      setSorting((old) => {
        const newSorting = typeof updater === 'function' ? updater(old) : updater;
      
        const isSameSorting = (newSorting.length > 0 && old.length > 0 &&
          newSorting[0]?.id === old[0]?.id &&
          newSorting[0]?.desc === old[0]?.desc);
      
        if (isSameSorting) {
          // If clicking the same column a third time, clear the sorting
          return [];
        }
      
        return newSorting;
      });
    },
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show the first page
      pageNumbers.push(1)

      // Use dots to indicate more pages before the current page
      if (currentPage > 3) {
        pageNumbers.push('...')
      }

      // Show up to 3 pages before and after the current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(i)
      }

      // Use dots to indicate more pages after the current page
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...')
      }

      // Always show the last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-md border overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="w-[calc(100%/6)]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => console.log(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="w-[calc(100%/6)]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <button
          className="p-2 transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          data-testid="previous-page"
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((pageNumber, index) => (
            pageNumber === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
            ) : (
              <button
                key={pageNumber}
                className={`px-3 py-2 text-sm ${
                  pageNumber === currentPage
                    ? "font-bold underline"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => table.setPageIndex(Number(pageNumber) - 1)}
                data-testid={`page-${pageNumber == totalPages ? 'last' : pageNumber}`}
              >
                {pageNumber}
              </button>
            )
          ))}
        </div>
        <button
          className="p-2 transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          data-testid="next-page"
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}