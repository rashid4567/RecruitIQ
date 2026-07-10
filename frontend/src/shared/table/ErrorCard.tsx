import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <Card className="border-rose-200 bg-rose-50/50 shadow-sm rounded-xl">
      <CardContent className="p-8 text-center">
        <h2 className="text-xl font-semibold text-rose-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-rose-700 mb-6">{message}</p>
        <Button size="sm" onClick={onRetry} className="bg-rose-600 hover:bg-rose-700">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}