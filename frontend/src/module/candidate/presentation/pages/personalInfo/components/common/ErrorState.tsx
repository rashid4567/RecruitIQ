import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
  loading: boolean;
}

export function ErrorState({ onRetry, loading }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-linear-to-br from-white to-blue-50/50">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-linear-to-br from-red-100 to-red-200 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            Unable to load your profile information. Please try again.
          </p>
          <Button
            onClick={onRetry}
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Try Again"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
