"use client";

import * as motion from "motion/react-client";
import PremiumUsersPanel from "@/components/admin/PremiumUsersPanel";
import SiteFooter from "@/components/SiteFooter";

export default function AdminPremiumUsersPage() {
  return (
    <div className="min-h-screen w-full bg-[#03061a] p-1 text-amber-100">
      <div className="flex h-full min-h-[calc(100vh-0.5rem)] w-full flex-col bg-[#050b28] px-2 py-2 sm:px-4 sm:py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-amber-200 sm:text-5xl">Premium Users</h1>
          <p className="mt-2 text-amber-100/80">Manage user service plans and benefits</p>
        </motion.div>

        <PremiumUsersPanel />
      </div>

      <SiteFooter />
    </div>
  );
}
