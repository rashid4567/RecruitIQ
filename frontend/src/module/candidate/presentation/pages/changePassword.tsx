import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updatePasswordUC } from "@/module/auth/presentation/di/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export function CandidatePrivacyAndSecurity() {
  /* ───────── Privacy State ───────── */
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    contactInfo: "recruiters-only",
    resumeDownload: true,
    dataSharing: "limited",
    activityStatus: true,
    searchVisibility: true,
  });

  /* ───────── Password State ───────── */
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  /* ───────── Password Submit ───────── */
  const handlePasswordSubmit = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setIsUpdating(true);

      await updatePasswordUC.execute({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setPasswordError(
        err?.message || "Failed to update password. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-12">
      {/* ───────── PRIVACY SECTION ───────── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Privacy Settings
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Control how your profile appears to recruiters and companies
        </p>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8 space-y-6">
          {[
            {
              id: "profileVisibility",
              title: "Profile Visibility",
              desc: "Control who can see your profile",
              type: "select",
              options: [
                { value: "public", label: "Public" },
                { value: "recruiters-only", label: "Recruiters Only" },
                { value: "private", label: "Only Me" },
              ],
            },
            {
              id: "resumeDownload",
              title: "Resume Download",
              desc: "Allow recruiters to download your resume",
              type: "switch",
            },
            {
              id: "searchVisibility",
              title: "Search Visibility",
              desc: "Appear in recruiter search results",
              type: "switch",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border"
            >
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>

              {item.type === "select" ? (
                <Select
                  value={
                    privacySettings[item.id as keyof typeof privacySettings]
                  }
                  onValueChange={(value) =>
                    setPrivacySettings((p) => ({
                      ...p,
                      [item.id]: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {item.options?.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Switch
                  checked={
                    privacySettings[
                      item.id as keyof typeof privacySettings
                    ] as boolean
                  }
                  onCheckedChange={(checked) =>
                    setPrivacySettings((p) => ({
                      ...p,
                      [item.id]: checked,
                    }))
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── SECURITY / PASSWORD SECTION ───────── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security</h2>
        <p className="text-sm text-gray-500 mb-6">
          Update your account password securely
        </p>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8 space-y-6">
          {passwordError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              {passwordSuccess}
            </div>
          )}

          {[
            { name: "currentPassword", label: "Current Password" },
            { name: "newPassword", label: "New Password" },
            { name: "confirmPassword", label: "Confirm New Password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-2">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData[field.name as keyof typeof passwordData]}
                  onChange={(e) =>
                    setPasswordData((p) => ({
                      ...p,
                      [field.name]: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}

          <Button
            onClick={handlePasswordSubmit}
            disabled={isUpdating}
            className="w-full mt-4"
          >
            {isUpdating ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}
