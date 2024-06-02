import {
  Card,
  List,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { optionalFn } from "../../core/helpers";
import {
  ConditionalWall,
  ScreenRangeContainer
} from "../FilterWall/ConditionalWall";
import Scrollbar from '../scrollbar/Scrollbar';

function TableHeader ({ values, onClick }) {

  const titles = Object.keys(values).map((key) => {
    const value = values[key];
    const title = typeof value === "string" ? value : value.title;
    return (
      <TableTitle
        title={title}
        key={key}
        onClick={(dir) => {
          optionalFn(onClick)(dir, value);
        }}
      />
    );
  });

  return (
    <TableHead>
      <TableRow>{titles}</TableRow>
    </TableHead>
  );
}
function TableTitle ({ title, onClick, sortable = false }) {
  const [direction, setDir] = useState("down");
  return (
    <TableCell
      style={{
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={() => {
        if (!sortable) {
          return false;
        }
        const dir = direction === "down" ? "up" : "down";
        setDir(dir);
        return optionalFn(onClick)(direction === "down" ? "desc" : "asc");
      }}>
      {title}{" "}
      <ConditionalWall condition={Boolean(sortable)}>
        d
      </ConditionalWall>
    </TableCell>
  );
}
function TableContainer ({ children, titles, pageComponent, hook }) {
  const setDir = hook;
  return (
    <Card>
      <Scrollbar>
        <Table>
          <TableHeader
            values={titles}
            onClick={(dir, key) => {
              setDir([key, dir]);
            }}
          />
          <TableBody>{children}</TableBody>
        </Table>
        {pageComponent}
      </Scrollbar>
    </Card>
  );
}

/**
 *
 * @param {
 *  pageComponent: React.Component,
 * setDir: string,
 * titles: Array,
 * content: Array,
 * onClick: Function,
 * format: Function,
 * } props 
 */
export function CustomTable ({
  pageComponent,
  setDir,
  titles,
  content = [],
  onClick,
  format,
}) {

  return (<>
    <ScreenRangeContainer min={0} max={600}>
      <ResponsiveList titles={titles} content={content} onClick={onClick} format={format} />
    </ScreenRangeContainer>
    <ScreenRangeContainer min={601} max={Infinity}>
      <TableContainer hook={setDir} titles={titles} pageComponent={pageComponent}>
        {content.map((item, key) => [
          <TableRow
            hover
            key={`k-${key}`}
            onClick={(ev) => {
              ev.stopPropagation();
              optionalFn(onClick)(item);
            }}>
            {format(item).map((value, index) => (
              <TableCell key={index} > {value}</TableCell>
            ))}
          </TableRow>,
        ])
        }
      </TableContainer ></ScreenRangeContainer>
  </>

  );
}



export function ResponsiveList ({ titles, content = [], onClick, format }) {
  return <>
    {content.map((item, key) => (
      <Card
        sx={
          {
            marginBottom: '1rem',
          }
        }
        key={`k-${key}`}
        onClick={(ev) => {
          ev.stopPropagation();
          optionalFn(onClick)(item);
        }}>
        <List primary='title'>
          {format(item).map((value, index) => (
            <ResponsiveListItem title={titles[index]} key={index}>{value}</ResponsiveListItem>
          ))}
        </List>
      </Card>
    ))}
  </>
}

export function ResponsiveListItem ({ title, children }) {
  return <ListItemText sx={{
    padding: '0.5rem',
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.1)',
    borderRadius: '4px'
  }}
    primary={title} secondary={children} />
}