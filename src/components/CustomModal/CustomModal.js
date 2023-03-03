import React, { Component } from "react";
import { Modal } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { Close } from "@material-ui/icons";
import "./modal.scss";

/**
 * CustomModal permite abrir y cerrar un modal personalizado.
 * @props boolean open abre o cierra el modal
 * @props function onClose
 * @props component children
 */
export class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open || false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.state.open) {
      this.setState({ open: nextProps.open });
    }
  }
  /**
   * Dispara el evento al cerrar
   */
  handleClose = () => {
    let onClose = this.props.onClose;
    let open = false;
    if (typeof onClose === "function") {
      open = onClose() || open;
    }
    this.setState({ open });
  };
  render() {
    const { styles, disableCloseButton } = this.props;
    return (
      <Modal
        open={!this.state.open === false}
        onClose={this.handleClose}
        className="modalContainer"
      >
        <div className="modal" style={{ ...styles }}>
          {!disableCloseButton ? (
            <Fab
              size="small"
              color="secondary"
              className="closeModal"
              onClick={this.handleClose}
            >
              <Close />
            </Fab>
          ) : (
            ""
          )}

          {this.props.children}
        </div>
      </Modal>
    );
  }
}
