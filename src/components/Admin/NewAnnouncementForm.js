import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { SubmitButton, ResetButton } from "./FormButtons";

const fieldStyle = {
  backgroundColor: "white",
  borderRadius: "15px",
};

const NewAnnouncementForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      "\u2705 Announcement submitted!\n\n" +
        JSON.stringify(formData, null, 2)
    );
  };

  const handleReset = () => {
    setFormData({
      title: "",
      content: ""
    });
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Create New Announcement
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Announcement Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              multiline
              rows={6}
              placeholder="Enter announcement content (max 500 characters)"
              inputProps={{ maxLength: 500 }}
              InputLabelProps={{ shrink: true }}
              sx={fieldStyle}
            />
          </Grid>

          {/* 底部按钮 */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <ResetButton onClick={handleReset} />
              <SubmitButton />
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default NewAnnouncementForm;