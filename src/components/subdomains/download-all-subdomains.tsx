"use client";

import { Button } from "@/ui/button";
import { DownloadIcon, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DownloadAllSubdomains = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/export-subdomains");
      if (!res.ok) throw new Error("Failed to fetch subdomains");
      const subdomains = await res.json();
      const blob = new Blob([JSON.stringify(subdomains)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "routaar-subdomains.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Subdomains exported successfully.");
    } catch (error) {
      toast.error("Failed to download subdomains.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={isLoading}>
      {isLoading ? <LoaderIcon className="animate-spin" size={14} /> : <DownloadIcon size={14} />}
      <span>{isLoading ? "Exporting..." : "Export all subdomains"}</span>
    </Button>
  );
};

export default DownloadAllSubdomains; 