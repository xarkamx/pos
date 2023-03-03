import { Box, Button, Link } from "@material-ui/core";
import React from "react";
import { FaIcon } from "../Icons/FontIcon";
export function LinkButton({ href, children }) {
  return (
    <Box display="flex" justifyContent="flex-end" p={2}>
      <Link href={href}>
        <Button
          color="primary"
          endIcon={<FaIcon icon="plus" style={{ color: "white" }} />}
          size="small"
          variant="contained">
          {children}
        </Button>
      </Link>
    </Box>
  );
}
