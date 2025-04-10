import React from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CloseIconButton = ({ onClick, sx = {} }) => {
  return (
    <IconButton
      aria-label="close"
      onClick={onClick}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500],
        ...sx,
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default CloseIconButton;