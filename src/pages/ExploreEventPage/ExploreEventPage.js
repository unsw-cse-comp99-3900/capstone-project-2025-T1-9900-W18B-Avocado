import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Tabs, Tab, Grid, Tooltip, Skeleton, Button, Typography, Pagination } from "@mui/material";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import EventCard from "../../components/EventCard";
import "./ExploreEventPage.css";

// Icons
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import GroupsIcon from "@mui/icons-material/Groups";
import PsychologyIcon from "@mui/icons-material/Psychology";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import CampaignIcon from "@mui/icons-material/Campaign";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import HandshakeIcon from "@mui/icons-material/Handshake";
import HubIcon from "@mui/icons-material/Hub";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CategoryIcon from "@mui/icons-material/Category";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import skillMap from "../../components/Functions/skillMap";
import image1 from "../../assets/pastevent1.png"
import image2 from "../../assets/todayevent1.png"
import image3 from "../../assets/todayevent2.png"
import image4 from "../../assets/todayevent3.png"


const mockEvents = {
  events: [
    {
      eventID: 1,
      name: "Mock Event A",
      summary: "Happening now",
      startTime: "2025-04-08T10:00:00Z",
      endTime: "2025-04-20T23:59:59Z",
      image: image1,
      location: "Library",
      tag: ["Books"],
      AC: 5, EC: 10
    },
    {
      eventID: 2,
      name: "Mock Event B",
      summary: "Happening now",
      startTime: "2025-04-09T10:00:00Z",
      endTime: "2025-04-21T23:59:59Z",
      image: image2,
      location: "Library",
      tag: ["Books"],
      AC: 2, EC: 3
    },
    {
      eventID: 2,
      name: "Mock Event B",
      summary: "Happening now",
      startTime: "2025-04-09T10:00:00Z",
      endTime: "2025-04-21T23:59:59Z",
      image: image2,
      location: "Library",
      tag: ["Books"],
      AC: 2, EC: 3
    },
    {
      eventID: 3,
      name: "Mock Event C",
      summary: "Upcoming",
      startTime: "2025-04-25T10:00:00Z",
      endTime: "2025-04-30T23:59:59Z",
      image: image3,
      location: "Auditorium",
      tag: ["Music"],
      PM: 4
    },
    {
      eventID: 4,
      name: "Startup Pitch & Networking",
      summary: "Focus on progress, not perfection, every single day.",
      startTime: "2025-04-08T10:00:00Z",
      endTime: "2025-04-20T23:59:59Z",
      image: image4,
      location: "Library",
      tag: ["Books"],
      AC: 5, EC: 10
    },
    {
      eventID: 5,
      name: "Mock Event E",
      summary: "Happening now",
      startTime: "2025-04-09T10:00:00Z",
      endTime: "2025-04-21T23:59:59Z",
      image: image1,
      location: "Library",
      tag: ["Books"],
      SM: 2, PM: 3
    },
    {
      eventID: 6,
      name: "Mock Event F",
      summary: "Upcoming",
      startTime: "2025-04-25T10:00:00Z",
      endTime: "2025-04-30T23:59:59Z",
      image: "/static/uploads/sample3.png",
      location: "Auditorium",
      tag: ["Music"],
      EI: 7
    },
    {
      eventID: 3,
      name: "Mock Event C",
      summary: "Upcoming",
      startTime: "2025-04-25T10:00:00Z",
      endTime: "2025-04-30T23:59:59Z",
      image: "/static/uploads/sample3.png",
      location: "Auditorium",
      tag: ["Music"],
      PM: 4
    },
    {
      eventID: 5,
      name: "Mock Event E",
      summary: "Happening now",
      startTime: "2025-04-09T10:00:00Z",
      endTime: "2025-04-21T23:59:59Z",
      image: "/static/uploads/sample2.png",
      location: "Library",
      tag: ["Books"],
      SM: 2, PM: 3
    },
    {
      eventID: 6,
      name: "Mock Event F",
      summary: "Upcoming",
      startTime: "2025-04-25T10:00:00Z",
      endTime: "2025-04-30T23:59:59Z",
      image: "/static/uploads/sample3.png",
      location: "Auditorium",
      tag: ["Music"],
      EI: 7
    }
  ],
  page: 1,
  pageSize: 10,
  totalCount: 100,
  totalPages: 10,
};

const reverseSkillMap = Object.fromEntries(
  Object.entries(skillMap).map(([key, label]) => [label, key])
);
const SKILL_LABELS = ["All Categories", ...Object.values(skillMap)];
const skillIcons = {
  ALL: <CategoryIcon />,
  AC: <Diversity3Icon />, AP: <PsychologyIcon />, CT: <EmojiObjectsIcon />, EC: <CampaignIcon />,
  EI: <EmojiEmotionsIcon />, LT: <GroupsIcon />, NP: <HandshakeIcon />, PM: <QueryBuilderIcon />,
  PR: <HubIcon />, SM: <RocketLaunchIcon />,
};

