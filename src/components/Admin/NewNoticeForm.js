import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { SubmitButton, ResetButton } from "./FormButtons";
import { fieldStyle } from "./Styles/EventFormStyles";


const NewNoticeForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      "\u2705 Notice submitted!\n\n" +
        JSON.stringify(formData, null, 2)
    );
  };

  const handleReset = () => {
    setFormData({
      title: "",
      content: "",
    });
  };

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          p: 2,
          width: "100%",
          maxWidth: "1000px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <Box mb={1}>
          <Typography
            sx={{ px: 1, py: 0.5 }}
            variant="h5"
            fontWeight="bold"
          >
            Create New Notice
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                multiline
                rows={6}
                placeholder="Enter notice content (max 500 characters)"
                inputProps={{ maxLength: 500 }}
                sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <ResetButton onClick={handleReset} />
                <SubmitButton />
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default NewNoticeForm;
