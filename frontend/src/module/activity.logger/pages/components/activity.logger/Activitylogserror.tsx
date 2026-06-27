import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivityLogsErrorProps {
  message: string;
  onRetry: () => void;
}

export function ActivityLogsError({
  message,
  onRetry,
}: ActivityLogsErrorProps) {
  return (
    <Card className="border-rose-200/70 bg-rose-50/40 shadow-sm">
      <CardContent className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-rose-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-rose-900 mb-2">
          Failed to load logs
        </h2>
        <p className="text-rose-700 mb-6">{message}</p>
        <Button onClick={onRetry} className="bg-rose-600 hover:bg-rose-700">
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
