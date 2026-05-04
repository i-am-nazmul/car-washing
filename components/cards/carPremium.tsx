import { PlanCardProps, PlanData } from "@/components/cards/types";
import { HOME_CARD_BODY, HOME_CARD_FEATURE, HOME_CARD_PRICE, HOME_CARD_PRICE_SUFFIX, HOME_CARD_SUBTITLE, HOME_CARD_TITLE, HOME_CTA_GRADIENT } from "@/components/home/typography";

export const SHINE_CARE_PLAN: PlanData = {
  name: "SHINE CARE",
  description: "Complete care for your car",
  amountInPaise: 99900,
  displayPrice: "₹999",
  gradient: "from-cyan-100 via-sky-200 to-teal-200",
  bubbleOne: "bg-cyan-300/40",
  bubbleTwo: "bg-sky-200/60",
};

export const SHINE_CARE_FEATURES: string[] = [
  "Eco-friendly waterless wash",
  "5 days/week cleaning",
  "Interior cleaning - 1x/week",
  "Dashboard polish - 2x/month",
  "Tyre polish - 1x/week",
  "Wax treatment - 2x/month",
  "Wiper fluid top-up",
  "Air pressure check and maintenance - Monthly once",
];

export default function CarPremiumCard({ plan, features, vehicleCategory, onCheckout }: PlanCardProps) {
  return (
    <div className="card-trace card-pop relative h-full overflow-visible rounded-4xl border border-violet-200/90 ring-1 ring-violet-300/70 bg-transparent shadow-[0_0_18px_rgba(139,92,246,0.35)]">
      <span className="absolute right-4 top-4 z-30 rounded-full border border-violet-200 bg-yellow-300 px-3 py-1 text-sm font-extrabold tracking-wide text-black">
        Recommended
      </span>

      <div className="relative z-10 flex h-full min-h-72 flex-col px-6 py-7 pb-20 sm:px-8">
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

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => onCheckout(plan, vehicleCategory)}
            className={`mx-auto block w-fit rounded-full px-6 py-3 text-lg font-bold tracking-tight transition ${HOME_CTA_GRADIENT}`}
          >
            Book now
          </button>
        </div>

      </div>
    </div>
  );
}
