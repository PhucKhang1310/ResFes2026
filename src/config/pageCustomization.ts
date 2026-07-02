import type { CSSProperties } from "react";
import {
  FaChartLine,
  FaDatabase,
  FaFlask,
  FaGlobe,
  FaLanguage,
  FaLaptopCode,
  FaLeaf,
  FaMicrochip,
  FaPalette,
  FaRobot,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import {
  getSectionStyle,
  type EditableContent,
  type PageSectionKind,
  type PageSectionStyle,
  type ResearchIconKey,
} from "../data/contentData";

export const researchIconOptions: {
  value: ResearchIconKey;
  label: string;
  Icon: IconType;
}[] = [
  { value: "code", label: "Code", Icon: FaLaptopCode },
  { value: "chip", label: "Microchip", Icon: FaMicrochip },
  { value: "design", label: "Design", Icon: FaPalette },
  { value: "business", label: "Business", Icon: FaChartLine },
  { value: "language", label: "Language", Icon: FaLanguage },
  { value: "science", label: "Science", Icon: FaFlask },
  { value: "robot", label: "Robotics", Icon: FaRobot },
  { value: "database", label: "Data", Icon: FaDatabase },
  { value: "globe", label: "Global", Icon: FaGlobe },
  { value: "leaf", label: "Sustainability", Icon: FaLeaf },
];

export const researchIconMap = researchIconOptions.reduce(
  (icons, option) => ({
    ...icons,
    [option.value]: option.Icon,
  }),
  {} as Record<ResearchIconKey, IconType>,
);

export const getResearchIcon = (icon: ResearchIconKey): IconType =>
  researchIconMap[icon] ?? FaLaptopCode;

export const getContentSectionStyle = (
  content: EditableContent | null | undefined,
  sectionId: PageSectionKind,
): PageSectionStyle => getSectionStyle(content?.sectionStyles, sectionId);

export const sectionCssVars = (style: PageSectionStyle) =>
  ({
    "--section-bg": style.backgroundColor,
    "--section-text": style.textColor,
    "--section-accent": style.accentColor,
  }) as CSSProperties;
