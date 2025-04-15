import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActionArea,
    Box,Divider,
    Chip,
    Stack,
    
} from "@mui/material";

function EventCard({ image, title, summary, variant, time, endTime, location,tags}) {
    const isPopup = variant === "popup";
    const finalTags = Array.isArray(tags) ? tags : tags ? [tags] : [];

    return (
    <Card
        sx={{
        width: "100%",           // 由 Grid 控制列宽
        maxWidth: 250,
        height: 300,
        borderRadius: 1.2,         
        boxShadow: 3,
        overflow: "hidden",      // ✅ 防止内容超出
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s",
        "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 6,
        },
        }}>
    
        <CardActionArea
        sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            padding: 0,
            margin: 0,
        }}
        >
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
                m: 0,
                p: 0,
                }}
            />
        </Box>

        {/*内容 */}
        <CardContent
            sx={{
            flexGrow: 1,
            padding: "8px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // 让上下空间自动分布
            }}
        >

            {/*上部分 标题时间summary */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ fontSize: "1rem", marginBottom: "0.2em" }}
                >
                {title}
                </Typography>

                {time && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mt: 0.5 }}
                >
                    🕒{new Date(time).toLocaleString()} – {new Date(endTime).toLocaleString()}
                </Typography>
                )}


                {/* 地点 */}
                {location && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem", display: "block" }}>
                    📍 {location}
                </Typography>
                )}

                <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mt: 0.5,
                    mb: 1.5, // 预留出 Divider 空间，保持卡片高度一致
                    fontSize: "0.82rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    margin:0,
                }}
                >
                    {summary}
                </Typography>
            </Box>


            {/* 分割线 */}
            <Divider
                sx={{
                position: "absolute",
                bottom: "2.8em",
                left: "1.5em",
                right: "1.5em",
                my: 0.5,
                }}
            />

            {/* 标签 */}
            <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                {finalTags.slice(0, 2).map((tag, idx) => (
                <Chip
                    key={idx}
                    label={tag}
                    size="small"
                    sx={{
                    fontSize: "0.7rem",
                    height: "20px",
                    backgroundColor: "#e3f2fd",
                    color: "#1565c0",
                    }}
                />
                ))}
            </Stack>
        </CardContent>
        </CardActionArea>
    </Card>
    );
}

export default EventCard;
