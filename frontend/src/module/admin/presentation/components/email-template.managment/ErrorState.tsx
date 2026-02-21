import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-rose-200/70 bg-rose-50/40">
      <CardContent className="p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-rose-600 mx-auto mb-3" />
        <p className="text-rose-800 font-medium">{error}</p>
        <Button
          size="sm"
          className="mt-4 bg-rose-600 hover:bg-rose-700"
          onClick={onRetry}
        >
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}