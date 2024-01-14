import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";

export const DataTable = (props: any) => {
  const { columns, data, loading } = props;
  return (
    <div style={{ height: "600px", width: "100%" }}>
      <DataGrid
        style={{ padding: 10, height: "100%" }}
        disableSelectionOnClick={true}
        rows={data}
        columns={columns}
        pageSize={8}
        components={{ Toolbar: GridToolbar }}
        loading={loading}
      />
    </div>
  );
};