const ExploreEventPage = ({ isStatic = false }) => {
  const navigate = useNavigate();
  // http://localhost:7000/event_list?filter=<eventType>&page=<page + 1>&category=<categoryType>
  // Event type: Current/Upcoming
  const [eventType, setEventType] = useState("current");
  // Categorytype: All/ Skill full name
  const [categoryType, setCategoryType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [tabIndex, setTabIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (isStatic) {
        setEvents(mockEvents.events);
        setTotalCount(mockEvents.totalCount);
      } else {
        let url = `http://localhost:7000/event_list?filter=${eventType}&page=${page + 1}`;
        if (categoryType !== "all") {
          url += `&category=${categoryType}`;
        }
        console.log("Fetching from:", url);
        const res = await fetch(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        setEvents(data.events || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [eventType, categoryType, page, isStatic]);

  const handleEventTypeClick = (type) => {
    setEventType(type);
    setPage(0);
  };

  const handleCategoryChange = (newTabIndex) => {
    setTabIndex(newTabIndex);
    const newCategory = reverseSkillMap[SKILL_LABELS[newTabIndex]] || "all";
    setCategoryType(newCategory);
    setPage(0);
  };

  return (
    <div className="explore-container">
      <Box className="explore-part1" sx={{ backgroundColor: "white" }}>
        <Header />
        <Box className="eventtype-buttons">
          <Button className="today-button" variant="contained" onClick={() => handleEventTypeClick("current")}>Current Events</Button>
          <Button className="coming-button" variant="contained" onClick={() => handleEventTypeClick("upcoming")}>Upcoming Events</Button>
        </Box>
        <Box className="specific-text">
          <Typography component="span" sx={{ color: "#235858", fontSize: "1.3rem", fontWeight: "bold" }}>
            {SKILL_LABELS[tabIndex]}
          </Typography> in{" "}
          <Typography component="span" sx={{ color: "#235858", fontSize: "1.3rem", fontWeight: "bold" }}>
            {eventType === "current" ? "Current Events" : "Upcoming Events"}
          </Typography>
        </Box>

        <Box className="category-part">
          <Box className="category-scroll-btn" onClick={() => document.querySelector(".MuiTabs-scroller")?.scrollBy({ left: -160, behavior: "smooth" })}>
            <ChevronLeftIcon fontSize="large" />
          </Box>

          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => handleCategoryChange(newValue)}
            variant="scrollable"
            scrollButtons={false}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#a8e847",
                height: "3px",
                borderRadius: "2px",
              },
            }}
            sx={{
              flexGrow: 1,
              px: 1,
              overflow: "hidden",
              "& .MuiTabs-scroller": {
                overflowX: "auto !important",
              },
              "& .MuiTabs-flexContainer": {
                justifyContent: "flex-start",
              },
            }}
          >
            {SKILL_LABELS.map((label, i) => {
              const shortKey = reverseSkillMap[label] || "ALL";
              const isActive = tabIndex === i;
              return (
                <Tab
                  key={i}
                  className="category-tab-item"
                  disableRipple
                  label={
                    <Tooltip arrow>
                      <div className={`category-tab-label-box ${isActive ? "category-tab-active" : "category-tab-inactive"}`}>
                        {React.cloneElement(skillIcons[shortKey], { fontSize: "medium" })}
                        <div className="category-tab-text">{label}</div>
                      </div>
                    </Tooltip>
                  }
                />
              );
            })}
          </Tabs>

          <Box className="category-scroll-btn" onClick={() => document.querySelector(".MuiTabs-scroller")?.scrollBy({ left: 160, behavior: "smooth" })}>
            <ChevronRightIcon fontSize="large" />
          </Box>
        </Box>
      </Box>

      <Box className="explore-part2">
        <Grid container spacing={2}>
          {isLoading
            ? Array.from(new Array(10)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={2.4} sx={{ flexBasis: "20%", maxWidth: "20%" }}>
                <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Skeleton variant="rectangular" height={180} />
                  <Skeleton variant="text" sx={{ mt: 1 }} width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Grid>
            ))
            : events.map((event) => (
              <Grid item key={event.eventID} xs={12} sm={6} md={4} lg={2.4} sx={{ flexBasis: "20%", maxWidth: "20%" }}>
                <Box
                  sx={{ textDecoration: "none", cursor: "pointer" }}
                  onClick={() => {
                    // const newEvent = { ...event, image: image1 };
                    // localStorage.setItem("eventDetail", JSON.stringify(newEvent));
                    localStorage.setItem("eventDetail", JSON.stringify(event));
                    navigate(`/event/${event.eventID}`);
                  }}
                >
                  <EventCard
                    image={event.image && event.image.trim() !== ""
                      ? `http://localhost:7000${event.image}`
                      : "/WhatsOnLogo.png"}
                    
                    // image={image1}
                    title={event.name}
                    summary={event.summary}
                    time={event.startTime}
                    endTime={event.endTime}
                    location={event.location}
                    tags={event.tag}
                    variant="popup"
                  />
                </Box>
              </Grid>
            ))}
        </Grid>

        <Box display="flex" justifyContent="center" mt={2} mb={2} >
          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page + 1}
            onChange={(_, newPage) => setPage(newPage - 1)}
            color="success"
            variant="outlined"
          />
        </Box>

      </Box>
      <Footer />
    </div>
  );
};

export default ExploreEventPage;