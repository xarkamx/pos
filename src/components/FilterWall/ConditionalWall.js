import React, { useEffect, useState } from "react";
import { between } from "../../core/helpers";
/**
 * @description carga tag si la condicion se cumple.
 * @param {conditional,children} param0
 */
export function ConditionalWall ({ condition, or, children }) {
  if (!condition) {
    return or || null;
  }
  return <>{children}</>;
}

export function ScreenRangeContainer ({ min = 0, max = Infinity, children }) {
  const [size, setSize] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => setSize(window.innerWidth));
  }, []);
  if (between(size, min, max)) {
    return <>{children}</>;
  }
  return <></>;
}

