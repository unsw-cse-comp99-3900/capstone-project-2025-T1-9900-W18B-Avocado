import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StarIcon from "@mui/icons-material/Star";
import SkillPointsDialog from "../Dialogs/SkillPointsDialog";
import { uploadButtonStyle, pointsButtonStyle } from "../Styles/EventFormStyles";

const skills = [
  "Effective Communication",
  "Leadership & Team Management",
  "Analytical & Problem-Solving Abilities",
  "Professional Networking & Relationship-Building",
  "Adaptability & Cross-Cultural Collaboration",
  "Creative & Strategic Thinking",
  "Project & Time Management",
  "Emotional Intelligence & Inclusivity",
  "Negotiation & Persuasion",
  "Self-Motivation & Initiative",
];

const mapSkills = (data) => {
  const map = {
    AC: "Analytical & Problem-Solving Abilities",
    AP: "Adaptability & Cross-Cultural Collaboration",
    CT: "Creative & Strategic Thinking",
    EC: "Effective Communication",
    EI: "Emotional Intelligence & Inclusivity",
    LT: "Leadership & Team Management",
    NP: "Negotiation & Persuasion",
    PM: "Project & Time Management",
    PR: "Professional Networking & Relationship-Building",
    SM: "Self-Motivation & Initiative",
  };
  const result = {};
  for (const [key, label] of Object.entries(map)) {
    result[label] = data[key] ?? 0;
  }
  return result;
};

const EditEventDialog = ({ open, onClose, onConfirm, event }) => {
  const [formData, setFormData] = useState(event || {});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [skillPoints, setSkillPoints] = useState({});

  useEffect(() => {
    if (event) {
      setFormData(event);
      setImagePreview(event.image ? `http://localhost:7000${event.image}` : "");
      setSkillPoints(mapSkills(event));
    }
  }, [event]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setImagePreview(event.target.result);
    reader.readAsDataURL(file);

    setImage(file);
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleImageReset = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSkillChange = (skill) => (e) => {
    setSkillPoints({ ...skillPoints, [skill]: e.target.value });
  };

  const handleSkillReset = () => {
    setSkillPoints(skills.reduce((acc, s) => ({ ...acc, [s]: 0 }), {}));
  };

  const handleSubmit = () => {
    onConfirm?.({ ...formData, skillPoints, image });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Event (ID: {formData.eventID})</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField required fullWidth label="Event Name" name="name" value={formData.name || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField required fullWidth label="Location" name="location" value={formData.location || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField required fullWidth label="Organizer" name="organizer" value={formData.organizer || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField required fullWidth label="Start Time" type="datetime-local" name="startTime" value={formData.startTime || ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField required fullWidth label="End Time" type="datetime-local" name="endTime" value={formData.endTime || ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField required fullWidth label="Tag" name="tag" value={formData.tag || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />} sx={{ ...uploadButtonStyle, height: 56 }}>
                Upload Image
                <input type="file" hidden onChange={handleFileUpload} />
              </Button>
              {imagePreview && (
                <Box mt={1}>
                  <Typography variant="body2">{image?.name}</Typography>
                  <Box component="img" src={imagePreview} alt="Preview" width={150} mt={1} sx={{ border: "1px solid #ccc", borderRadius: 1 }} />
                  <Button size="small" color="error" onClick={handleImageReset} sx={{ mt: 1 }}>
                    Reset Image
                  </Button>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth startIcon={<StarIcon />} onClick={() => setDialogOpen(true)} sx={{ ...pointsButtonStyle, height: 56 }}>
                Set Points
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="External Link" name="externalLink" value={formData.externalLink || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth label="Summary" name="summary" value={formData.summary || ""} onChange={handleChange} multiline rows={2} inputProps={{ maxLength: 50 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth label="Description" name="description" value={formData.description || ""} onChange={handleChange} multiline rows={4} inputProps={{ maxLength: 100 }} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => setFormData(event)}>Reset</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogActions>

      <SkillPointsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        skills={skills}
        skillPoints={skillPoints}
        onSkillChange={handleSkillChange}
        onReset={handleSkillReset}
      />
    </Dialog>
  );
};

export default EditEventDialog;