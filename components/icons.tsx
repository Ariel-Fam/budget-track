import * as React from "react";
import {
  ShoppingBag,
  Bolt,
  Bus,
  Clapperboard,
  Home,
  CreditCard,
  Flame,
  Wallet,
  PiggyBank,
  Plane,
  LineChart,
  Banknote,
  Leaf,
  Coins,
  Trophy,
  Target,
  Flag,
  Rocket,
  Gift,
  Star,
  Gem,
} from "lucide-react";

const keyToIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  "shopping-bag": ShoppingBag,
  bolt: Bolt,
  bus: Bus,
  clapperboard: Clapperboard,
  home: Home,
  "credit-card": CreditCard,
  flame: Flame,
  wallet: Wallet,
  "piggy-bank": PiggyBank,
  plane: Plane,
  "line-chart": LineChart,
  "chart-line": LineChart,
  banknote: Banknote,
  maple: Leaf,
  trophy: Trophy,
  target: Target,
  flag: Flag,
  rocket: Rocket,
  gift: Gift,
  star: Star,
  gem: Gem,
};

export function RecordIcon({ iconKey, className }: { iconKey?: string | null; className?: string }) {
  const Comp = (iconKey && keyToIcon[iconKey]) || Coins;
  return <Comp className={className} aria-hidden />;
}


