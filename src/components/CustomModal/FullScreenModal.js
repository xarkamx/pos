import React from "react";
import "./modal.scss";
import { optionalFn } from "../../core/helpers";
/*eslint eqeqeq:0*/
export function FullScreenModal({ children, open, onClose, ...rest }) {
  if (open)
    return (
      <div
        className="fullscreenModal"
        {...rest}
        onClick={ev => {
          ev.stopPropagation();
          optionalFn(onClose)();
        }}
        onKeyUp={ev => {
          if (ev.keyCode == 27) {
            optionalFn(onClose)();
          }
        }}
      >
        {children}
      </div>
    );
  else {
    return <></>;
  }
}
