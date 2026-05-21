"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import * as motion from "motion/react-client";

type ProfileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  vehicles: string[];
  onProfileUpdate: (value: { phoneNumber: string; address: string; vehicles: string[] }) => void;
};

export default function ProfileSidebar({
  isOpen,
  onClose,
  username,
  email,
  phoneNumber,
  address,
  vehicles,
  onProfileUpdate,
}: ProfileSidebarProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formPhone, setFormPhone] = React.useState("");
  const [formAddress, setFormAddress] = React.useState("");
  const [formVehicles, setFormVehicles] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormPhone(phoneNumber || "");
      setFormAddress(address || "");
      setFormVehicles(vehicles?.length ? vehicles.join(", ") : "");
      setIsEditing(false);
    }
  }, [isOpen, phoneNumber, address, vehicles]);

  const updateProfileInfo = async () => {
    const phoneDigitsOnly = formPhone.replace(/\D/g, "");
    if (phoneDigitsOnly && (phoneDigitsOnly.length < 10 || phoneDigitsOnly.length > 15)) {
      toast.error("Please enter a valid phone number (10-15 digits)");
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post("/api/profile/update-info", {
        phoneNumber: phoneDigitsOnly,
        address: formAddress,
        vehicles: formVehicles
          .split(",")
          .map((vehicle) => vehicle.trim())
          .filter(Boolean),
      });

      if (response.status === 200) {
        onProfileUpdate({
          phoneNumber: phoneDigitsOnly,
          address: formAddress.trim(),
          vehicles: formVehicles
            .split(",")
            .map((vehicle) => vehicle.trim())
            .filter(Boolean),
        });
        setIsEditing(false);
        toast.success("Profile updated");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message;
        toast.error(message || "Failed to update profile");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post("/api/logout");
      await signOut({ redirect: false });
      onClose();
      router.replace("/user/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleHome = () => {
    router.push("/");
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Close profile"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <motion.aside
        className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-amber-200/20 bg-[#050b28] p-6 text-amber-100 shadow-[0_0_30px_rgba(253,230,138,0.15)]"
        initial={{ x: 384 }}
        animate={{ x: 0 }}
        exit={{ x: 384 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-amber-200">Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-amber-200/30 px-3 py-1 text-sm font-semibold text-amber-100 hover:bg-amber-200/10 transition"
          >
            Close
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200/20 bg-[#060b26] p-4">
          <div className="space-y-2 text-sm text-amber-100/90">
            <div>
              <div className="text-amber-200/80">Name</div>
              <div className="text-lg font-semibold text-amber-100">{username}</div>
            </div>
            <div>
              <div className="text-amber-200/80">Email</div>
              <div className="text-base text-amber-100">{email || "No email"}</div>
            </div>
            <div>
              <div className="text-amber-200/80">Phone</div>
              {isEditing ? (
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter phone number"
                  className="mt-1 w-full rounded-lg border border-amber-200/30 bg-[#050b28] px-3 py-2 text-amber-100 placeholder:text-amber-100/40 focus:border-amber-200 focus:outline-none"
                />
              ) : (
                <div className="text-base text-amber-100">
                  {phoneNumber ? phoneNumber : "No phone number"}
                </div>
              )}
            </div>
            <div>
              <div className="text-amber-200/80">Address</div>
              {isEditing ? (
                <textarea
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Add your address"
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-amber-200/30 bg-[#050b28] px-3 py-2 text-amber-100 placeholder:text-amber-100/40 focus:border-amber-200 focus:outline-none"
                />
              ) : (
                <div className="text-base text-amber-100">
                  {address ? address : "No address"}
                </div>
              )}
            </div>
            <div>
              <div className="text-amber-200/80">Vehicles</div>
              {isEditing ? (
                <input
                  type="text"
                  value={formVehicles}
                  onChange={(e) => setFormVehicles(e.target.value)}
                  placeholder="Car, Bike, SUV"
                  className="mt-1 w-full rounded-lg border border-amber-200/30 bg-[#050b28] px-3 py-2 text-amber-100 placeholder:text-amber-100/40 focus:border-amber-200 focus:outline-none"
                />
              ) : (
                <div className="text-base text-amber-100">
                  {vehicles?.length ? vehicles.join(", ") : "No vehicles"}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              void updateProfileInfo();
              return;
            }
            setIsEditing(true);
          }}
          disabled={isSaving}
          className="mt-4 w-full cursor-pointer rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
        </button>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 cursor-pointer rounded-lg border border-amber-200/30 px-4 py-2 text-amber-100 font-semibold hover:bg-amber-200/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
          <button
            type="button"
            onClick={handleHome}
            className="flex-1 cursor-pointer rounded-lg bg-amber-200/20 px-4 py-2 text-amber-100 font-semibold hover:bg-amber-200/30 transition"
          >
            Home
          </button>
        </div>
      </motion.aside>
    </motion.div>
  );
}
