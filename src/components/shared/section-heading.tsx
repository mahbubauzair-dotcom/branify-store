"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  size?: "default" | "lg";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  size = "default",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "font-display font-bold tracking-tight text-white",
          size === "lg" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("text-base sm:text-lg text-muted-foreground leading-relaxed", align === "center" && "max-w-2xl")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
