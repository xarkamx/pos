import React, { Component } from "react";
import { ConditionalWall } from "./ConditionalWall";
export class WallSize extends Component {
  state = { currentSize: 0 };
  componentDidMount() {
    const container = this.refs.container;
    const currentSize = container.clientWidth;
    this.setState({ currentSize });
    window.addEventListener("resize", this.resizeHandler);
  }
  resizeHandler = () => {
    const currentSize = this.refs.container.clientWidth;
    this.setState({ currentSize });
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }
  render() {
    const { maxSize = Infinity, minSize = 0, children } = this.props;
    const { currentSize } = this.state;
    return (
      <div ref="container">
        <ConditionalWall
          condition={maxSize > currentSize && minSize < currentSize}
        >
          {children}
        </ConditionalWall>
      </div>
    );
  }
}
