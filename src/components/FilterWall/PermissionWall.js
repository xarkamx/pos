import React, { Component } from "react";
import { LoginManager } from "./../../utils/LoginManager";
export class PermissionWall extends Component {
  handlePermission() {
    let { permission, onPermissionPass } = this.props.permission;
    const login = new LoginManager();
    const passed = login.hasPermission(permission);
    if (passed && typeof onPermissionPass === "function") {
      onPermissionPass(permission);
    }
    return passed;
  }
  render() {
    const { permission, children } = this.props;
    const login = new LoginManager();
    return (
      <React.Fragment>
        {login.hasPermission(permission) ? children : ""}
      </React.Fragment>
    );
  }
}
