"use client";

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DisagreementRow } from "@/lib/dashboard-data";

const columnHelper = createColumnHelper<DisagreementRow>();

const columns = [
  columnHelper.accessor("topic", {
    header: () => <span>Topic</span>,
    cell: (info) => (
      <div className="flex flex-col gap-1 max-w-40">
        <span className="text-sm font-medium">{info.getValue()}</span>
        {info.row.original.flaggedForReview ? (
          <Badge variant="outline" className="w-fit border-secondary text-secondary">
            Flagged for review
          </Badge>
        ) : null}
      </div>
    ),
  }),
  columnHelper.accessor("strongClaim", {
    header: () => <span>What the evidence supports strongly</span>,
    cell: (info) => (
      <span className="text-sm text-muted-foreground">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("softerClaim", {
    header: () => <span>What to hold more loosely</span>,
    cell: (info) => (
      <span className="text-sm text-muted-foreground">{info.getValue()}</span>
    ),
  }),
];

function downloadCsv(rows: DisagreementRow[]) {
  const headers = ["Topic", "Strong claim", "Softer claim", "Flagged for review"];
  const csvRows = rows.map((row) =>
    [row.topic, row.strongClaim, row.softerClaim, row.flaggedForReview ? "Yes" : "No"]
      .map((value) => `"${value.replace(/"/g, '""')}"`)
      .join(","),
  );
  const csvContent = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "where-experts-disagree.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function DisagreementTable({ rows }: { rows: DisagreementRow[] }) {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => downloadCsv(rows)}
          size="sm"
          className="inline-flex items-center gap-2 cursor-pointer hover:bg-primary/80"
        >
          <Download size={15} />
          Export CSV
        </Button>
      </div>
      <div className="border rounded-md border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-sm font-medium text-left border-b border-border px-4 py-3 h-auto"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
