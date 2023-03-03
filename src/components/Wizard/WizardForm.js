import {
  Box,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  ConditionalWall,
  ScreenRangeContainer,
} from "./../FilterWall/ConditionalWall";
import Page from "src/components/Page";
import { GridContainer, GridItem } from "src/components/Grid/Grid";
export function WizardForm({ children, title = "", page = 0 }) {
  const [activePage, setPage] = useState(page);
  let show = Array.isArray(children);
  if (!show) {
    children = [children];
  }
  show = show ? children[0].type.name === "WizardPage" : false;
  const labels = [];
  const values = children.map((item, key) => {
    labels.push(
      <Step key={key}>
        <StepLabel>{item.props.title}</StepLabel>
      </Step>,
    );
    return React.cloneElement(item, { key, active: activePage === key });
  });
  useEffect(() => {
    setPage(page);
  }, [page]);
  return (
    <Page title={title}>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center">
        <Container maxWidth="md">
          <Typography variant="h1">{title}</Typography>
          <ConditionalWall
            condition={true}
            or={"Los componentes hijos deberian de ser tipo WizardPage"}>
            <GridContainer>
              <ScreenRangeContainer min={600}>
                <GridItem xs={4}>
                  <Stepper orientation="vertical" activeStep={activePage}>
                    {labels}
                  </Stepper>
                </GridItem>
              </ScreenRangeContainer>

              <GridItem
                xs={12}
                s={8}
                style={{
                  padding: "15px",
                }}>
                {values}
              </GridItem>
            </GridContainer>
          </ConditionalWall>
        </Container>
      </Box>
    </Page>
  );
}
export function WizardPage({ children, title, active }) {
  return (
    <ConditionalWall condition={active}>
      <Typography variant="h2" style={{ marginBottom: "2rem" }}>
        {title}
      </Typography>
      {children}
    </ConditionalWall>
  );
}
