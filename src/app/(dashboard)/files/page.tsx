"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { FilePlus, CloudUpload, Eye, PlusIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function FilePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const onDrop = (accepted: File[]) => setFile(accepted[0]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  // Fetch applications
  const fetchApplications = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/applications/user/view", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setApplications(data.applications);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle upload + create application
  const handleSubmit = async () => {
    if (!fileName || !fileDescription || !file || !documentType) {
      return alert("All fields are required");
    }
    const formData = new FormData();
    formData.append("name", fileName);
    formData.append("description", fileDescription);
    formData.append("documentType", documentType);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/applications", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setDialogOpen(false);
      setFile(null);
      setFileName("");
      setFileDescription("");
      setDocumentType("");
      fetchApplications();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    }
  };

  // pagination
  const paginated = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  return (
    <div className="w-full my-16 px-4">
      {applications.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center p-16 rounded-lg border border-dashed border-gray-300 hover:bg-gray-50"
          onClick={() => setDialogOpen(true)}
        >
          <FilePlus className="h-12 w-12 text-gray-500" />
          <p className="mt-2 text-lg text-gray-700">
            No applications yet. Click to upload a document.
          </p>
          <Button onClick={() => setDialogOpen(true)} className="mt-4 flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Application
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border shadow-md overflow-x-auto">
          <div className="flex justify-end p-4">
            <Button onClick={() => setDialogOpen(true)}>
              <CloudUpload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>

          <Table className="min-w-full m-4">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
                <TableHead className="text-center">View</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((app: any) => (
                <TableRow key={app.id}>
                  <TableCell>{app.document.name}</TableCell>
                  <TableCell>{app.document.description}</TableCell>
                  <TableCell>{app.document.documentType}</TableCell>
                  <TableCell>{app.status}</TableCell>
                  <TableCell className="text-right">
                    {new Date(app.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={app.document.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter className="bg-white">
              <TableRow>
                <TableCell colSpan={6} className="text-right">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        {/* @ts-ignore */}
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          /* @ts-ignore */
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          {/* @ts-ignore */}
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        {/* @ts-ignore */}
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((p) =>
                              Math.min(totalPages, p + 1)
                            )
                          }
                          /* @ts-ignore */
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Enter file name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <Textarea
              placeholder="Enter document description"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
            />
            <Select
              value={documentType}
              onValueChange={(val) => setDocumentType(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPORT_LICENSE">
                  Export License
                </SelectItem>
                <SelectItem value="IMPORT_LICENSE">
                  Import License
                </SelectItem>
                <SelectItem value="COMPANY_CERTIFICATE">
                  Company Certificate
                </SelectItem>
                <SelectItem value="TAX_CLEARANCE">Tax Clearance</SelectItem>
              </SelectContent>
            </Select>

            <div
              {...(getRootProps() as any)}
              className="w-full p-6 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input {...(getInputProps() as any)} />
              <p className="text-center text-gray-600">
                Drag & drop a file here, or click to select one
              </p>
            </div>

            {file && (
              <p className="mt-2 text-sm text-gray-700">
                Selected File: {file.name}
              </p>
            )}
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
