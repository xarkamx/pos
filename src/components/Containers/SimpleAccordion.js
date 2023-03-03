import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { optionalFn } from "src/core/helpers";
import { FaIcon } from "../Icons/FontIcon";
import { ConditionalWall } from "./../FilterWall/ConditionalWall";
export function SimpleAccordion({ title, subtitle, children, open, onChange }) {
  const [expand, toggle] = useState(open);
  return (
    <Accordion
      expanded={Boolean(expand)}
      onChange={() => {
        optionalFn(onChange)(!expand);
        toggle(!expand);
      }}>
      <AccordionSummary
        expandIcon={<FaIcon icon="arrow-down" />}
        aria-controls="panel1bh-content"
        id="panel1bh-header">
        <Typography variant="h3">{title}</Typography>

        <Typography variant="overline">{subtitle}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ConditionalWall condition={expand}>
          <div style={{ width: "100%" }}>{children}</div>
        </ConditionalWall>
      </AccordionDetails>
    </Accordion>
  );
}
