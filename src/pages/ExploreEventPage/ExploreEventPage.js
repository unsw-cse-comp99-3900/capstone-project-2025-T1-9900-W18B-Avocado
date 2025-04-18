// MainHomePage.jsx
import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Grid, Tooltip, Skeleton, Link, Button, Typography } from "@mui/material";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import EventCard from "../../components/EventCard";
import "./ExploreEventPage.css";
import image1 from "../../assets/pastevent1.png"
import image2 from "../../assets/todayevent1.png"
import image3 from "../../assets/todayevent2.png"
import image4 from "../../assets/todayevent3.png"

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

const reverseSkillMap = Object.fromEntries(
  Object.entries(skillMap).map(([key, label]) => [label, key])
);
const SKILL_LABELS = ["All Categories", ...Object.values(skillMap)];
const skillIcons = {
  ALL: <CategoryIcon />,
  AC: <PsychologyIcon />, AP: <Diversity3Icon />, CT: <EmojiObjectsIcon />, EC: <CampaignIcon />,
  EI: <EmojiEmotionsIcon />, LT: <GroupsIcon />, NP: <HandshakeIcon />, PM: <QueryBuilderIcon />,
  PR: <HubIcon />, SM: <RocketLaunchIcon />,
};

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
      tags: ["Books"],
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
      tags: ["Books"],
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
      tags: ["Music"],
      PM: 4
    },
    {
      eventID: 4,
      name: "Mock Event D",
      summary: "Focus on progress, not perfection, every single day.",
      startTime: "2025-04-08T10:00:00Z",
      endTime: "2025-04-20T23:59:59Z",
      image: image4,
      location: "Library",
      tags: ["Books"],
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
      tags: ["Books"],
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
      tags: ["Music"],
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
      tags: ["Music"],
      PM: 4
    },
    {
      eventID: 4,
      name: "Mock Event D",
      summary: "Happening now",
      startTime: "2025-04-08T10:00:00Z",
      endTime: "2025-04-20T23:59:59Z",
      image: "/static/uploads/sample1.png",
      location: "Library",
      tags: ["Books"],
      AC: 5, EC: 10
    },
    {
      eventID: 5,
      name: "Mock Event E",
      summary: "Happening now",
      startTime: "2025-04-09T10:00:00Z",
      endTime: "2025-04-21T23:59:59Z",
      image: "/static/uploads/sample2.png",
      location: "Library",
      tags: ["Books"],
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
      tags: ["Music"],
      EI: 7
    }
  ]
};

const ExploreEventPage = () => {
  // http://localhost:7000/event_list?filter=${eventType}&category=${categoryType}&page=${page + 1}&limit=${rowsPerPage}
  // Event type: Current/Upcoming
  const [eventType, setEventType] = useState("Current Events");
  // Categorytype: All/ Skill full name
  const [categoryType, setCategoryType] = useState("All Categories");
  //http://localhost:7000/event_list?filter=current&category=all&page=$1&limit=10
  //http://localhost:7000/event_list?filter=current&category=ec&page=$1&limit=10

  const [tabIndex, setTabIndex] = useState(0);
  const [skillEvents, setSkillEvents] = useState({});
  const isLoading = false;


  useEffect(() => {
    const result = {};
    Object.keys(skillMap).forEach((key) => {
      result[key] = mockEvents.events.filter((event) => event[key] > 0);
    });
    setSkillEvents(result);
  }, []);

  const renderEvents = (events) => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={event.eventID}>
          <EventCard {...event} />
        </Grid>
      ))}
    </Grid>
  );

  const currentLabel = SKILL_LABELS[tabIndex];
  const currentKey = reverseSkillMap[currentLabel];
  const currentEvents = currentLabel === "All Categories"
    ? mockEvents.events
    : skillEvents[currentKey] || [];


  return (
    <div>
      <Box className="fixed part" sx={{backgroundColor:"white"}}>
        <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
          <Header />
          <Box className="event-buttons">
            <Button variant="contained" className="today-button"
              onClick={() => setEventType("Current Events")}>
              Current Events</Button>
            <Button variant="contained" className="coming-button"
              onClick={() => setEventType("Upcoming Events")}>
              Upcoming Events</Button>
          </Box>
          <Box
            className="specific-text"
            sx={{
              
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color:"#a8e847",
              px: 2,
              mt: 3,
              mb: 2,
            }}
          >
            <Typography component="span" sx={{ color: "#235858",fontSize: "1.5rem",
              fontWeight: "bold", }}>
              {categoryType}
            </Typography>{" "}in{" "}
            <Typography component="span" sx={{ color: "#235858", fontSize: "1.5rem",
              fontWeight: "bold", }}>
              {eventType}
            </Typography>
          </Box>



          <Box sx={{ backgroundColor: "white", px: 2, py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                className="custom-scroll-btn"
                onClick={() => {
                  document.querySelector(".MuiTabs-scroller")?.scrollBy({ left: -160, behavior: "smooth" });
                }}
              >
                <ChevronLeftIcon fontSize="large" />
              </Box>

              <Tabs
                value={tabIndex}
                onChange={(e, newValue) => {
                  setTabIndex(newValue);
                  setCategoryType(SKILL_LABELS[newValue])
                }}
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
                      className="tab-item"
                      disableRipple
                      label={
                        <Tooltip arrow>
                          <div className={`tab-label-box ${isActive ? "tab-active" : "tab-inactive"}`}>
                            {React.cloneElement(skillIcons[shortKey], { fontSize: "medium" })}
                            <div className="tab-text">{label}</div>
                          </div>
                        </Tooltip>
                      }
                    />
                  );
                })}
              </Tabs>

              <Box
                className="custom-scroll-btn"
                onClick={() => {
                  document.querySelector(".MuiTabs-scroller")?.scrollBy({ left: 160, behavior: "smooth" });
                }}
              >
                <ChevronRightIcon fontSize="large" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="events-part">

        <Box className="events-part">
          <Box sx={{ pt: 14, px: 2 }}>
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
                : currentEvents.map((event) => (
                  <Grid item key={event.eventID} xs={12} sm={6} md={4} lg={2.4} sx={{ flexBasis: "20%", maxWidth: "20%" }}>
                    <Link
                      to={`/event/${event.eventID}`}
                      style={{ textDecoration: "none" }}
                      onClick={() =>
                        localStorage.setItem("eventDetail", JSON.stringify(event))
                      }
                    >
                      <EventCard
                        image={event.image}
                        title={event.name}
                        summary={event.summary}
                        time={event.startTime}
                        endTime={event.endTime}
                        location={event.location}
                        tags={event.tags || []}
                        variant="popup"
                      />
                    </Link>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>

      </Box>
      <Footer />
    </div>
  );
};

export default ExploreEventPage;