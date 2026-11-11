import {
  Boxes,
  Briefcase,
  ChartColumn,
  Code,
  CodeXml,
  Cpu,
  Info,
  Laptop,
  Layers,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '../data/career';

// `bar-chart-3` foi renomeado para `chart-column` no lucide; é o mesmo ícone.
export const icons: Record<IconName, LucideIcon> = {
  code: Code,
  boxes: Boxes,
  briefcase: Briefcase,
  laptop: Laptop,
  'bar-chart-3': ChartColumn,
  'code-xml': CodeXml,
  layers: Layers,
  cpu: Cpu,
  users: Users,
  info: Info,
};
