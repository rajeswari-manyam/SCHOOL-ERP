import * as React from "react";
import { cn } from "../../utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, src, alt = "avatar", fallback, size = "md", ...props },
    ref,
  ) => {
    const [error, setError] = React.useState(false);

    const sizes = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-14 w-14 text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-200",
          sizes[size],
          className,
        )}
        {...props}
      >
        {src && !error ? (
          <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-medium text-gray-600">{fallback || "?"}</span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
