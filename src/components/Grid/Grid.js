import React, { useContext, useState, useEffect } from "react";
import { between } from "./../../core/helpers";
const windowSizeContext = React.createContext();
export function GridContainer({
  children,
  className,
  columns = 12,
  style,
  ...rest
}) {
  const [sizes, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });
  useEffect(() => {
    window.addEventListener("resize", setResize);
    return () => {
      window.removeEventListener("resize", setResize);
    };
  }, []);
  return (
    <windowSizeContext.Provider value={sizes}>
      <div
        className={`gridContainer ${className || ""}`}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns} ,${100 / columns}%)`,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </windowSizeContext.Provider>
  );

  function setResize() {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
  }
}
export function GridItem({
  children,
  xs = 12,
  s,
  md,
  lg,
  xl,
  style,
  className,
  ...rest
}) {
  const screen = useContext(windowSizeContext);
  let size = _setSpanSize({ xs, s, md, lg, xl }, screen.width);
  return (
    <div
      className={`gridItem ${className || ""} ${size.className}`}
      style={{
        gridColumn: `span ${size.rt}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
function _setSpanSize({ xs, s, md, lg, xl }, screenSize) {
  let sizes;
  ({ sizes, s, md, lg, xl } = _formatSizes(s, xs, md, lg, xl));
  for (let pos of sizes) {
    if (between(screenSize, pos.range[0], pos.range[1])) {
      return pos;
    }
  }
}
function _formatSizes(s, xs, md, lg, xl) {
  s = s || xs;
  md = md || s;
  lg = lg || md;
  xl = xl || md;
  let sizes = [
    { range: [0, 600], rt: xs, className: "xs" },
    { range: [600, 1200], rt: s, className: "s" },
    { range: [1200, 1920], rt: md, className: "md" },
    { range: [1920, 2560], rt: lg, className: "lg" },
    { range: [2560, Infinity], rt: xl, className: "xl" },
  ];
  return { sizes, s, md, lg, xl };
}
