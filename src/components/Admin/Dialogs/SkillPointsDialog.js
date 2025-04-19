import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import CloseIconButton from "../../Buttons/CloseIconButton";
import { ErrAlert } from "../../AlertFormats";

const SkillPointsDialog = ({ open, onClose, skills, skillPoints, onSkillChange, onReset }) => {
  const [errorMsg, setErrorMsg] = React.useState("");

  return (
    <>
      <ErrAlert
        open={Boolean(errorMsg)}
        onClose={() => setErrorMsg("")}
        message={errorMsg}
      />
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "1.2rem",
            mb: 1,
          }}
        >
          Earnable Skill Points
        </DialogTitle>
        <CloseIconButton onClick={onClose} />
        <DialogContent>
          {errorMsg && <ErrAlert>{errorMsg}</ErrAlert>}
          <Grid container spacing={2} pt={0.4}>
            {skills.map((skill) => (
              <Grid item xs={12} key={skill}>
                <Grid container alignItems="center">
                  <Grid item xs={9}>
                    <Typography variant="subtitle1">{skill}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={skillPoints[skill]}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedSkillPoints = { ...skillPoints, [skill]: newValue };
                          const updatedNonZeroSkills = Object.values(updatedSkillPoints).filter((val) => val > 0).length;

                          if (updatedNonZeroSkills > 3) {
                            setErrorMsg("You can only select up to 3 skill points.");
                            return;
                          }

                          setErrorMsg("");
                          onSkillChange(skill)(e);
                        }}

                        sx={{ fontSize: "14px" }}
                      >
                        {[...Array(11).keys()].map((val) => (
                          <MenuItem key={val} value={val} sx={{ fontSize: "14px" }}>
                            {val}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: "#f44336", "&:hover": { backgroundColor: "#ffebee" } }}
            onClick={() => {
              setErrorMsg("");
              onReset();
            }}
          >
            Reset
          </Button>
          <Button onClick={onClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SkillPointsDialog;