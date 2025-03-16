import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export const CenterSection: React.FC<ContainerProps> = ({
  children,
  className = "",
}) => {
  return <section className={cn("mx-auto  max-w-7xl", className)}>{children}</section>;
};
