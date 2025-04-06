import React from "react";
import { TableCell, Tooltip } from "@mui/material";

function FixedCell({
  children,
  width = 120,
  align = "left",
  tooltip = false,
  fontWeight,
  sx = {},
}) {
  const cellStyle = {
    width,
    maxWidth: width,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight,
    ...sx,
  };

  const cellContent = (
    <TableCell sx={cellStyle} align={align}>
      {children}
    </TableCell>
  );

  return tooltip ? (
    <Tooltip title={children} arrow>
      {cellContent}
    </Tooltip>
  ) : (
    cellContent
  );
}

export default FixedCell;