import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" }, // Use the Figma Primary color
    secondary: { main: "#ff9800" }, // Use the Figma Secondary color
    background: { default: "#f4f4f4" }, // Page background
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Use Figma font (if available)
    h4: { fontSize: "28px", fontWeight: "bold" }, // Title
    body1: { fontSize: "16px" }, // Normal text
    button: { textTransform: "none", fontWeight: "bold" }, // Button style
  },
  shape: { borderRadius: 12 }, // Apply Figma-style rounded corners
});

export default theme;