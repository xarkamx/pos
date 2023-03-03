import React, { Component } from "react";
import { CustomModal } from "./CustomModal";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import "./modal.scss";
import { FontIcon } from "../Icons/FontIcon";
import IconButton from "@material-ui/core/IconButton";
export class Prompt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open,
            value: ""
        };
    }

    handleClose = () => {
        const { onEvent } = this.props;
        if (typeof onEvent === "function") {
            onEvent(false);
        }
        this.setState({ open: false });
        return false;
    };
    handleSubmit = () => {
        const { onEvent } = this.props;
        if (typeof onEvent === "function") {
            onEvent(this.state.value || false);
        }
        this.setState({ open: false });
    };
    _handleKeyPress = e => {
        if (e.key === "Enter") {
            this.handleSubmit();
        }
    };
    render = () => (
        <CustomModal
            open={this.state.open}
            style={{ backgroundColor: "white" }}
            disableCloseButton={true}
            onClose={this.handleClose}
        >
            <span>{this.state.open}</span>
            <div className={"prompt"}>
                <div>{this.props.legend}</div>
                <CustomInput
                    onChange={ev => {
                        const value = ev.target.value;
                        this.setState({ value });
                    }}
                    labelText={this.props.label}
                    value={this.state.value}
                    className="promptInput"
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        onKeyPress: this._handleKeyPress
                    }}
                />
                <div className="buttons">
                    <IconButton color="primary" onClick={this.handleSubmit}>
                        <FontIcon iconName="fa-check" />
                    </IconButton>
                    <IconButton color="secondary" onClick={this.handleClose}>
                        <FontIcon iconName="fa-times" />
                    </IconButton>
                </div>
            </div>
        </CustomModal>
    );
}
