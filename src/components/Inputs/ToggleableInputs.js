import React, { useState, useEffect } from "react";
import { GridContainer, GridItem } from "./../Grid/Grid";
import { FaIcon } from "src/components/Icons/FontIcon";
import { Button, List, ListItem, Typography } from "@material-ui/core";
import { optionalFn } from "src/core/helpers";
import { SimpleInput } from "./SimpleInput";
import { ConditionalWall } from "../FilterWall/ConditionalWall";
import { LoginManager } from "./../../utils/LoginManager";
import { useCState } from "./../../utils/hooks/simpleHooks";
import "./scss/inputs.scss";
export function ToggleableInput({
  onSave,
  title,
  defaultValue,
  name,
  toggleable = 1,
}) {
  const [editable, toggle] = useState(0);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return (
    <GridContainer style={{ width: "100%" }}>
      <ConditionalWall
        condition={Boolean(editable)}
        or={
          <>
            <GridItem>
              <Typography variant="h5">{title}</Typography>
            </GridItem>
            <GridItem xs={10} className="smartList">
              {value}
            </GridItem>
            <ConditionalWall condition={toggleable}>
              <GridItem xs={2}>
                <FaIcon
                  icon="edit"
                  onClick={() => {
                    toggle(Boolean(toggleable));
                  }}
                />
              </GridItem>
            </ConditionalWall>
          </>
        }>
        <GridItem xs={8}>
          <SimpleInput
            title={title}
            value={value}
            name={name}
            onChange={({ target }) => {
              setValue(target.value);
            }}
          />
        </GridItem>
        <GridItem
          xs={2}
          style={{
            display: "flex",
            justifyContent: "center",
          }}>
          <Button
            onClick={() => {
              optionalFn(onSave)(value);
              toggle(0);
            }}>
            <FaIcon icon="save" />
          </Button>
        </GridItem>
        <GridItem
          xs={2}
          style={{
            display: "flex",
            justifyContent: "center",
          }}>
          <Button
            onClick={() => {
              toggle(0);
            }}>
            <FaIcon icon="times" />
          </Button>
        </GridItem>
      </ConditionalWall>
    </GridContainer>
  );
}
export function SmartList({ model, controller, values, style, className }) {
  const [errors, setErrors] = useCState({});
  model.setValues(values);
  const inputs = [];
  const items = model.getValues();
  const lm = new LoginManager();
  const validateContent = () => {
    const invalid = ["olData", "0000", "noData", "XAXX010101000"];
    for (let key in items) {
      const item = items[key];
      if (!item.validation || !item.value) {
        continue;
      }
      if (invalid.includes(item.value)) {
        setErrors({ [key]: item.value });
      }
      item.validation.validate(item.value).catch((err) => {
        setErrors({ [key]: item.value });
      });
    }
  };
  useEffect(validateContent, [values]);
  for (let key in items) {
    const item = items[key];
    inputs.push(
      <ListItem key={key} className="smartList">
        <ToggleableInput
          toggleable={lm.hasPermission([1]) || Boolean(errors[key])}
          onSave={(value) => {
            controller.put(values.id, { [key]: value });
          }}
          title={item.title}
          defaultValue={item.value}
        />
      </ListItem>,
    );
  }
  return (
    <List style={style} className={className}>
      {inputs}
    </List>
  );
}
