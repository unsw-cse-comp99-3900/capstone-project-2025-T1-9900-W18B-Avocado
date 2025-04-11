import React from "react";
import { Box } from "@mui/material";

function HorizontalScrollBox({ children, minWidth = "950px", sx = {} }) {
  return (
    <Box
      sx={{
        overflowX: "auto",
        paddingBottom: 1,
        "&::-webkit-scrollbar": {
          height: 8,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: 9999,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.35)",
        },
        ...sx,
      }}
    >
      <Box sx={{ minWidth }}>{children}</Box>
    </Box>
  );
}

export default HorizontalScrollBox;
