import {

  Bell,
  ChevronLeft,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
  recruiterName?: string;
  recruiterRole?: string;
  profileImage?: string;
}

export function Header({
  title = "Create New Job",
  recruiterName,
  recruiterRole,
  profileImage,
}: HeaderProps) {

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl">

      <div className="flex h-full items-center justify-between px-6 lg:px-8">

        {/* Left Section */}
        <div className="flex items-center gap-4 min-w-0">

          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <Separator
            orientation="vertical"
            className="hidden h-6 sm:block"
          />

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-gray-900">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 lg:gap-4">

                   {/* Notification */}
          <button className="relative rounded-xl p-2.5 transition-colors hover:bg-gray-100">

            <Bell className="h-5 w-5 text-gray-600" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <Separator
            orientation="vertical"
            className="hidden h-8 sm:block"
          />

          {/* Recruiter Profile */}
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-2 py-1.5 transition-all hover:border-gray-200 hover:shadow-sm">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-gray-900">
                {recruiterName || "Recruiter"}
              </p>

              <p className="text-xs text-gray-500">
                {recruiterRole || "Recruiter"}
              </p>
            </div>

            <div className="h-10 w-10 overflow-hidden rounded-xl bg-gray-100 ring-2 ring-gray-100">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">

                  {recruiterName?.charAt(0)?.toUpperCase() || "R"}

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}