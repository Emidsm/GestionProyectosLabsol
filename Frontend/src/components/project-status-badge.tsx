import { Badge } from "@/components/ui/badge";
import type { BackendProjectStatus } from "@/lib/api";
import type { ProjectStatus } from "@/lib/types";

type AnyStatus = ProjectStatus | BackendProjectStatus | string;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  // ── Backend (Prisma) ──────────────────────────────────────────
  borrador: {
    label: "Borrador",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  en_revision: {
    label: "En revisión",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  validado: {
    label: "En lista de espera",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  en_curso: {
    label: "En desarrollo",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  finalizado: {
    label: "Finalizado",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  rechazado: {
    label: "Rechazado",
    className: "bg-red-100 text-red-700 border-red-200",
  },

  // ── Mock legacy (por si alguna página aún los usa) ────────────
  Borrador: {
    label: "Borrador",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  "En revisión": {
    label: "En revisión",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  "En lista de espera": {
    label: "En lista de espera",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  "En desarrollo": {
    label: "En desarrollo",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  Finalizado: {
    label: "Finalizado",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  "Rechazado con retroalimentación": {
    label: "Rechazado",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

interface ProjectStatusBadgeProps {
  status: AnyStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}
