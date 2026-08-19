"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Button3DProps = ComponentProps<"button"> & {
  variant?: Variant;
  href?: string;
};

const variantClass: Record<Variant, string> = {
  primary: "btn-3d btn-3d-primary",
  secondary: "btn-3d btn-3d-secondary",
  ghost: "btn-3d btn-3d-ghost",
};

export function Button3D({
  variant = "primary",
  href,
  className,
  children,
  type = "button",
  ...props
}: Button3DProps) {
  const classes = cn(variantClass[variant], className);

  if (href) {
    return (
      <Link href={href as "/"} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
