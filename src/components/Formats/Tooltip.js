
import "./scss/tooltip.scss";
import React, { useState } from "react";

export function Tooltip ({ message, children, className, ...rest }) {
  const [show, toggle] = useState(0);
  return (
    <span
      className="contentTooltip"
      onMouseEnter={() => {
        toggle(1);
      }}
      onMouseLeave={() => {
        toggle(0);
      }}
    >
      {children}
      {show ? (
        <div className={`tooltip ${className}`} {...rest}>
          {message}
        </div>
      ) : (
        ""
      )}
    </span>
  );
}
