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
import CloseIconButton from "../../Buttons/CloseIconButton";

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
  for (const [short, full] of Object.entries(map)) {
    result[full] = data[short] ?? 0;
  }
  return result;
};

const unmapSkills = (skillsObj) => {
    const reverseMap = {
      "Analytical & Problem-Solving Abilities": "AC",
      "Adaptability & Cross-Cultural Collaboration": "AP",
      "Creative & Strategic Thinking": "CT",
      "Effective Communication": "EC",
      "Emotional Intelligence & Inclusivity": "EI",
      "Leadership & Team Management": "LT",
      "Negotiation & Persuasion": "NP",
      "Project & Time Management": "PM",
      "Professional Networking & Relationship-Building": "PR",
      "Self-Motivation & Initiative": "SM",
    };
  
    const result = {};
    for (const [label, value] of Object.entries(skillsObj)) {
      const short = reverseMap[label];
      if (short) result[short] = Number(value);
    }
    return result;
  };
  

const EditEventDialog = ({ open, onClose, onConfirm, event }) => {
  const [formData, setFormData] = useState({});
  const [skillPoints, setSkillPoints] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [originalEvent, setOriginalEvent] = useState(null);


  useEffect(() => {
    if (open && event) {
      setFormData({ ...event });
      setSkillPoints(mapSkills(event));
      setImage(null);
      setImagePreview(event.image ? `http://localhost:7000${event.image}` : "");
      setOriginalEvent({ ...event });
    }
  }, [open, event]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleReset = () => {
    setFormData({
      eventID: formData.eventID,
      name: "",
      location: "",
      organizer: "",
      startTime: "",
      endTime: "",
      tag: "",
      externalLink: "",
      summary: "",
      description: "",
      image: null,
    });
  
    setSkillPoints(skills.reduce((acc, skill) => ({ ...acc, [skill]: 0 }), {}));
    setImage(null);
    setImagePreview("");
  };
  

  const handleSkillChange = (skill) => (e) => {
    const value = Number(e.target.value);
    setSkillPoints((prev) => ({ ...prev, [skill]: value }));
  };

  const handleSkillReset = () => {
    setSkillPoints(skills.reduce((acc, s) => ({ ...acc, [s]: 0 }), {}));
  };

  const handleSubmit = () => {
    const skillAbbr = unmapSkills(skillPoints);
  
    const isNewImage = image instanceof File;
  
    const payload = {
      ...formData,
      ...skillAbbr,
      // save previous pic if no image update
      image: isNewImage ? image : formData.image,
    };
    delete payload.status;
  
    console.log("Final Payload:", payload);
    onConfirm?.(payload);
  };  
  

  const handleDiscardChanges = () => {
    if (originalEvent) {
        setFormData({ ...originalEvent });
        setSkillPoints(mapSkills(originalEvent));
        setImage(null);
        setImagePreview(originalEvent.image ? `http://localhost:7000${originalEvent.image}` : "");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Event (ID: {formData.eventID})</DialogTitle>
      <CloseIconButton onClick={onClose} />
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
                  {image instanceof File && (
                    <Typography variant="body2">{image.name}</Typography>
                    )}
                  <Box component="img" src={imagePreview} alt="Preview" width={150} mt={1} sx={{ border: "1px solid #ccc", borderRadius: 1 }} />
                  <Button size="small" color="error" onClick={handleImageReset} sx={{ mt: 1 }}>
                    Reset Image
                  </Button>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth startIcon={<StarIcon />} onClick={() => setDialogOpen(true)} sx={{ ...pointsButtonStyle, height: 56 }}>
              Set Earnable Points
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
        <Button variant="outlined" color="error" onClick={handleReset}>Reset</Button>
        <Button variant="outlined" color="success" onClick={handleDiscardChanges}>Discard Changes</Button>
        <Button variant="outlined" onClick={handleSubmit}>Save</Button>
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