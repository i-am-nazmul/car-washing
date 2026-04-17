import { PlanCardProps, PlanData } from "@/components/cards/types";

export const BIKE_CARE_PLAN: PlanData = {
  name: "BIKE CARE",
  description: "Simple and reliable bike care",
  amountInPaise: 49900,
  displayPrice: "₹499",
  gradient: "from-orange-50 via-orange-100 to-orange-200",
  bubbleOne: "bg-orange-300/40",
  bubbleTwo: "bg-orange-200/60",
};

export const BIKE_CARE_FEATURES: string[] = [
  "5 days/week cleaning",
  "Exterior wash + seat cleaning",
  "Mirror cleaning",
  "Tyre cleaning (dry wipe)",
  "Wax (2x/month)",
  "Air pressure check",
];

export default function BikeCard({ plan, features }: PlanCardProps) {
  return (
    <div className="card-trace card-pop relative h-full overflow-hidden rounded-4xl border border-violet-300 bg-transparent shadow-[0_0_18px_rgba(139,92,246,0.35)]">
      <div className="relative z-10 flex h-full min-h-72 flex-col px-6 py-7 sm:px-8">
        {plan.badge && (
          <span className="w-fit rounded-full border border-white/60 bg-transparent px-3 py-1 text-sm font-semibold tracking-tight text-white">
            {plan.badge}
          </span>
        )}
        <h2 className="mt-2 px-2 text-4xl font-extrabold tracking-tight text-yellow-300">{plan.name}</h2>
        {plan.description && <p className="mt-2 text-lg font-bold text-white">{plan.description}</p>}
        <p className="mt-3 whitespace-nowrap text-5xl font-extrabold tracking-tight text-white">
          {plan.displayPrice}
          <span className="ml-1 text-2xl font-medium text-white/85">/month</span>
        </p>

        <ul className="mt-7 space-y-3">
          {features.map((feature) => (
            <li key={`${plan.name}-${feature}`} className="flex items-center gap-3 text-2xl tracking-tight text-white/90">
              <span className="inline-flex h-6 w-6 min-h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs leading-none font-bold text-white">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
