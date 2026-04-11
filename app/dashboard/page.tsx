"use client"
import React, { useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { useIsLoading } from "@/store/store";

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
      const { isLoading, setIsLoading } = useIsLoading();
      const router = useRouter();
      const [activePlan, setActivePlan] = React.useState<null | {
            name: string;
            amountInPaise: number;
            displayPrice: string;
            gradient: string;
            bubbleOne: string;
            bubbleTwo: string;
      }>(null);
      const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);

      const isPaymentEnabled = false;

                  const plans = [
                                    {
                                          name: "Bike",
                                          amountInPaise: 40000,
                                          displayPrice: "Rs.400",
                                          gradient: "from-orange-50 via-orange-100 to-orange-200",
                                          bubbleOne: "bg-orange-300/40",
                                          bubbleTwo: "bg-orange-200/60",
                                    },
                                    {
                                          name: "Car Basic",
                                          amountInPaise: 90000,
                                          displayPrice: "Rs.900",
                                          gradient: "from-violet-100 via-indigo-100 to-violet-200",
                                          bubbleOne: "bg-indigo-300/40",
                                          bubbleTwo: "bg-violet-200/60",
                                    },
                                    {
                                          name: "Car Premium",
                                          amountInPaise: 120000,
                                          displayPrice: "Rs.1200",
                                          gradient: "from-cyan-100 via-sky-200 to-teal-200",
                                          bubbleOne: "bg-cyan-300/40",
                                          bubbleTwo: "bg-sky-200/60",
                                    },
                  ];

                  const dummyFeatures = ["Dummy feature 1", "Dummy feature 2", "Dummy feature 3", "Dummy feature 4"];

                  const serviceDetails: Record<string, string[]> = {
                        Bike: [
                              "Foam wash and pressure rinse for body panels, wheel arches, and mudguards.",
                              "Chain area degreasing and careful wipe-down of exposed mechanical surfaces.",
                              "Tank, visor, and mirror polishing with water-spot protection.",
                              "Tyre dressing and final microfiber finish for a clean showroom-ready look.",
                        ],
                        "Car Basic": [
                              "Exterior pre-rinse, shampoo hand wash, and soft-cloth drying.",
                              "Wheel face cleaning with brake-dust removal and tyre shine.",
                              "Dashboard and console dusting with interior vacuum for seats and mats.",
                              "Door jamb cleaning plus quick glass wipe for clear visibility.",
                        ],
                        "Car Premium": [
                              "Detailed exterior wash with bug/tar spot treatment and premium drying.",
                              "Interior deep vacuum with dashboard conditioning and fabric/leather care.",
                              "All-glass treatment, alloy detailing, and tyre restoration finish.",
                              "Protective coat for paint gloss retention and improved water beading.",
                        ],
                  };

      const handleCheckoutClick = (plan: {
            name: string;
            amountInPaise: number;
            displayPrice: string;
            gradient: string;
            bubbleOne: string;
            bubbleTwo: string;
      }) => {
            if (isPaymentEnabled) {
                  void checkoutPlan(plan.name, plan.amountInPaise);
                  return;
            }

            setActivePlan(plan);
            window.requestAnimationFrame(() => {
                  setIsOverlayVisible(true);
            });
      };

      const closeOverlay = () => {
            setIsOverlayVisible(false);
            window.setTimeout(() => {
                  setActivePlan(null);
            }, 220);
      };

      const contactOnWhatsApp = () => {
            if (!activePlan) {
                  return;
            }

            const message = encodeURIComponent(`Hey, I want the ${activePlan.name} service.`);
            const whatsappUrl = `https://wa.me/6002175516?text=${message}`;
            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      };

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
                  setIsLoading(true);
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
                                    setIsLoading(false);
                              }
                        }, 90);
                  } catch {
                        setHeadline("Hello there");
                        setIsLoading(false);
                  }
            };

            void loadHeadline();

            return () => {
                  if (intervalId) {
                        clearInterval(intervalId);
                  }
            };
      }, [setIsLoading]);

      return (
      <div className="min-h-screen w-full p-1">
    {isLoading && <Loader message={"Loading your dashboard"} />}
            <div className="flex h-full min-h-[calc(100vh-0.5rem)] w-full flex-col bg-white px-2 py-2 sm:px-4 sm:py-4">

                  <div className="flex items-center justify-between gap-3">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-700 sm:text-5xl lg:text-7xl">
                        {headline}
                        </h1>

                        <div className="flex items-center justify-end">

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



                  {/*Cards Container  */}
                  <div className="mt-20 mx-auto grid w-4/5 grid-cols-1 items-start gap-8 rounded-3xl border border-gray-200  p-4 shadow-md md:grid-cols-3">
                        {plans.map((plan) => (
                              <div key={plan.name} className="relative overflow-hidden rounded-4xl border border-white/70 shadow-sm">
                                    <div className={`absolute inset-0 bg-linear-to-br ${plan.gradient}`} />
                                    <div className={`absolute -right-14 -top-20 h-56 w-56 rounded-full ${plan.bubbleOne}`} />
                                    <div className={`absolute -left-16 bottom-22 h-56 w-56 rounded-full ${plan.bubbleTwo}`} />

                                    <div className="relative z-10  flex min-h-72 flex-col px-6 py-7 sm:px-8">
                                          <h2 className="text-4xl font-extrabold tracking-tight text-gray-800">{plan.name}</h2>
                                          <p className="mt-5 text-5xl font-extrabold tracking-tight text-gray-900">
                                                {plan.displayPrice}
                                                <span className="ml-1 text-2xl font-medium text-gray-700">/month</span>
                                          </p>

                                          <MotionButton
                                                className="mt-6 w-fit rounded-full border border-gray-900 bg-white/90 px-8 py-2 text-xl font-semibold text-gray-900 
                                                cursor-pointer hover:bg-white disabled:cursor-not-allowed disabled:border-gray-600 disabled:text-gray-600"
                                                disabled={isPaying !== null}
                                                onClick={() => handleCheckoutClick(plan)}
                                          >
                                                {isPaying === plan.name ? "Processing..." : "Checkout"}
                                          </MotionButton>

                                          <ul className="mt-7 space-y-3">
                                                {dummyFeatures.map((feature) => (
                                                      <li key={`${plan.name}-${feature}`} className="flex items-center gap-3 text-2xl tracking-tight text-gray-800">
                                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm font-bold text-white">✓</span>
                                                            <span>{feature}</span>
                                                      </li>
                                                ))}
                                          </ul>
                                    </div>
                              </div>
                        ))}
                  </div>


            </div>

            {activePlan && (
                  <div
                        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 transition-opacity duration-200 ${isOverlayVisible ? "opacity-100" : "opacity-0"}`}
                        onClick={closeOverlay}
                  >
                        <div
                              className={`relative w-full max-w-3xl overflow-hidden rounded-4xl border border-white/70 shadow-2xl transition-all duration-200 ${isOverlayVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}
                              onClick={(event) => event.stopPropagation()}
                        >
                              <div className={`absolute inset-0 bg-linear-to-br ${activePlan.gradient}`} />
                              <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full ${activePlan.bubbleOne}`} />
                              <div className={`absolute -left-20 bottom-[-6rem] h-64 w-64 rounded-full ${activePlan.bubbleTwo}`} />

                              <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8">
                                    <div className="flex items-start justify-between gap-3">
                                          <div>
                                                <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{activePlan.name}</h2>
                                                <p className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">{activePlan.displayPrice} <span className="text-xl font-medium text-gray-700">/month</span></p>
                                          </div>
                                          <button
                                                className="rounded-full border border-gray-900 bg-white/85 px-3 py-1 text-base font-semibold text-gray-900 hover:bg-white cursor-pointer"
                                                onClick={closeOverlay}
                                                type="button"
                                          >
                                                Close
                                          </button>
                                    </div>

                                    <div className="mt-6">
                                          <p className="text-xl font-semibold tracking-tight text-gray-900">Included highlights</p>
                                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                                                {dummyFeatures.map((feature) => (
                                                      <li key={`overlay-${activePlan.name}-${feature}`} className="flex items-center gap-2 text-lg text-gray-800">
                                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">✓</span>
                                                            <span>{feature}</span>
                                                      </li>
                                                ))}
                                          </ul>
                                    </div>

                                    <div className="mt-6">
                                          <p className="text-xl font-semibold tracking-tight text-gray-900">Service details</p>
                                          <ul className="mt-3 space-y-2">
                                                {(serviceDetails[activePlan.name] || []).map((detail) => (
                                                      <li key={`${activePlan.name}-${detail}`} className="text-base text-gray-800 sm:text-lg">• {detail}</li>
                                                ))}
                                          </ul>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                          <MotionButton
                                                className="rounded-full border border-gray-900 bg-white/95 px-6 py-2 text-lg font-semibold text-gray-900 hover:bg-white cursor-pointer"
                                                onClick={contactOnWhatsApp}
                                          >
                                                Contact Us
                                          </MotionButton>
                                    </div>
                              </div>
                        </div>
                  </div>
            )}

      <SiteFooter />
  </div>
);
}