import { PlanCardProps, PlanData } from "@/components/cards/types";
import { HOME_CARD_BODY, HOME_CARD_FEATURE, HOME_CARD_PRICE, HOME_CARD_PRICE_SUFFIX, HOME_CARD_SUBTITLE, HOME_CARD_TITLE, HOME_CTA_GRADIENT } from "@/components/home/typography";

export const SMART_COMBO_PLAN: PlanData = {
  name: "SMART COMBO",
  description: "One plan for all your vehicles",
  amountInPaise: 119900,
  displayPrice: "₹1199",
  gradient: "from-emerald-100 via-lime-100 to-emerald-200",
  bubbleOne: "bg-emerald-300/40",
  bubbleTwo: "bg-lime-200/60",
};

export const SMART_COMBO_FEATURES: string[] = [
  "Car cleaning (5 days/week)",
  "Bike cleaning (5 days/week)",
  "Interior cleaning (2x/month)",
  "Glass cleaning",
  "Tyre cleaning",
  "Air pressure check",
  "Wiper fluid top-up",
];

export default function ComboCard({ plan, features, vehicleCategory, onCheckout }: PlanCardProps) {
  return (
    <div className="card-trace card-pop relative h-full overflow-hidden rounded-4xl border border-violet-200/90 ring-1 ring-violet-300/70 bg-transparent shadow-[0_0_18px_rgba(139,92,246,0.35)]">
      <div className="relative z-10 flex h-full min-h-72 flex-col px-6 py-7 sm:px-8">
        {plan.badge && (
          <span className="w-fit rounded-full border border-white/60 bg-transparent px-3 py-1 text-sm font-semibold tracking-tight text-white">
            {plan.badge}
          </span>
        )}
        <h2 className={`mt-2 px-2 ${HOME_CARD_TITLE} text-yellow-300`}>{plan.name}</h2>
        {plan.description && <p className={`mt-2 ${HOME_CARD_SUBTITLE} text-white`}>{plan.description}</p>}
        <p className={`${HOME_CARD_PRICE} mt-3 text-white`}>
          {plan.displayPrice}
          <span className={`${HOME_CARD_PRICE_SUFFIX} text-white/85`}>/month</span>
        </p>

        <ul className="mt-7 space-y-3">
          {features.map((feature) => (
            <li key={`${plan.name}-${feature}`} className={`${HOME_CARD_FEATURE} text-white/90`}>
              <span className="inline-flex h-6 w-6 min-h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs leading-none font-bold text-white">✓</span>
              <span className={HOME_CARD_BODY}>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => onCheckout(plan, vehicleCategory)}
            className={`mx-auto block w-fit rounded-full px-6 py-3 text-lg font-bold tracking-tight transition cursor-pointer ${HOME_CTA_GRADIENT}`}
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}
