import React from "react";
import { TableCell, Tooltip } from "@mui/material";

function FixedCell({
  children,
  width = "20%",       // 使用百分比宽度
  minWidth = 100,      // 可控最小宽度
  align = "left",
  tooltip = false,
  fontWeight,
  sx = {},
}) {
  const cellStyle = {
    width,
    minWidth: `${minWidth}px`,
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