import MotionButton from "@/components/MotionButton";
import { PlanCardProps, PlanData } from "@/components/cards/types";

export const SHINE_CARE_PLAN: PlanData = {
  name: "SHINE CARE",
  description: "Complete care for your car",
  badge: "MOST POPULAR",
  amountInPaise: 119900,
  displayPrice: "₹1199",
  gradient: "from-cyan-100 via-sky-200 to-teal-200",
  bubbleOne: "bg-cyan-300/40",
  bubbleTwo: "bg-sky-200/60",
};

export const SHINE_CARE_FEATURES: string[] = [
  "Eco-friendly waterless wash",
  "5 days/week cleaning",
  "Enhanced interior maintenance - 1x/week",
  "Dashboard polish (2x/month)",
  "Tyre polish (1x/week)",
  "Wax treatment (2x/month)",
  "Wiper fluid top-up",
  "Air pressure check and maintenance - monthly once",
];

export default function CarPremiumCard({ plan, isPaying, features, onCheckout }: PlanCardProps) {
  return (
    <div className="card-trace card-pop relative overflow-hidden rounded-4xl border border-white/70 shadow-sm">
      <div className={`absolute inset-0 bg-linear-to-br ${plan.gradient}`} />
      <div className={`absolute -right-14 -top-20 h-56 w-56 rounded-full ${plan.bubbleOne}`} />
      <div className={`absolute -left-16 bottom-22 h-56 w-56 rounded-full ${plan.bubbleTwo}`} />

      <div className="relative z-10 flex min-h-72 flex-col px-6 py-7 sm:px-8">
        {plan.badge && (
          <span className="w-fit rounded-full border border-gray-800/40 bg-white/70 px-3 py-1 text-sm font-semibold tracking-tight text-gray-800">
            {plan.badge}
          </span>
        )}
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-800">{plan.name}</h2>
        {plan.description && <p className="mt-2 text-lg font-medium text-gray-700">{plan.description}</p>}
        <p className="mt-5 text-5xl font-extrabold tracking-tight text-gray-900">
          {plan.displayPrice}
          <span className="ml-1 text-2xl font-medium text-gray-700">/month</span>
        </p>

        <MotionButton
          className="hover-fill-ltr mt-6 w-fit rounded-full border border-gray-900 bg-white/90 px-8 py-2 text-xl font-semibold text-gray-900 cursor-pointer hover:bg-white disabled:cursor-not-allowed disabled:border-gray-600 disabled:text-gray-600"
          disabled={isPaying !== null}
          onClick={() => onCheckout(plan)}
        >
          {isPaying === plan.name ? "Processing..." : "Checkout"}
        </MotionButton>

        <ul className="mt-7 space-y-3">
          {features.map((feature) => (
            <li key={`${plan.name}-${feature}`} className="flex items-center gap-3 text-2xl tracking-tight text-gray-800">
              <span className="inline-flex h-6 w-6 min-h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs leading-none font-bold text-white">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
