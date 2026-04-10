"use client"
import React, { useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import toast from "react-hot-toast";

type RazorpayResponse = {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
};

type RazorpayOptions = {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: (response: RazorpayResponse) => void;
      prefill?: {
            name?: string;
            email?: string;
      };
      theme?: {
            color?: string;
      };
};

declare global {
      interface Window {
            Razorpay?: new (options: RazorpayOptions) => {
                  open: () => void;
            };
      }
}

export default function DashboardPage(){
      const [headline, setHeadline] = React.useState("Hello ");
                  const [isPaying, setIsPaying] = React.useState<string | null>(null);
      const router = useRouter();

                  const plans = [
                                    { name: "Bike", amountInPaise: 100 },
                                    { name: "Car Basic", amountInPaise: 100 },
                                    { name: "Car Premium", amountInPaise: 100 },
                  ];

      const moveToProfilePage = function(){
            router.push('/profile');
      }

      const loadRazorpayScript = () => {
            return new Promise<boolean>((resolve) => {
                  if (window.Razorpay) {
                        resolve(true);
                        return;
                  }

                  const script = document.createElement("script");
                  script.src = "https://checkout.razorpay.com/v1/checkout.js";
                  script.async = true;
                  script.onload = () => resolve(true);
                  script.onerror = () => resolve(false);
                  document.body.appendChild(script);
            });
      };

      const checkoutPlan = async (planName: string, amountInPaise: number) => {
            if (isPaying) {
                  return;
            }

            setIsPaying(planName);
            try {
                  const loaded = await loadRazorpayScript();
                  if (!loaded || !window.Razorpay) {
                        toast.error("Unable to load Razorpay checkout.");
                        return;
                  }

                  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
                  if (!key || key.includes("replace_with") || !key.startsWith("rzp_")) {
                        toast.error("Invalid NEXT_PUBLIC_RAZORPAY_KEY_ID in env.");
                        return;
                  }

                  const orderResponse = await axios.post("/api/payment/create-order", {
                        planName,
                        amountInPaise,
                  });

                  const { orderId, amount, currency } = orderResponse.data as {
                        orderId: string;
                        amount: number;
                        currency: string;
                  };

                  const razorpay = new window.Razorpay({
                        key,
                        amount,
                        currency,
                        name: "The Shine Company",
                        description: `${planName} Wash Plan`,
                        order_id: orderId,
                        handler: async (response: RazorpayResponse) => {
                              try {
                                    await axios.post("/api/payment/verify", response);
                                    toast.success(`${planName} payment successful!`);
                              } catch {
                                    toast.error("Payment verification failed.");
                              }
                        },
                        theme: {
                              color: "#065f46",
                        },
                  });

                  razorpay.open();
            } catch (error: unknown) {
                  if (axios.isAxiosError(error)) {
                        const message = (error.response?.data as { message?: string })?.message;
                        toast.error(message || "Payment failed. Please try again.");
                  } else {
                        toast.error("Payment failed. Please try again.");
                  }
            } finally {
                  setIsPaying(null);
            }
      };

      useEffect(() => {
            let intervalId: ReturnType<typeof setInterval> | undefined;

            const loadHeadline = async () => {
                  try {
                        const profile = await axios.get('/api/profile');
                        const rawName = profile.data?.username?.trim() || "there";
                        const shortName = rawName.split(/\s+/)[0] || rawName;
                        const fullText = `${shortName}`;
                        let index = 0;

                        setHeadline("Hello ");
                        intervalId = setInterval(() => {
                              index += 1;
                              setHeadline(`Hello ${fullText.slice(0, index)}`);
                              if (index >= fullText.length && intervalId) {
                                    clearInterval(intervalId);
                              }
                        }, 90);
                  } catch {
                        setHeadline("Hello there");
                  }
            };

            void loadHeadline();

            return () => {
                  if (intervalId) {
                        clearInterval(intervalId);
                  }
            };
      }, []);

      return (
      <div className="min-h-screen w-full bg-blue-200 p-1">
    <div className="flex h-full min-h-[calc(100vh-0.5rem)] w-full flex-col rounded-sm border border-gray-400 bg-white px-2 py-2 sm:px-4 sm:py-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-700 sm:text-5xl lg:text-7xl">
          {headline}
        </h1>

        <div className="mt-2 flex w-full flex-row items-stretch gap-2 sm:mt-0 sm:w-auto  sm:items-center sm:justify-end">
          <div className="flex flex-col sm:flex-row w-full items-center" />

          <Image
            src="/download.png"
            width={70}
            height={70}
            alt="work"
            className="h-20 w-20 rounded-full bg-amber-400 cursor-pointer shadow-md hover:shadow-lg sm:h-14 sm:w-14"
            onClick={moveToProfilePage}
          />
        </div>
      </div>

                  <div className="mt-4 grid min-h-[65vh] w-full flex-1 grid-cols-1 gap-4 rounded-sm border border-gray-200 bg-white p-4 shadow-md md:grid-cols-3">
                        {plans.map((plan) => (
                              <div key={plan.name} className="flex h-full min-h-45 flex-col justify-between rounded-lg border border-gray-200 bg-gray-50 p-5">
                                    <h2 className="text-2xl font-semibold tracking-tight text-gray-700">{plan.name}</h2>
                                    <p className="text-sm text-gray-500">1Rs</p>
                                    <MotionButton
                                          className="mt-5 w-full rounded-md bg-emerald-800 px-4 py-2 text-white font-semibold hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-emerald-600"
                                          disabled={isPaying !== null}
                                          onClick={() => void checkoutPlan(plan.name, plan.amountInPaise)}
                                    >
                                          {isPaying === plan.name ? "Processing..." : "Checkout"}
                                    </MotionButton>
                              </div>
                        ))}
      </div>

      <SiteFooter />
    </div>
  </div>
);
}