import React from "react";
import { numberToMoney } from "../../core/helpers";

export function Money ({ number, ...rest }) {
  return <span {...rest}>{numberToMoney(number)}</span>;
}
export function FixedNumber ({ number, size = 2, ...rest }) {
  return (
    <span {...rest}>{!Number.isNaN(number) ? number.toFixed(size) : "0.00"}</span>
  );
}
export function Percent ({ number, style }) {
  if (number === -Infinity) {
    number = -1.0;
  }
  let percent = (number * 100).toFixed(2);
  const sign = Math.sign(percent);
  percent = Math.abs(percent);
  return (
    <span
      className="percent"
      style={{
        color: sign === 1 ? "green" : "red",
        marginRight: "5px",
        ...style,
      }}>
      $ {percent}%
    </span>
  );
}
