import { PlanCardProps, PlanData } from "@/components/cards/types";

export const CLEAN_CARE_PLAN: PlanData = {
  name: "CLEAN CARE",
  description: "Perfect for regular maintenance",
  amountInPaise: 79900,
  displayPrice: "₹799",
  gradient: "from-violet-100 via-indigo-100 to-violet-200",
  bubbleOne: "bg-indigo-300/40",
  bubbleTwo: "bg-violet-200/60",
};

export const CLEAN_CARE_FEATURES: string[] = [
  "Eco-friendly waterless wash",
  "5 days/week cleaning",
  "Interior cleaning - 2x/month",
  "Dashboard polish - 2x/month",
  "Tyre polish - 2x/month",

];

export default function CarStandardCard({ plan, features }: PlanCardProps) {
  return (
    <div className="card-trace card-pop relative h-full overflow-visible rounded-4xl border border-violet-200/90 ring-1 ring-violet-300/70 bg-transparent shadow-[0_0_18px_rgba(139,92,246,0.35)]">
      <div className="relative z-10 flex h-full min-h-72 flex-col px-6 py-7 pb-20 sm:px-8">
        {plan.badge && (
          <span className="w-fit rounded-full border border-white/60 bg-transparent px-3 py-1 text-sm font-semibold tracking-tight text-white">
            {plan.badge}
          </span>
        )}
        <h2 className="mt-2 px-2 text-4xl font-extrabold tracking-tight text-yellow-300">{plan.name}</h2>
        {plan.description && <p className="mt-2 text-lg font-bold text-white">{plan.description}</p>}
        <p className="mt-3 whitespace-nowrap text-5xl font-extrabold tracking-tight text-white">
          {plan.displayPrice}
          <span className="ml-1 text-2xl font-medium text-white/85">/Month</span>
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
