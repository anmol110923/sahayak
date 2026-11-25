import {
  Accessibility,
  Briefcase,
  Flame,
  GraduationCap,
  HandCoins,
  HeartPulse,
  House,
  Landmark,
  PiggyBank,
  ShieldCheck,
  Users,
  Utensils,
  Wheat,
  Wrench,
  Building2,
  Globe,
  Hospital,
  Mail,
  Monitor,
  School,
  type LucideIcon,
} from "lucide-react";
import type { Category, Channel } from "@/lib/core/types";

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  farming: Wheat,
  health: HeartPulse,
  pension: HandCoins,
  insurance: ShieldCheck,
  housing: House,
  education: GraduationCap,
  jobs: Wrench,
  business: Briefcase,
  women_child: Users,
  food: Utensils,
  disability: Accessibility,
  utilities: Flame,
  banking: PiggyBank,
};

export const CHANNEL_ICON: Record<Channel, LucideIcon> = {
  online: Globe,
  csc: Monitor,
  bank: Landmark,
  post_office: Mail,
  gram_panchayat: Building2,
  anganwadi: Users,
  health_centre: Hospital,
  school_college: School,
  district_office: Building2,
};

export function CategoryIcon({ category, size = 20 }: { category: Category; size?: number }) {
  const Icon = CATEGORY_ICON[category];
  return <Icon size={size} strokeWidth={1.8} aria-hidden />;
}
