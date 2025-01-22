import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
}) => {
  return <div className={cn("mx-4 lg:container", className)}>{children}</div>;
};
