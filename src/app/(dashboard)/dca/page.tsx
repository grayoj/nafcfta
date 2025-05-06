"use client";

import { useState, useEffect } from "react";
import { api } from "~/lib/axios";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "~/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "~/components/ui/pagination";
import { Plus, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  fullName: z.string().min(1, "Full Name is required"),
  company: z.string().min(1, "Company is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

type Dca = {
  id: string;
  email: string;
  profile: {
    fullName: string;
    company: string;
    phone: string;
    address: string;
  };
};

export default function DCAPage() {
  const [dcas, setDcas] = useState<Dca[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    company: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDcas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const { data } = await api.get<{ dcas: Dca[] }>("/admin/dca", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDcas(data.dcas);
    } catch (err) {
      console.error("Failed to fetch DCAs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDcas();
  }, []);

  const handleCreate = async () => {
    // Validate the form with Zod
    const result = formSchema.safeParse(form);
    if (!result.success) {
      setFormErrors(result.error.format());
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      await api.post("/auth/admin/create-dca", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("DCA created successfully!");
      setOpen(false);
      setForm({ email: "", fullName: "", company: "", phone: "", address: "" });
      fetchDcas();
    } catch (err) {
      console.error("Failed to create DCA:", err);
      toast.error("Failed to create DCA");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      await api.delete("/auth/admin/delete-dca", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { dcaId: id },
      });

      toast.success("DCA deleted successfully!");
      fetchDcas();
    } catch (err) {
      console.error("Failed to delete DCA:", err);
      toast.error("Failed to delete DCA");
    }
  };

  const paginatedDcas = dcas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(dcas.length / itemsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-end mb-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              New DCA
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg w-full space-y-6">
            <DialogHeader>
              <DialogTitle>Create DCA Account</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new DCA user.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4">
              {["email", "fullName", "company", "phone", "address"].map((field) => (
                <div key={field}>
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input
                    id={field}
                    placeholder={field === "email" ? "user@example.com" : ""}
                    value={(form as any)[field]}
                    className="my-2"
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  />
                  {formErrors[field] && (
                    <span className="text-red-500 text-sm">
                      {formErrors[field]?._errors?.[0]}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl p-4 border shadow-md">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading…
                </TableCell>
              </TableRow>
            ) : paginatedDcas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No DCAs found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDcas.map((dca) => (
                <TableRow key={dca.id}>
                  <TableCell>{dca.profile.fullName}</TableCell>
                  <TableCell>{dca.email}</TableCell>
                  <TableCell>{dca.profile.company}</TableCell>
                  <TableCell>{dca.profile.phone}</TableCell>
                  <TableCell>{dca.profile.address}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(dca.id)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-right">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
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
