import React from "react";
import { CSSTransition } from "react-transition-group";
import "./scss/blocks.scss";
/* eslint eqeqeq: 0*/
export function SplashScreen({ open, children, background }) {
  return (
    <CSSTransition
      timeout={300}
      classNames="splashScreen"
      unmountOnExit
      in={open == true}>
      <div
        className="splashScreen"
        style={{
          background: `url(${background}) white`,
          backgroundSize: "auto 100%",
          backgroundPosition: "center",

          backgroundAttachment: "fixed",
          backgroundBlendMode: "lighten",
        }}>
        <div className="content">
          <h2>{children}</h2>
        </div>
      </div>
    </CSSTransition>
  );
}
