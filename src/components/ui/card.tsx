import * as React from "react";
import { cn } from "../../utils/cn";

/* =========================
   Card Root
========================= */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-white shadow-sm transition hover:shadow-md",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

/* =========================
   Card Header
========================= */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 border-b", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

/* =========================
   Card Title
========================= */
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

/* =========================
   Card Description
========================= */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

/* =========================
   Card Content
========================= */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 text-sm", className)} {...props} />
));
CardContent.displayName = "CardContent";

/* =========================
   Card Footer
========================= */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-4 border-t flex items-center justify-end gap-2",
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
