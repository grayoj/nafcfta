"use client";

import { useEffect, useState } from "react";
import { FileCheck, FileText, FileX2, Eye } from "lucide-react";
import { StatCard } from "~/components/StatCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

type File = {
  name: string;
  description: string;
  type: string;
  category: string;
  date: string;
  url?: string;
};

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFiles = async (currentPage = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/files?page=${currentPage}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setFiles(data.files || []);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error("Failed to load files");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(page);
  }, [page]);

  const stats = [
    {
      title: "Approved Files",
      value: files.filter((f) => f.category === "APPROVED").length.toString(),
      description: "Files approved",
      icon: <FileCheck className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Submitted Files",
      value: files.length.toString(),
      description: "Total files submitted",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Rejected Files",
      value: files.filter((f) => f.category === "DECLINED").length.toString(),
      description: "Files rejected",
      icon: <FileX2 className="h-5 w-5 text-red-600" />,
    },
  ];

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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No files submitted
                </TableCell>
              </TableRow>
            ) : (
              files.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.description}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.category}</TableCell>
                  <TableCell className="text-right">{file.date}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={file.url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter className="bg-white">
            <TableRow>
              <TableCell colSpan={6} className="text-right">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage((prev) => Math.max(prev - 1, 1));
                        }}
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={page === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {totalPages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage((prev) => Math.min(prev + 1, totalPages));
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
