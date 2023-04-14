import React, { useEffect, useState } from "react";

export function SvgButton ({ name, style, ...rest }) {
  return (
    <SVG
      className={name}
      src={`/static/ICONOS/Botones/SVG/${name}.svg`}
      style={{ minHeight: "20px", minWidth: "20px", ...style }}
      {...rest}
    />
  );
}
export function SVG ({ src, style, className = "", ...rest }) {
  const [inlineSvg, setSvg] = useState("");
  const [isMounted, setIsMounted] = useState(true);
  const loadSvg = () => {
    fetch(src).then((resp) => {
      resp.text().then((resp) => {
        if (isMounted) setSvg(resp);
      });
    });
    return () => setIsMounted(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadSvg, [src]);
  return (
    <span
      style={{ display: "block", ...style }}
      {...rest}
      className={`svg ${className}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: inlineSvg,
      }} />
  );
}
