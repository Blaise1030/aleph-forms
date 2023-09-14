import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {ArrowUpDown, ChevronDown, DownloadIcon, RefreshCw} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import {Button} from "@/components/ui/button";
import React from "react";

export type TFormFields = {
  runningNumber: number;
  language: string;
  email: string;
  date: string;
  phone: string;
  username: string;
  age: string;
};

export const columns: ColumnDef<TFormFields>[] = [
  {
    accessorKey: "username",
    header: ({column}) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => <div className="pl-4">{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: () => <div>Phone Number</div>,
    cell: ({row}) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "age",
    header: () => <div>Age</div>,
    cell: ({row}) => <div>{row.getValue("age")}</div>,
  },
  {
    accessorKey: "date",
    header: () => <div className="text-right">Date</div>,
    cell: ({row}) => {
      const formatted = dayjs(row.getValue("date")).format("DD/MM/YYYY");
      return (
        <div className="text-right text-muted-foreground">{formatted}</div>
      );
    },
  },
];
export default function DataTable({
  onFetchRecords,
  data,
}: {
  onFetchRecords: () => void;
  data: TFormFields[];
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full px-0.5">
      <div className="flex items-center py-4 md:flex-row flex-col md:space-y-0 space-y-2 justify-between">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          className="md:max-w-sm"
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
        />
        <div className="flex flex-row space-x-2 md:w-auto w-full">
          <Button size={"icon"} variant={"outline"} onClick={onFetchRecords}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border overflow-auto">
        <Table className="min-w-[1200px] max-h-50vh">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="p-4 py-12 text-center"
                  colSpan={columns.length}
                >
                  <div className="flex flex-col space-y-4">
                    <p>No results.</p>
                    {!Boolean(table.getColumn("email")?.getFilterValue()) && (
                      <div>
                        <Button
                          onClick={onFetchRecords}
                          variant={"outline"}
                          size={"sm"}
                        >
                          <DownloadIcon className="h-4 w-4 mr-2" />
                          Fetch All Records
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
