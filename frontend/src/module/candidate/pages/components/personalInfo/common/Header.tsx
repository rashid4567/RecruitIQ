import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XCircle } from "lucide-react";

interface ProfileInfo {
  fullName: string;
  email: string;
  profileImage?: string;
  emailVerified?: boolean;
}

interface HeaderProps {
  profile: ProfileInfo | null;
  error: string | null;
  onRetry: () => void;
}

export function Header({ profile, error, onRetry }: HeaderProps) {
  const getInitials = (name?: string) => {
  return (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
};

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-6 md:px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your profile and preferences
        </p>
      </div>

      <div className="flex items-center gap-4">
        {error && (
          <div className="px-4 py-2 bg-linear-to-r from-red-50 to-red-50/50 text-red-700 text-sm rounded-lg border border-red-200 animate-pulse">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="h-6 px-2 text-xs text-red-700 hover:text-red-800 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        <div className="hidden md:block text-right">
          <p className="text-sm font-semibold text-gray-900">
            {profile?.fullName}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-50">
            {profile?.email}
          </p>
        </div>

        <div className="relative group">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all cursor-pointer">
              <AvatarImage
                src={profile?.profileImage || "/default-avatar.png"}
                alt={profile?.fullName}
              />
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold">
                {profile ? getInitials(profile.fullName) : "U"}
              </AvatarFallback>
            </Avatar>
            {profile?.emailVerified && (
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
