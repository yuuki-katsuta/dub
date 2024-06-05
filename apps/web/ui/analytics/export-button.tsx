import { LoadingSpinner } from "@dub/ui";
import { Download } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { AnalyticsContext } from "./analytics-provider";

export default function ExportButton() {
  const [loading, setLoading] = useState(false);
  const { queryString } = useContext(AnalyticsContext);

  async function exportData() {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/export?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Dub Analytics Export - ${new Date().toISOString()}.zip`;
      a.click();
    } catch (error) {
      throw new Error(error);
    }
    setLoading(false);
  }

  return (
    <button
      disabled={!queryString || loading}
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white transition-all focus:border-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:cursor-progress disabled:text-gray-400 disabled:hover:bg-white disabled:active:bg-white"
      onClick={() => {
        toast.promise(exportData(), {
          loading: "Exporting files...",
          success: "Exported successfully",
          error: (error) => error,
        });
      }}
    >
      {loading ? (
        <LoadingSpinner className="h-4 w-4" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </button>
  );
}
