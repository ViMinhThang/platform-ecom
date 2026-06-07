// Reusable star rating component

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0-5, supports decimals
  size?: "sm" | "md" | "lg";
  showRating?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  size = "md",
  showRating = false,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;

    return (
      <span
        key={"star-" + index}
        className="relative inline-block"
        style={{ width: "1em", height: "1em" }}
      >
        {/* Empty star background */}
        <span className="absolute inset-0 text-zinc-300">☆</span>
        {/* Filled star overlay */}
        <span
          className="absolute inset-0 overflow-hidden text-primary"
          style={{ width: `${fillPercentage}%` }}
        >
          ★
        </span>
      </span>
    );
  });

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div
        className={cn("flex", sizeClasses[size])}
        aria-label={`Đánh giá: ${rating} trên 5 sao`}
      >
        {stars}
      </div>
      {showRating && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
