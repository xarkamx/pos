import {
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useCState } from '../../hooks/useHooks';
import { optionalFn } from "../../core/helpers";
import {
  ConditionalWall,
  ScreenRangeContainer
} from "../FilterWall/ConditionalWall";
import Scrollbar from '../scrollbar/Scrollbar';

export function AsyncTable ({
  filler,
  titles = {},
  needed = [],
  search = "",
  format,
  onRowClick,
  onLoad,
}) {
  const [content, setContent] = useState([]);
  const [dir, setDir] = useState(null);
  const [pageData, setPage] = useCState({
    page: 0,
    limit: 10,
    count: 0,
    loading: 0,
  });
  const loadContent = () => {
    const order = dir ? { orderBy: dir[0], orderType: dir[1] } : {};
    setPage({ loading: 1 });
    filler({
      perPage: pageData.limit,
      ...order,
      needed,
      search,
      page: pageData.page + 1,
    }).then((response) => {
      if (response.meta) {
        setPage({ count: response.meta.total, loading: 0 });
      }
      setContent(response.data);
      optionalFn(onLoad)(response.data);
    });
  };
  useEffect(loadContent, [search, dir, pageData.page, pageData.limit]);
  const pageComponent = (
    <ConditionalWall condition={Boolean(pageData.count)}>
      <TablePagination
        component="div"
        count={pageData.count}
        onChangePage={(page, newPage) => {
          setPage({ page: newPage });
        }}
        onChangeRowsPerPage={(ev) => {
          setPage({ limit: ev.target.value });
        }}
        page={pageData.page}
        rowsPerPage={pageData.limit}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage={pageData.loading ? "Cargando..." : "Filas por pagina"}
      />
    </ConditionalWall>
  );

  return (
    <>
      <ScreenRangeContainer max={750}>
        <ResponsiveList
          setDir={setDir}
          titles={titles}
          pageComponent={pageComponent}
          content={content}
          format={format}
          onClick={onRowClick}
        />
      </ScreenRangeContainer>
      <ScreenRangeContainer min={751}>
        <CustomTable
          setDir={setDir}
          titles={titles}
          pageComponent={pageComponent}
          content={content}
          format={format}
          onClick={onRowClick}
        />
      </ScreenRangeContainer>
    </>
  );
}
export function SimpleTable ({ titles, format, filler }) {
  return <TableContainer titles={titles} />;
}
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
          key={key}
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
function ResponsiveList ({ pageComponent, titles, content, onClick, format }) {
  return (
    <div className="responsiveTable">
      {content.map((item, key) => (
        <List key={`k-${key}`} className="singularList">
          {format(item).map((value, index) => {
            let title = Object.values(titles)[index];
            title = typeof title === "string" ? title : title.title;
            return (
              <ConditionalWall key={`c-${key}`} condition={Boolean(value)}>
                <ListItem
                  onClick={() => {
                    optionalFn(onClick)(item);
                  }}>
                  <ListItemText
                    primary={title}
                    secondary={value} />
                </ListItem>
                <Divider />
              </ConditionalWall>
            );
          })}
        </List>
      ))}
      <ListItem>{pageComponent}</ListItem>
    </div>
  );
}
