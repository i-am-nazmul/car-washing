export type PlanData = {
  name: string;
  description?: string;
  badge?: string;
  amountInPaise: number;
  displayPrice: string;
  gradient: string;
  bubbleOne: string;
  bubbleTwo: string;
};

export type PlanCardProps = {
  plan: PlanData;
  isPaying: string | null;
  features: string[];
  vehicleCategory: string;
  onCheckout: (plan: PlanData, vehicleCategory: string) => void;
  onAddToCart: (plan: PlanData, vehicleCategory: string) => void;
};
