import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
} from "@material-ui/core";
import React from "react";
import { GridContainer, GridItem } from "../Grid/Grid";

export function PanelContainer({
  title,
  subtitle,
  children,
  maxWidth = "lg",
  style,
  className,
}) {
  let grided = false;
  if (!Array.isArray(children)) {
    children = [children];
  }

  if (children[0].type.name !== "GridItem") {
    grided = true;
  }
  return (
    <Container
      maxWidth={maxWidth}
      style={{ marginTop: "10px", ...style }}
      className={className}>
      <Card>
        <CardHeader subheader={subtitle} title={title} />
        <Divider />
        <CardContent>
          <GridContainer>
            {grided ? <GridItem>{children}</GridItem> : children}
          </GridContainer>
        </CardContent>
      </Card>
    </Container>
  );
}
