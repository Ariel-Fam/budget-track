"use client";

import * as React from "react";
import { gsap } from "gsap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AnimatedAlertProps = React.PropsWithChildren<
  {
    className?: string;
    icon?: React.ReactNode;
    title: string;
    description?: React.ReactNode;
  }
>;

export function AnimatedAlert({ className, icon, title, description, children }: AnimatedAlertProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { x: -24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Alert ref={containerRef as any} className={className}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
      {children}
    </Alert>
  );
}

export default AnimatedAlert;


