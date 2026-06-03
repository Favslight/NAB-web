import { AiTool, PlanTier, User } from '@/types';

const TOOL_PLAN_ACCESS: Record<PlanTier, PlanTier[]> = {
  ai_explorer: ['ai_explorer'],
  ai_builder: ['ai_builder'],
  ai_product_founder: ['ai_explorer', 'ai_builder', 'ai_product_founder'],
};

export function resolveToolPlan(user: User | null): PlanTier | null {
  if (!user || user.membership_status !== 'active') return null;

  return user.membership_plan_type ?? user.membership?.plan_type ?? null;
}

export function canAccessTool(userPlan: PlanTier | null, requiredPlan: PlanTier): boolean {
  if (!userPlan) return false;

  return TOOL_PLAN_ACCESS[userPlan].includes(requiredPlan);
}

export function applyToolAccess(tool: AiTool, userPlan: PlanTier | null): AiTool {
  const locked = Boolean(tool.locked) || !canAccessTool(userPlan, tool.required_plan);

  return {
    ...tool,
    locked,
    launchable: Boolean(tool.launchable && !locked),
  };
}
