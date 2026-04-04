import {
  BookOpen,
  Braces,
  CircleDot,
  Cloud,
  Cpu,
  Database,
  FileCode,
  Globe,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Palette,
  Server,
  Shield,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react'

const MAP = {
  Cpu,
  Palette,
  Server,
  Sparkles,
  Globe,
  BookOpen,
  FileCode,
  LineChart,
  ShoppingBag,
  Shield,
  Braces,
  Zap,
  LayoutDashboard,
  MessageSquare,
  Database,
  Cloud,
}

export function ProjectStackIcon({ name, size = 18, className }) {
  const Cmp = MAP[name] || CircleDot
  return <Cmp size={size} className={className} strokeWidth={1.65} aria-hidden />
}
