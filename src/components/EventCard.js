import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActionArea,
    CardActions,
    CardHeader,
    Avatar,
    Box,
    Chip,
    Stack,
    Divider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";

function EventCard({ image, title, summary, variant, time, endTime, location, tags }) {
    const finalTags = Array.isArray(tags) ? tags : tags ? [tags] : [];
    const isPopup = variant === "popup";

    return (
        <Card
            sx={{
            width: "100%",
            maxWidth: 320, // ✅ 弹窗卡片更窄
            height: 380,
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.2s ease, box-shadow 0.2s",
            "&:hover": {
                transform: "scale(1.03)",
                boxShadow: 6,
            },
            }}
        >
            <CardActionArea
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                padding: 0,
                height: "100%", 
            }}
            >
            {/* Image */}
            <Box sx={{ height: 160, width: "100%" }}>
                <CardMedia
                component="img"
                image={image || "/WhatsOnLogo.png"}
                alt={title}
                sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    display: "block",
                }}
                />
            </Box>
        
            
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                <CardContent sx={{ px: 2, py: 1.5 }}>
                <Typography gutterBottom variant="h6" fontWeight="bold" fontSize="1.1rem">
                    {title}
                </Typography>
        
                {/* Time */}
                {time && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: isPopup ? "0.75rem" : "0.8rem", color: "text.secondary" }}>
                    <AccessTimeIcon fontSize="small" />
                    <span>{new Date(time).toLocaleString()} – {new Date(endTime).toLocaleString()}</span>
                    </Stack>
                )}
        
                {/* Location */}
                {location && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: "0.8rem", color: "text.secondary", mt: 0.5 }}>
                    <PlaceIcon fontSize="small" />
                    <span>{location}</span>
                    </Stack>
                )}
        
                {/* Summary*/}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                    mt: 0.8,
                    fontSize: "0.85rem",
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
        
                
                <Box sx={{ px: 2, pb: 1.5 }}>
                <Divider sx={{ mb: 1.2 }} />
                <CardActions sx={{ p: 0 }}>
                    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                    {finalTags.slice(0, 2).map((tag, idx) => (
                        <Chip
                        key={idx}
                        label={tag}
                        size="small"
                        sx={{
                            fontSize: "0.75rem",
                            height: 22,
                            backgroundColor: "#e3f2fd",
                            color: "#1565c0",
                        }}
                        />
                    ))}
                    </Stack>
                </CardActions>
                </Box>
            </Box>
            </CardActionArea>
        </Card>
        );
}
export default EventCard;