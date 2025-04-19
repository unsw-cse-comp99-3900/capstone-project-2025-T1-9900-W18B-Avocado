import React from "react";
import { AppBar, Toolbar, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const CommonHeader = () => {
  const linkSx = {
    color: "#fff",
    marginRight: 4,
    fontWeight: "bold",
    textDecoration: "none",
    "&:hover": {
      color: "#a8e847",
    },
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#235858" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <MuiLink component={RouterLink} to="/" sx={linkSx}>
          Home
        </MuiLink>
        <MuiLink component={RouterLink} to="/login" sx={linkSx}>
          Login
        </MuiLink>
        <MuiLink component={RouterLink} to="/register" sx={{ ...linkSx, marginRight: 0 }}>
          Register
        </MuiLink>
      </Toolbar>
    </AppBar>
  );
};

export default CommonHeader;