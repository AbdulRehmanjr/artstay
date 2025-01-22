import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export const Center: React.FC<ContainerProps> = ({
  children,
  className = "",
}) => {
  return <div className={cn("mx-auto  max-w-7xl", className)}>{children}</div>;
};
