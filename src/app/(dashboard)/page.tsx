"use client"

import { FileCheck, FileText, FileX2, Eye } from "lucide-react"
import { StatCard } from "~/components/StatCard"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"

const stats = [
  {
    title: "Approved Files",
    value: "0",
    description: "Files approved",
    icon: <FileCheck className="h-5 w-5 text-green-600" />,
  },
  {
    title: "Submitted Files",
    value: "1",
    description: "Total files submitted",
    icon: <FileText className="h-5 w-5 text-blue-600" />,
  },
  {
    title: "Rejected Files",
    value: "1",
    description: "Files rejected",
    icon: <FileX2 className="h-5 w-5 text-red-600" />,
  },
]

const files = [
  {
    name: "N/A",
    description: "N/A",
    type: "N/A",
    category: "N/A",
    date: "N/A",
  },
]

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Data Table */}
      <div className="rounded-xl p-4 mt-8 border shadow-md">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm font-semibold">Name</TableHead>
              <TableHead className="text-sm font-semibold">Description</TableHead>
              <TableHead className="text-sm font-semibold">Type</TableHead>
              <TableHead className="text-sm font-semibold">Category</TableHead>
              <TableHead className="text-sm font-semibold text-right">Date</TableHead>
              <TableHead className="text-sm font-semibold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.name}>
                <TableCell className="text-sm">{file.name}</TableCell>
                <TableCell className="text-sm">{file.description}</TableCell>
                <TableCell className="text-sm">{file.type}</TableCell>
                <TableCell className="text-sm">{file.category}</TableCell>
                <TableCell className="text-sm text-right">{file.date}</TableCell>
                <TableCell className="text-sm text-center">
                  <Button variant="ghost" className="">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* Pagination inside the table */}
          <TableFooter className="bg-white">
            <TableRow>
              <TableCell colSpan={6} className="text-right">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
