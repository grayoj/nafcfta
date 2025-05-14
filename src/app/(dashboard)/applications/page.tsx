"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
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
import {
  CheckCircle,
  Eye,
  XCircle,
  FilePlus,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge"; // Assuming you have a Badge component in your UI library

type Application = {
  id: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [action, setAction] = useState<"APPROVED" | "DECLINED" | null>(null);
  const [comment, setComment] = useState("");

  const fetchApps = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/applications/dca/view", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const sortedApps = data.applications.sort((a: Application, b: Application) => {
          if (a.status === b.status) return 0;
          return a.status === "PENDING" ? -1 : 1;
        });
        setApplications(sortedApps);
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

  const openDialog = (app: Application, act: "APPROVED" | "DECLINED") => {
    setSelectedApp(app);
    setAction(act);
    setComment("");
    setDialogOpen(true);
  };

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
      // refetch list
      fetchApps();
      setDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to ${action.toLowerCase()}: ${err.message || err}`);
    }
  };

  return (
    <div className="my-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      {loading ? (
        <div className="text-center py-8">Loading…</div>
      ) : applications.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center p-16 rounded-lg border border-dashed border-gray-300 hover:bg-gray-50"
        >
          <FilePlus className="h-12 w-12 text-gray-500" />
          <p className="mt-2 text-lg text-gray-700">
            No Applications available yet. Exporter applications appear here
          </p>
        </div>
      ) : (
        <div className="rounded-xl border shadow-md overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
                <TableHead className="text-center">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.document.name}</TableCell>
                  <TableCell>{app.document.description}</TableCell>
                  <TableCell>{app.document.documentType}</TableCell>
                  <TableCell className="text-right">
                    {new Date(app.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        app.status === "PENDING"
                          ? "yellow"
                          : app.status === "APPROVED"
                            ? "green"
                            : "red"
                      }
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    {app.status === "PENDING" ? (
                      <>
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
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Approved</span>
                    )}
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
          </Table>
        </div>
      )}

      {/* Decision Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "APPROVED" ? "Approve" : "Decline"} Application
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <p className="mb-2 text-sm text-muted-foreground">
              {`You're about to ${action?.toLowerCase()} this application. You may leave a comment:`}
            </p>
            <Textarea
              placeholder="Add a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full"
            />
          </div>

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
