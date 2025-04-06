import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActionArea,
    Box,
} from "@mui/material";

function EventCard({ image, title, summary, variant }) {
    const isPopup = variant === "popup";

    return (
        <Card
        sx={{
            width: isPopup ? 250 : "100%",
            height: 300,
            borderRadius: 3,
            boxShadow: 3,
            overflow: "hidden", 
            display: "flex",
            flexDirection: "column",
        }}
        >
        <CardActionArea sx={{ flexGrow: 1 }}>
            <Box sx={{ height: 140, width: "100%" }}>
            <CardMedia
                component="img"
                image={image || "/logo.png"}
                alt={title}
                sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                display: "block",
                }}
            />
            </Box>

            <CardContent sx={{ height: 120 }}>
            <Typography gutterBottom variant="h6" component="div">
                {title}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                }}
            >
                {summary}
            </Typography>
            </CardContent>
        </CardActionArea>
        </Card>
    );
    }

export default EventCard;
