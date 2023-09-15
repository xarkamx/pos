import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { optionalFn } from "../../core/helpers";
import {
  ConditionalWall
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

  return (
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
    </TableContainer >
  );
}

