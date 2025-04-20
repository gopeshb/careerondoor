import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border px-6 py-5 shadow-sm transition-all flex flex-col gap-2",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        destructive: "bg-red-50 text-red-900 border-red-200",
        info: "bg-blue-50 text-blue-900 border-blue-200",
        success: "bg-green-50 text-green-900 border-green-200",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

function AlertTitle({
  className,
  icon,
  children,
  ...props
}: React.ComponentProps<"div"> & { icon?: React.ReactNode }) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "flex items-center gap-2 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
