"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

export function useCountUp(target: number, duration = 2, start = false) {
  const [value, setValue] = useState(0);
  const mv = useMotionValue(0);
  const started = useRef(false);

  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;
    const controls = animate(mv, target, {
      duration,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [start, target, duration, mv]);

  return value;
}

export function useInViewOnce(margin: string = "-80px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: margin as never });
  return { ref, inView };
}
