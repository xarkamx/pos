import React, { useState } from "react";

import "./scss/tooltip.scss";
export function Tooltip({ message, children, className, ...rest }) {
  const [show, toggle] = useState(0);
  return (
    <span
      className="contentTooltip"
      onMouseEnter={(ev) => {
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
