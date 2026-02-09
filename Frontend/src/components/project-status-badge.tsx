import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProjectStatusBadgeProps = {
  status: ProjectStatus;
  className?: string;
};

export function ProjectStatusBadge({
  status,
  className,
}: ProjectStatusBadgeProps) {
  const statusStyles: Record<ProjectStatus, string> = {
    "Pending Approval": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800",
    "In Development": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
    Approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
    Finished: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    "Rejected with feedback": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800",
    Draft: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800",
  };

  return (
    <Badge
      variant="outline"
      className={cn(statusStyles[status], "font-medium", className)}
    >
      {status}
    </Badge>
  );
}
