import { Backdrop } from "@material-ui/core";
import React, { useState } from "react";
import { ConditionalWall } from "../FilterWall/ConditionalWall";
export function ImageBackdrop({ src, title, children }) {
  const [open, toggle] = useState(0);
  return (
    <>
      <div
        onClick={() => {
          toggle(1);
        }}>
        {children}
      </div>
      <Backdrop
        open={Boolean(open)}
        style={{ zIndex: 9999, overflow: "auto" }}
        onClick={() => {
          toggle(0);
        }}>
        <ConditionalWall condition={Boolean(open)}>
          <div>
            <img
              src={src}
              style={{ height: "600px", maxHeight: "80vh" }}
              alt={title}
            />
          </div>
        </ConditionalWall>
      </Backdrop>
    </>
  );
}
