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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StarIcon from "@mui/icons-material/Star";
import SkillPointsDialog from "../Dialogs/SkillPointsDialog";
import { uploadButtonStyle, pointsButtonStyle } from "../Styles/EventFormStyles";
import CloseIconButton from "../../Buttons/CloseIconButton";
import skillMap from "../../Functions/skillMap";

const options = [
  "Social", "Networking", "Games", "Startups", "Technology",
  "Cultural", "Careers", "Sustainability", "Books", "Art",
  "Coding", "Movies", "Entrepreneurship", "Food", "Volunteering", "Music", "Debate"
];

const getPreviousImage = async (url, filename, mimeType) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  } catch (error) {
    console.error("Error fetching previous image:", error);
    return null;
  }
};

const skills = Object.values(skillMap);

const mapSkills = (data) => {
  const result = {};
  for (const [abbr, label] of Object.entries(skillMap)) {
    result[label] = data[abbr] ?? 0;
  }
  return result;
};

const unmapSkills = (skillsObj) => {
  const reverseMap = Object.fromEntries(
    Object.entries(skillMap).map(([abbr, label]) => [label, abbr])
  );
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
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (open && event) {
      setFormData({ ...event });
      setSkillPoints(mapSkills(event));
      setImage(null);
      setImagePreview(event.image ? `http://localhost:7000${event.image}` : "");
      setOriginalEvent({ ...event });
      setImageError("");
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
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
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

  // submit
  const handleSubmit = async () => {
    const skillAbbr = unmapSkills(skillPoints);
    const formDataToSend = new FormData();
    setImageError("");

    for (const key of [
      "eventID", "name", "location", "organizer",
      "startTime", "endTime", "tag", "externalLink",
      "summary", "description"
    ]) {
      formDataToSend.append(key, formData[key] || "");
    }

    formDataToSend.append("skillPoints", JSON.stringify(skillAbbr));

    if (image instanceof File) {
      formDataToSend.append("image", image);
    } else if (imagePreview) {
      const oldFile = await getPreviousImage(imagePreview, "oldImage.jpg", "image/jpeg");
      if (oldFile) {
        formDataToSend.append("image", oldFile);
      } else {
        setImageError("Failed to fetch the previous image. Please upload a new one.");
        return;
      }
    }

    onConfirm?.(formDataToSend);
    console.log("Submitting edited event...", formData);
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
              <TextField required fullWidth label="Event Name" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Enter up to 25 characters"
                inputProps={{ maxLength: 25 }}/>
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
              <FormControl required fullWidth>
                <InputLabel id="edit-tag-label">Tag</InputLabel>
                <Select
                  labelId="edit-tag-label"
                  name="tag"
                  label="Tag"
                  value={formData.tag || ""}
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        overflowY: "auto",
                      },
                    },
                  }}
                >
                  {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
              {imageError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {imageError}
                </Typography>
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
              <TextField required fullWidth label="Summary" name="summary" value={formData.summary || ""} onChange={handleChange} multiline rows={2} inputProps={{ maxLength: 100 }} placeholder="Enter up to 100 characters" />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth label="Description" name="description" value={formData.description || ""} onChange={handleChange} multiline rows={4} inputProps={{ maxLength: 800 }} InputProps={{
                  sx: {
                    '& textarea': {
                      maxHeight: '200px',
                      overflowY: 'auto',
                    },
                  },
                }}placeholder="Enter up to 800 characters"/>
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
