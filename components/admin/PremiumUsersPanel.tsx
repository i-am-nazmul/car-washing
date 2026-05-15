"use client";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import * as motion from "motion/react-client";

interface PremiumUser {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  plan: Array<{ planType?: string; planId?: string }>;
  createdAt: string;
}

interface PlanDetail {
  planId: string;
  planType: string;
  planName: string;
  wash: number;
  interiorClean: number;
  dashboard: number;
  tyrePolish: number;
  wax: number;
}

export default function PremiumUsersPanel() {
  const [premiumUsers, setPremiumUsers] = React.useState<PremiumUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState<PremiumUser | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<PlanDetail | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    fetchPremiumUsers();
  }, []);

  const fetchPremiumUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/premium-users");
      setPremiumUsers(response.data?.premiumUsers || []);
    } catch (error) {
      console.error("Failed to fetch premium users:", error);
      toast.error("Failed to load premium users");
      setPremiumUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = async (user: PremiumUser) => {
    setSelectedUser(user);
    try {
      const response = await axios.get(`/api/plans?userId=${user._id}`);
      if (response.data?.plans && response.data.plans.length > 0) {
        setSelectedPlan(response.data.plans[0]);
      }
    } catch (error) {
      console.error("Failed to fetch plan details:", error);
      toast.error("Failed to load plan details");
    }
  };

  const updateServiceCount = async (field: string, newValue: number) => {
    if (!selectedPlan) return;

    try {
      setIsUpdating(true);
      const response = await axios.patch("/api/admin/plans/update", {
        planId: selectedPlan.planId,
        planType: selectedPlan.planType,
        field,
        value: newValue,
      });

      if (response.status === 200) {
        setSelectedPlan({
          ...selectedPlan,
          ...response.data.plan,
        });
        toast.success(`${field} updated successfully!`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update service count");
      } else {
        toast.error("Failed to update service count");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = (field: string) => {
    if (!selectedPlan) return;
    const currentValue = selectedPlan[field as keyof PlanDetail] as number;
    const maxValues: { [key: string]: number } = {
      wash: 20,
      interiorClean: selectedPlan.planType.includes("shine") ? 4 : 2,
      dashboard: 2,
      tyrePolish: selectedPlan.planType.includes("shine") ? 4 : 2,
      wax: 2,
    };
    const maxValue = maxValues[field];

    if (currentValue < maxValue) {
      updateServiceCount(field, currentValue + 1);
    }
  };

  const handleDecrement = (field: string) => {
    if (!selectedPlan) return;
    const currentValue = selectedPlan[field as keyof PlanDetail] as number;

    if (currentValue > 0) {
      updateServiceCount(field, currentValue - 1);
    }
  };

  return (
    <div className="w-full" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"}}>
      <div className="rounded-lg border border-gray-300 bg-white p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Users ({premiumUsers.length})</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : premiumUsers.length === 0 ? (
          <p className="text-gray-500">No premium users yet</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {premiumUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`w-full text-left p-3 rounded-lg transition cursor-pointer ${
                  selectedUser?._id === user._id
                    ? "bg-gray-200 border border-gray-400"
                    : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <div className="font-semibold text-gray-700">{user.username}</div>
                <div className="text-xs text-gray-600 mt-1">{user.email}</div>
                {user.phoneNumber && (
                  <div className="text-xs text-gray-600">{user.phoneNumber}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedUser && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl rounded-lg border border-gray-300 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-700">{selectedUser.username}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
                {selectedUser.phoneNumber && (
                  <p className="text-gray-600">{selectedUser.phoneNumber}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedPlan(null);
                }}
                className="rounded-lg border border-gray-300 px-3 py-1 text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{selectedPlan.planName} Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
                  <div className="text-sm uppercase tracking-widest text-gray-600 mb-4">Exterior Refreshes</div>
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => handleDecrement("wash")}
                      disabled={isUpdating || selectedPlan.wash === 0}
                      className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <div className="text-4xl font-bold text-gray-700">{selectedPlan.wash}/20</div>
                    <button
                      onClick={() => handleIncrement("wash")}
                      disabled={isUpdating || selectedPlan.wash === 20}
                      className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {selectedPlan.planType !== "bike" && (
                  <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
                    <div className="text-sm uppercase tracking-widest text-gray-600 mb-4">Interior Clean</div>
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() => handleDecrement("interiorClean")}
                        disabled={isUpdating || selectedPlan.interiorClean === 0}
                        className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <div className="text-4xl font-bold text-gray-700">{selectedPlan.interiorClean}/{selectedPlan.planType.includes("shine") ? 4 : 2}</div>
                      <button
                        onClick={() => handleIncrement("interiorClean")}
                        disabled={isUpdating || selectedPlan.interiorClean === (selectedPlan.planType.includes("shine") ? 4 : 2)}
                        className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {selectedPlan.planType !== "bike" && (
                  <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
                    <div className="text-sm uppercase tracking-widest text-gray-600 mb-4">Dashboard Polish</div>
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() => handleDecrement("dashboard")}
                        disabled={isUpdating || selectedPlan.dashboard === 0}
                        className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <div className="text-4xl font-bold text-gray-700">{selectedPlan.dashboard}/2</div>
                      <button
                        onClick={() => handleIncrement("dashboard")}
                        disabled={isUpdating || selectedPlan.dashboard === 2}
                        className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {selectedPlan.planType !== "bike" && (
                  <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
                    <div className="text-sm uppercase tracking-widest text-gray-600 mb-4">Tyre Polishes</div>
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() => handleDecrement("tyrePolish")}
                        disabled={isUpdating || selectedPlan.tyrePolish === 0}
                        className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <div className="text-4xl font-bold text-gray-700">{selectedPlan.tyrePolish}/{selectedPlan.planType.includes("shine") ? 4 : 2}</div>
                      <button
                        onClick={() => handleIncrement("tyrePolish")}
                        disabled={isUpdating || selectedPlan.tyrePolish === (selectedPlan.planType.includes("shine") ? 4 : 2)}
                        className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {selectedPlan.planType === "bike" && (
                  <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
                    <div className="text-sm uppercase tracking-widest text-gray-600 mb-4">Wax</div>
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() => handleDecrement("wax")}
                        disabled={isUpdating || selectedPlan.wax === 0}
                        className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <div className="text-4xl font-bold text-gray-700">{selectedPlan.wax}/2</div>
                      <button
                        onClick={() => handleIncrement("wax")}
                        disabled={isUpdating || selectedPlan.wax === 2}
                        className="w-12 h-12 rounded-lg bg-gray-200 border border-gray-400 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
