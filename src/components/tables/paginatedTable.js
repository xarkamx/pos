import { TablePagination } from '@mui/material';
import { useState } from 'react';
import { CustomTable } from './Table';

export function PaginatedTable ({ items = [], format, titles }) {
  const itemsCount = items.length;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  return <CustomTable
    pageComponent={
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={itemsCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(ev, pageNumber) => {
          setPage(pageNumber);
        }}
        onRowsPerPageChange={(ev) => {
          setRowsPerPage(ev.target.value);
        }}
      />
    }
    titles={titles}
    content={items}
    format={format}
  />
}