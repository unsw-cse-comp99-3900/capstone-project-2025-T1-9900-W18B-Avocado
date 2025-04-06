import { Button } from "@mui/material";

export const SubmitButton = ({ onClick, children = "Submit" }) => (
  <Button
    type="submit"
    variant="contained"
    onClick={onClick}
    sx={{
      backgroundColor: "#000",
      color: "#fff",
      fontWeight: "bold",
      borderRadius: "8px",
      minWidth: "120px",
      height: "48px",
      "&:hover": { backgroundColor: "#333" },
    }}
  >
    {children}
  </Button>
);

export const ResetButton = ({ onClick, children = "Reset" }) => (
  <Button
    variant="outlined"
    onClick={onClick}
    sx={{
      backgroundColor: "white",
      color: "#f44336",
      fontWeight: "bold",
      borderRadius: "8px",
      minWidth: "120px",
      height: "48px",
      border: "2.5px solid #ef9a9a",
      "&:hover": { backgroundColor: "#ef9a9a" },
    }}
  >
    {children}
  </Button>
);
