import { List, ListItem, ListItemText } from "@material-ui/core";
import React, { useState, useEffect } from "react";
export function SmartList({ model }) {
  return (
    <List>
      <ListItem>
        <ListItemText primary="Photos" secondary="Jan 9, 2014" />
      </ListItem>
    </List>
  );
}
