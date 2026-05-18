import { PlanCardProps, PlanData } from "@/components/cards/types";
import { HOME_CARD_BODY, HOME_CARD_FEATURE, HOME_CARD_PRICE, HOME_CARD_PRICE_SUFFIX, HOME_CARD_SUBTITLE, HOME_CARD_TITLE, HOME_CTA_GRADIENT } from "@/components/home/typography";

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

export default function BikeCard({ plan, features, vehicleCategory, onCheckout, onAddToCart }: PlanCardProps) {
  return (
    <div className="card-trace card-pop relative h-full overflow-visible rounded-4xl border border-violet-200/90 ring-1 ring-violet-300/70 bg-transparent shadow-[0_0_18px_rgba(139,92,246,0.35)]">
      <div className="relative z-10 flex h-full min-h-72 flex-col px-6 py-7 pb-18 sm:px-8">
        {plan.badge && (
          <span className="w-fit rounded-full border border-white/60 bg-transparent px-3 py-1 text-sm font-semibold tracking-tight text-white">
            {plan.badge}
          </span>
        )}
        <h2 className={`mt-2 px-2 ${HOME_CARD_TITLE} text-yellow-300`}>{plan.name}</h2>
        {plan.description && <p className={`mt-2 ${HOME_CARD_SUBTITLE} text-white`}>{plan.description}</p>}
        <p className={`${HOME_CARD_PRICE} mt-3 text-white`}>
          {plan.displayPrice}
          <span className={`${HOME_CARD_PRICE_SUFFIX} text-white/85`}>/Month</span>
        </p>

        <ul className="mt-7 space-y-3">
          {features.map((feature) => (
            <li key={`${plan.name}-${feature}`} className={`${HOME_CARD_FEATURE} text-white/90`}>
              <span className="inline-flex h-6 w-6 min-h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs leading-none font-bold text-white">✓</span>
              <span className={HOME_CARD_BODY}>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onAddToCart(plan, vehicleCategory)}
            className={`w-full rounded-full px-6 py-3 text-lg font-bold tracking-tight transition cursor-pointer ${HOME_CTA_GRADIENT}`}
          >
            Add to cart
          </button>
        </div>

      </div>

      <p className="absolute -bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-violet-300 bg-[#020826]/90 px-8 py-3 text-4xl font-extrabold tracking-tight text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:text-5xl">
        ₹359
        <span className={`${HOME_CARD_PRICE_SUFFIX} text-white/85`}>/One Time</span>
      </p>
    </div>
  );
}
