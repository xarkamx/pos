import { Modal } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { PanelContainer } from "../Containers/PanelContainer";
import { SimpleInput } from "./SimpleInput";

export function ModalInput({ children, ...rest }) {
  const [open, toggle] = useState(0);
  return (
    <>
      <div
        onClick={() => {
          toggle(1);
        }}>
        {children}
      </div>
      <Modal
        open={Boolean(open)}
        onClose={() => {
          toggle(0);
        }}>
        <PanelContainer maxWidth="xs">
          <SimpleInput {...rest} />
        </PanelContainer>
      </Modal>
    </>
  );
}
