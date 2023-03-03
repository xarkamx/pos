import {
  Button,
  colors,
  FormHelperText,
  InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { GridContainer, GridItem } from "../Grid/Grid";
import { FaIcon } from "../Icons/FontIcon";
import { Helpers } from "./../../core/helpers";
import { optionalFn } from "src/core/helpers";
import { ConditionalWall } from "../FilterWall/ConditionalWall";
import { Autocomplete } from "@material-ui/lab";

export function SimpleInput({ error, msg, name, title, onChange, ...rest }) {
  return (
    <TextField
      error={error}
      fullWidth
      helperText={msg}
      label={title}
      margin="normal"
      name={name || title.toLowerCase().replace(/ /, "")}
      onChange={onChange}
      inputProps={{ step: "any" }}
      {...rest}
      variant="outlined"
    />
  );
}
export function SimpleButton({
  children,
  color = "primary",
  fullWidth = true,
  ...rest
}) {
  return (
    <Button
      color={color}
      fullWidth={fullWidth}
      size="large"
      type="submit"
      variant="contained"
      {...rest}>
      {children}
    </Button>
  );
}
export function SimpleFileInput({
  title,
  error,
  msg,
  name = "file",
  onChange,
  listStyle,
  ...rest
}) {
  const [files, setFiles] = useState([]);
  const event = () => {
    if (files.length > 0) optionalFn(onChange)(files);
  };
  useEffect(event, [files]);
  return (
    <GridContainer>
      <GridItem xs={12}>
        <label
          htmlFor={name}
          style={{
            cursor: "pointer",
            fontSize: "5em",
            background: "#eee",
            display: "block",
            borderRadius: "40px",
            textAlign: "center",
          }}>
          <Typography variant="h5">
            <FaIcon
              icon="upload"
              style={{ margin: "10px", color: "darkgray" }}
            />
            {title}
          </Typography>
        </label>
        <input
          {...rest}
          name={name}
          type="file"
          id={name}
          style={{ display: "none" }}
          onChange={({ target }) => {
            const files = target.files;
            setFiles([...files]);
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <List style={listStyle}>
          {files.map((file, key) => {
            return (
              <FileContainer
                key={key}
                file={file}
                onDelete={() => {
                  setFiles(files.filter((file, index) => key !== index));
                }}
              />
            );
          })}
        </List>
      </GridItem>
      <GridItem>
        <ConditionalWall condition={Boolean(error)}>
          <FormHelperText error>{msg || "Error"}</FormHelperText>
        </ConditionalWall>
      </GridItem>
    </GridContainer>
  );
}
export function SimpleSelector({ options, title, ...rest }) {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.title}
      style={{ width: "100%" }}
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          label={title}
          margin="normal"
          variant="outlined"
        />
      )}
    />
  );
}
export function SimpleSearchInput({ onChange }) {
  return (
    <SimpleInput
      title="Buscar..."
      onBlur={({ target }) => {
        optionalFn(onChange)(target.value);
      }}
      onKeyUp={(ev) => {
        if (ev.key === "Enter") {
          optionalFn(onChange)(ev.target.value);
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <FaIcon icon="search" />
          </InputAdornment>
        ),
      }}
    />
  );
}
function FileContainer({ file, onDelete }) {
  const [anchor, setAnchor] = useState(null);
  const [src, setSrc] = useState("");
  const helpers = new Helpers();
  const loadImage = () => {
    helpers.fileToImage(file).then(({ img }) => {
      //console.log(fi);
      setSrc(img.currentSrc);
    });
  };
  useEffect(loadImage, []);
  return (
    <ListItem>
      <ListItemText
        id={file.name}
        primary={file.name}
        onClick={(ev) => {
          if (!file.type.match(/image/)) {
            return false;
          }
          setAnchor(ev.currentTarget);
        }}
      />
      <Popover
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => {
          setAnchor(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <img src={src} style={{ height: "300px" }} alt={file.name} />
      </Popover>
      <ListItemSecondaryAction>
        <FaIcon
          icon="times"
          style={{ color: colors.red[700] }}
          onClick={onDelete}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}
export function SimplePacientInput({
  onChange,
  onTimeOut,
  timeOut = 1000,
  ...rest
}) {
  let timer = null;
  return (
    <SimpleInput
      onChange={(ev) => {
        clearTimeout(timer);
        optionalFn(onChange)(ev);
        timer = setTimeout(() => {
          optionalFn(onTimeOut)(ev);
        }, timeOut);
      }}
      {...rest}
    />
  );
}
