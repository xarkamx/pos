import React, { useRef, useState } from "react";
import { LadderScroll } from "../Scroller/LadderScroll";
import VisibilitySensor from "react-visibility-sensor";
import { optionalFn } from "../../core/helpers";
import "./scss/carrousel.scss";
export function Carrousel ({ children, autoRun = true }) {
  const [currentPage, setPage] = useState(0);
  const ref = useRef();
  const [scrolledDistance, setDistance] = useState(0);
  if (!Array.isArray(children)) {
    children = [children];
  }
  let totalPages = children.length;
  let totalSize = totalPages * 100;
  return (
    <>
      <LadderScroll
        style={{ width: "100%", overflow: "hidden" }}
        onScrollEnds={(response, container) => {
          setDistance(response.distanceX + scrolledDistance);
          let current = container.current;
          let scrolled = scrolledDistance;

          let position = Math.abs(
            (scrolled || response.distanceX) / current.clientWidth
          );
          let page = response.distanceX <= 0 ? position + 1 : position - 1;
          if (page >= totalPages) {
            page = 2;
          }
          if (Math.abs(response.distanceX) >= 200) {
            xSlide(Math.floor(page) * current.clientWidth * -1, true);
            setDistance(Math.floor(page) * current.clientWidth * -1);
          } else {
            xSlide(Math.floor(position) * current.clientWidth * -1, true);
            setDistance(Math.floor(position) * current.clientWidth * -1);
          }
        }}
        onScrolling={(data, container) => {
          let x = scrolledDistance + data.distanceX;
          const min = 0;
          const max = data.size.width * (totalPages - 1) * -1;
          if (container.current)
            if (x > min) {
              x = 0;
            }
          if (x < max) {
            x = max;
          }
          xSlide(x);
        }}
      >
        <div
          className="car-container"
          ref={ref}
          style={{ width: `${totalSize}%` }}
        >
          {children.map((item, key) => (
            <SlidePage
              key={key}
              id={key}
              item={item}
              onVisible={(element) => { }}
              style={{ width: `${100 / totalPages}%` }}
            />
          ))}
        </div>
      </LadderScroll>
      <DotMarker
        totalPages={totalPages}
        currentPage={currentPage}
        onClick={(page) => {
          xSlide(((page * ref.current.clientWidth) / totalPages) * -1, true);
          setPage(page);
        }}
      />
    </>
  );

  function xSlide (x, animate = false) {
    const carrousel = document.querySelector(".car-container");
    carrousel.style.transition = animate ? "all 200ms ease-in-out" : "none";
    carrousel.style.transform = `matrix(1, 0, 0, 1, ${x}, 0)`;
  }
}
function SlidePage ({ id, item, onVisible, style }) {
  let page = useRef();
  let code = `slide-page-${id}`;
  return (
    <VisibilitySensor
      partialVisibility
      offset={{ left: 100, right: 100 }}
      onChange={(visible) => {
        if (visible)
          optionalFn(onVisible)(page.current);
      }}
    >
      <div
        ref={page}
        id={code}
        className="slide"
        style={{
          display: "inline-block",
          ...style,
        }}
      >
        {item}
      </div>
    </VisibilitySensor>
  );
}
function DotMarker ({ totalPages, relativePercent, currentPage, onClick }) {
  let dots = [];
  for (let index = 0; index < totalPages; index++) {
    let active = currentPage === index ? "active" : "";
    dots.push(
      <div
        className={`dotSpace`}
        key={`dot-${index}`}
        onClick={() => {
          optionalFn(onClick)(index);
        }}
      >
        <div className={`dot ${active}`} />
      </div>
    );
  }
  return <div className="dotContainer">{dots}</div>;
}
