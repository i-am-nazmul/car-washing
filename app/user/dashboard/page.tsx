"use client";

import React from "react";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import axios from "axios";
import toast from "react-hot-toast";
import SiteFooter from "@/components/SiteFooter";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");
  const [isSubmittingMessage, setIsSubmittingMessage] = React.useState(false);

  const hasActiveMembership = true;

  React.useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get("/api/profile");
        setUsername(response.data?.username || "User");
      } catch (error) {
        console.error("Failed to fetch username:", error);
        setUsername("User");
      }
    };

    void fetchUsername();
  }, []);

  const moveProfile = React.useCallback(() => {
    router.push("/user/profile");
  }, [router]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (messageText.length < 5) {
      toast.error("Message must be at least 5 characters");
      return;
    }

    setIsSubmittingMessage(true);
    try {
      const response = await axios.post("/api/messages/send", {
        message: messageText,
      });

      if (response.status === 201) {
        toast.success("Message sent successfully!");
        setMessageText("");
        setIsMessageModalOpen(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message;
        toast.error(message || "Failed to send message");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#03061a] p-1 text-amber-100">
      <div className="flex h-full min-h-[calc(100vh-0.5rem)] w-full flex-col bg-[#050b28] px-2 py-2 sm:px-4 sm:py-4">
        {/* Top Bar with Greeting and Profile Icon */}
        <div className="flex w-full items-start justify-between gap-4 mb-8">
          {/* Greeting on Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <h2 className="text-4xl font-bold text-amber-200 sm:text-5xl lg:text-6xl">
              Hello, <span className="text-amber-100">{username}</span>!
            </h2>
          </motion.div>

          {/* Icons on Right */}
          <div className="flex gap-3 items-center shrink-0">
            {/* Message Icon */}
            <div className="relative group">
              <button
                type="button"
                aria-label="Messages"
                onClick={() => setIsMessageModalOpen(true)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/15 cursor-pointer sm:h-16 sm:w-16"
              >
                <svg
                  className="h-6 w-6 text-amber-200 sm:h-8 sm:w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </button>

              {/* Custom Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block px-4 py-2 bg-amber-200 text-gray-900 text-xs font-semibold rounded-md pointer-events-none z-50 text-center w-max">
                Send message to<br />The Shine Company
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-amber-200"></div>
              </div>
            </div>

            {/* Profile Icon */}
            <button
              type="button"
              aria-label="Go to profile"
              onClick={moveProfile}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/15 cursor-pointer sm:h-16 sm:w-16"
            >
              <svg
                className="h-6 w-6 text-amber-200 sm:h-8 sm:w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          </div>
        </div>

        {hasActiveMembership ? (
          <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-3xl border border-amber-200/25 bg-[#070f2f] px-6 py-8 shadow-[0_0_22px_rgba(253,230,138,0.1)] sm:px-10">
              <h3 className="text-xl font-semibold text-amber-200 sm:text-2xl">Benefits Used</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Exterior Refreshes", value: "20/20" },
                  { label: "Dashboard Polish", value: "1/1" },
                  { label: "Tyre Polishes", value: "2/2" },
                ].map((benefit) => (
                  <div key={benefit.label} className="rounded-2xl border border-amber-200/20 bg-[#060b26] px-5 py-6 text-center">
                    <div className="text-3xl font-semibold text-amber-200 sm:text-4xl">{benefit.value}</div>
                    <div className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-amber-100/80 sm:text-base">
                      {benefit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-amber-200/30 bg-[#070f2f] px-6 py-12 text-center shadow-[0_0_22px_rgba(253,230,138,0.12)] sm:px-10">
            <h2 className="text-3xl font-semibold tracking-tight text-amber-200 sm:text-4xl">Your Membership is Pending Activation.</h2>
            <p className="mt-4 text-lg font-medium text-amber-100/85 sm:text-2xl">
              To maintain our signature quality, we limit slots per community. Complete your subscription to lock in your daily maintenance slot.
            </p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md rounded-3xl border border-amber-200/25 bg-[#070f2f] p-6 shadow-[0_0_30px_rgba(253,230,138,0.2)] sm:p-8"
          >
            <h3 className="text-2xl font-bold text-amber-200 mb-4">Send us a Message</h3>
            <p className="text-amber-100/80 mb-4">Got a question? Send us your message and we'll get back to you soon!</p>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter your message here..."
              maxLength={1000}
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-[#050b28] border border-amber-200/30 text-white placeholder:text-white/50 focus:border-amber-200 focus:outline-none resize-none"
            />

            <div className="mt-2 text-xs text-amber-100/60">
              {messageText.length}/1000 characters
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isSubmittingMessage}
                className="flex-1 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 py-3 text-white font-semibold cursor-pointer hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingMessage ? "Sending..." : "Send Message"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMessageModalOpen(false);
                  setMessageText("");
                }}
                className="flex-1 rounded-lg border border-amber-200/30 bg-transparent px-4 py-3 text-amber-200 font-semibold cursor-pointer hover:bg-amber-200/10 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
