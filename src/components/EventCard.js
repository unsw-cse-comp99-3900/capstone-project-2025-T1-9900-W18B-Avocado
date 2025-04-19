import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActionArea,
    Box,
    Stack,
  } from "@mui/material";
  import AccessTimeIcon from "@mui/icons-material/AccessTime";
  import PlaceIcon from "@mui/icons-material/Place";
  import formatDate from "./Functions/formatDate";
  
  function EventCard({ image, title, summary, variant, time, endTime, location, tags }) {
    const isPopup = variant === "popup";
    return (
      <Card
        sx={{
          width: "100%",
          maxWidth: 350,
          height: 300,
          boxShadow: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 4,
          },
        }}
      >
        <CardActionArea
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            height: "100%",
          }}
        >
          {/* Image + Floating Tag */}
          <Box sx={{ height: 160, width: "100%", position: "relative" }}>
            <CardMedia
              component="img"
              image={image || "/WhatsOnLogo.png"}
              alt={title}
              sx={{
                height: "100%",
                width: "100%",
                padding:"15px",
                objectFit: "cover",
                display: "block",
              }}
            />
            {tags && (
              <Box
              sx={{
                position: "absolute",
                bottom: 20,
                right: 20,
                px: 1,
                py: "2px",
                fontSize: "0.9rem",
                fontStyle: "italic",
                fontWeight: 500,
                backgroundColor: "black",
                color: "#a8e847",
                borderRadius: "4px",
                zIndex: 2,
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.4)",
                display: "inline-block",
              }}
            >
              {tags}
            </Box>            
            )}
          </Box>
  
          {/* Content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent sx={{ px: 2, pt: 0 }}>
              <Typography
                gutterBottom
                variant="h1"
                fontWeight="bold"
                fontSize="1.1rem"
              >
                {title}
              </Typography>
  
              {/* Time */}
              {time && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    fontSize: isPopup ? "0.95rem" : "1rem",
                    color: "text.secondary",
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                  <span>
                    {formatDate(time)}
                  </span>
                </Stack>
              )}
  
              {/* Location */}
              {location && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    fontSize: "1rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  <PlaceIcon fontSize="small" />
                  <span>{location}</span>
                </Stack>
              )}
  
              {/* Summary */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  pl:0.3,
                  fontSize: "1.1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  minHeight: "2.7em",
                }}
              >
                {summary}
              </Typography>
            </CardContent>
          </Box>
        </CardActionArea>
      </Card>
    );
  }
  
  export default EventCard;
  