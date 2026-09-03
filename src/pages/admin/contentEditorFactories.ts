import type {
  AwardCommittee,
  AwardTier,
  MilestoneItem,
  RegulationSection,
  ResearchFieldItem,
} from "../../data/contentData";

export const nextNumericId = (items: Array<{ id: number }>) =>
  items.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;

export const createResearchField = (
  fields: ResearchFieldItem[],
): ResearchFieldItem => ({
  id: nextNumericId(fields),
  icon: "code",
  title: "New research field",
  accordionItems: [],
  carouselItems: [],
});

export const createAwardTier = (tiers: AwardTier[]): AwardTier => ({
  id: nextNumericId(tiers),
  label: "New prize",
  amount: "0 VND",
  count: 1,
  icon: "medal",
  color: "text-white",
});

export const createAwardCommittee = (
  committees: AwardCommittee[],
): AwardCommittee => ({
  id: nextNumericId(committees),
  name: "New award committee",
  nameVi: "Hội đồng mới",
  color: "from-orange-500 to-amber-400",
  accentGradient: "from-orange-500/20 to-amber-400/10",
  borderColor: "border-orange-400/30",
  standardAwards: [createAwardTier([])],
  smallAwards: [],
});

export const createRegulation = (
  regulations: RegulationSection[],
): RegulationSection => ({
  id: nextNumericId(regulations),
  title: "New regulation",
  items: [],
});

export const createMilestone = (
  milestones: MilestoneItem[],
): MilestoneItem => ({
  id: nextNumericId(milestones),
  date: "Date to be announced",
  title: "New milestone",
});
