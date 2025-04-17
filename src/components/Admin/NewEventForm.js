import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  MenuItem,
  InputLabel,
  FormControl,
  Select
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StarIcon from "@mui/icons-material/Star";
import { SubmitButton, ResetButton } from "./FormButtons";
import SkillPointsDialog from "./Dialogs/SkillPointsDialog";
import { fieldStyle, uploadButtonStyle, pointsButtonStyle } from "./Styles/EventFormStyles";


const validateTimes = (formData, setErrorMsg) => {
  const now = new Date();
  const startTime = new Date(formData.start);
  const endTime = new Date(formData.end);

  if (endTime <= startTime) {
    setErrorMsg("❌ End time must be after start time.");
    return false;
  }

  return true;
};

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

const options = [
  "Social", "Networking", "Games", "Startups", "Technology",
  "Cultural", "Careers", "Sustainability", "Books", "Art",
  "Coding", "Movies", "Entrepreneurship", "Food", "Volunteering", "Music", "Debate"
];

const NewEventForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    start: "",
    end: "",
    summary: "",
    description: "",
    organizer: "",
    tag: "",
    externalLink: "",
    skillPoints: {},
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [skillPoints, setSkillPoints] = useState(
    skills.reduce((acc, skill) => ({ ...acc, [skill]: 0 }), {})
  );
  const [selectedValue, setSelectedValue] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");


  const handleTagChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    setFormData({ ...formData, tag: value });
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSkillChange = (skill) => (e) => {
    setSkillPoints({ ...skillPoints, [skill]: e.target.value });
    setErrorMsg("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      setImagePreview(event.target.result);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const targetWidth = 900;
        const targetHeight = 600;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (targetWidth - scaledWidth) / 2;
        const offsetY = (targetHeight - scaledHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: file.type });
          setImage(resizedFile);
          setFormData((prev) => ({ ...prev, image: resizedFile }));
        }, file.type);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleImageReset = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!validateTimes(formData, setErrorMsg)) return;

    const fullFormData = {
      ...formData,
      skillPoints: skillPoints,
    };

    const multipartData = new FormData();
    for (let key in fullFormData) {
      if (key === "skillPoints") {
        multipartData.append("skillPoints", JSON.stringify(fullFormData.skillPoints));
      } else if (key === "image") {
        continue;
      } else {
        multipartData.append(key, fullFormData[key]);
      }
    }

    if (image) {
      multipartData.append("image", image);
    }

    console.log("Payload contents:");
    for (let pair of multipartData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }


    try {
      const response = await fetch("http://localhost:7000/admin/create_event", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        method: "POST",
        body: multipartData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("✅ " + (data.message || "Event created successfully!"));
        setTimeout(() => console.log("navigate to somewhere"), 2000);
        handleReset();
      } else {
        setErrorMsg("❌ " + (data.error || "An error occurred."));
      }
    } catch (error) {
      setErrorMsg("❌ Network error. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      location: "",
      start: "",
      end: "",
      summary: "",
      description: "",
      organizer: "",
      tag: "",
      skillPoints: {},
      externalLink: ""
    });
    setImage(null);
    setImagePreview("");
    setSkillPoints(skills.reduce((acc, skill) => ({ ...acc, [skill]: 0 }), {}));
  };

  const handleSkillReset = () => {
    setSkillPoints(skills.reduce((acc, skill) => ({ ...acc, [skill]: 0 }), {}));
  };

  return (
    <Box >
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
        <Typography sx={{ px: 1, py: 0.5 }} variant="h5" fontWeight="bold" Box mb={1}>
          Create New Event
        </Typography>
        <Divider sx={{ my: 2 }} />

        {errorMsg && <Typography color="error" mb={2}>{errorMsg}</Typography>}
        {successMsg && <Typography color="success.main" mb={2}>{successMsg}</Typography>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Event Name" name="name" value={formData.name}
                onChange={handleChange} required sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth label="Organizer" name="organizer" value={formData.organizer}
                    onChange={handleChange} required sx={fieldStyle}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth label="Location" name="location" value={formData.location}
                    onChange={handleChange} required sx={fieldStyle}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth required>
                    <InputLabel id="tag-label">Tag</InputLabel>
                    <Select
                      labelId="tag-label"
                      label="Tag"
                      value={selectedValue}
                      onChange={handleTagChange}
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
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Start Time" type="datetime-local" name="start"
                    value={formData.start} onChange={handleChange}
                    InputLabelProps={{ shrink: true }} required sx={fieldStyle}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="End Time" type="datetime-local" name="end"
                    value={formData.end} onChange={handleChange}
                    InputLabelProps={{ shrink: true }} required sx={fieldStyle}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ width: "100%", my: 3 }} />

            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth label="External Link (Optional)" name="externalLink"
                    value={formData.externalLink} onChange={handleChange} multiline sx={fieldStyle}
                    placeholder="Enter up to 25 characters"
                    inputProps={{ maxLength: 25 }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Button
                    variant="outlined" component="label" fullWidth
                    startIcon={<UploadFileIcon />}
                    sx={{ ...uploadButtonStyle, height: "56px" }}
                  >
                    Upload Image
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>

                  {image && (
                    <Box mt={1}>
                      <Typography variant="body2">{image.name}</Typography>
                      <Box
                        mt={1}
                        component="img"
                        src={imagePreview}
                        alt="Preview"
                        sx={{
                          width: 150,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid #ccc",
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={handleImageReset}
                        sx={{ mt: 1 }}
                      >
                        Reset Image
                      </Button>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth startIcon={<StarIcon />} onClick={() => setDialogOpen(true)}
                    sx={{ ...pointsButtonStyle, height: "56px" }}
                  >
                    Set Earnable Points
                  </Button>
                </Grid>
              </Grid>
            </Grid>


            <Grid item xs={12}>
              <TextField
                fullWidth required label="Summary" name="summary" value={formData.summary}
                onChange={handleChange} multiline rows={2} placeholder="Enter up to 50 characters"
                inputProps={{ maxLength: 50 }} sx={fieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth required label="Description" name="description" value={formData.description}
                onChange={handleChange} multiline rows={4} placeholder="Enter up to 100 characters"
                inputProps={{ maxLength: 100 }} sx={fieldStyle}
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

      <SkillPointsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        skills={skills}
        skillPoints={skillPoints}
        onSkillChange={handleSkillChange}
        onReset={handleSkillReset}
      />
    </Box>
  );
};

export default NewEventForm;
