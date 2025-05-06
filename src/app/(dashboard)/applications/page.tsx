"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type Application = {
  id: string;
  submissionDate: string;
  document: {
    name: string;
    description: string;
    documentType: string;
    documentUrl: string;
  };
};

export default function DCAApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [action, setAction] = useState<"APPROVED" | "DECLINED" | null>(null);
  const [comment, setComment] = useState("");

  // 1) Fetch pending applications
  const fetchApps = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/applications/dca/view", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setApplications(
          data.applications.filter((a: any) => a.status === "PENDING")
        );
      } else {
        toast.error("Failed to load applications");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const openDialog = (
    app: Application,
    act: "APPROVED" | "DECLINED"
  ) => {
    setSelectedApp(app);
    setAction(act);
    setComment("");
    setDialogOpen(true);
  };

  // 2) Handle approve/decline decision
  const handleDecision = async () => {
    if (!selectedApp || !action) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/applications/dca", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status: action,
          comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unknown error");

      toast.success(`Application ${action.toLowerCase()}!`);
      // remove from list
      setApplications((apps) =>
        apps.filter((a) => a.id !== selectedApp.id)
      );
      setDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to ${action?.toLowerCase()}: ${err.message}`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Pending Applications</h1>

      <div className="overflow-x-auto rounded-xl border shadow-md">
        <Table className="min-w-[800px] table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2">Name</TableHead>
              <TableHead className="px-4 py-2">Description</TableHead>
              <TableHead className="px-4 py-2">Type</TableHead>
              <TableHead className="px-4 py-2 text-right">Date</TableHead>
              <TableHead className="px-4 py-2 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  Loading…
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  No pending applications
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-muted/50">
                  <TableCell className="px-4 py-2 max-w-xs truncate">
                    {app.document.name}
                  </TableCell>
                  <TableCell className="px-4 py-2 max-w-sm truncate">
                    {app.document.description}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {app.document.documentType}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    {new Date(app.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDialog(app, "DECLINED")}
                    >
                      <XCircle className="h-5 w-5 text-red-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDialog(app, "APPROVED")}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {/* you can add a TableFooter for pagination if desired */}
        </Table>
      </div>

      {/* Decision Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "APPROVED" ? "Approve" : "Decline"} Application
            </DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-2 w-full"
          />
          <DialogFooter className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDecision}>
              {action === "APPROVED" ? "Approve" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
