import {
    Card,
    Typography,
    Stack,
    Box,
    Chip
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import formatDate from "./Functions/formatDate";

const skillMap = {
    AC: "Adaptability & Cross-Cultural Collaboration",
    AP: "Analytical & Problem-Solving Abilities",
    CT: "Creative & Strategic Thinking",
    EC: "Effective Communication",
    EI: "Emotional Intelligence & Inclusivity",
    LT: "Leadership & Team Management",
    NP: "Negotiation & Persuasion",
    PM: "Project & Time Management",
    PR: "Professional Networking & Relationship-Building",
    SM: "Self-Motivation & Initiative"
};

const skillColorMap = {
    AC: "#D0F0C0",
    AP: "#B2EBF2",
    CT: "#E1BEE7",
    EC: "#FFECB3",
    EI: "#F8BBD0",
    LT: "#C8E6C9",
    NP: "#FFE0B2",
    PM: "#D1C4E9",
    PR: "#B3E5FC",
    SM: "#DCEDC8"
};
function PastEventCard({ image, title, time, endtime, location, tags, rewards }) {

    const topSkills = Object.entries(rewards || {})
    .filter(([_, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]) // 根据 value 从高到低排序
    .slice(0, 3); // 取前三个分数最高的非零技能

    return (
        <Card
            sx={{
                display: "flex",
                alignItems: "stretch",
                backgroundColor: "#fdfdfd",
                borderLeft: "6px solid #a8e847",
                boxShadow: 2,
                borderRadius: 2,
                height: "100%",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.01)"
                }
            }}
        >
            <Box
                flex={2}
                p={2}

                display="flex"
                flexDirection="column"
                justifyContent="center"
                >
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="h6" fontWeight="bold">
                        {title}
                    </Typography>
                    {Array.isArray(tags) && tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                                fontSize: "0.7rem",
                                backgroundColor: "#000",
                                color: "#a8e847"
                            }}
                        />
                    ))}
                </Box>

                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                    {formatDate(time)} - {formatDate(endtime)}
                </Typography>
                
                {/* Rewards Tags */}
                <Box
                    mt={1}
                    sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        overflow: "hidden", // 防止撑出卡片
                    }}
                    >
                    {topSkills.slice(0, 2).map(([abbr], i) => (
                        <Chip
                        key={i}
                        label={skillMap[abbr] || abbr}
                        size="small"
                        sx={{
                            backgroundColor: skillColorMap[abbr] || "#E0E0E0",
                            fontSize: "0.7rem",
                            maxWidth: "fit-content",
                        }}
                        />
                    ))}

                    {topSkills[2] && (
                    <Box
                        sx={{
                        display: { xs: "none", sm: "block" }, // ✅ 小屏自动隐藏第三个技能
                        maxWidth: "160px",
                        overflow: "hidden"
                        }}
                    >
                        <Chip
                        label={skillMap[topSkills[2][0]] || topSkills[2][0]}
                        size="small"
                        sx={{
                            backgroundColor: skillColorMap[topSkills[2][0]] || "#E0E0E0",
                            fontSize: "0.7rem",
                            maxWidth: "100%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                        />
                    </Box>
                    )}

                    </Box>



            </Box>

            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    pr: "10px",
                    pt: "1px",
                    pb: "1px",
                    flexShrink: 0 // ✅ 不允许被压缩
                }}
                >
                <Box
                    component="img"
                    src={image ? image: "/WhatsOnLogo.png"}
                    alt={title}
                    sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1,
                    objectFit: "cover"
                    }}
                />
                </Box>

        </Card>
    );
}

export default PastEventCard;
