import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuCalendarCheck } from "react-icons/lu";
import { BiHappyHeartEyes } from "react-icons/bi";
import { FiSunset } from "react-icons/fi";
import "./MainHomePage.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  Box,
  Button,
  Grid,
  Typography,
  Container,
  Stack,
  Paper,
  Tab,
  Pagination
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import PastEventCard from "../../components/PastEventCard";
import EventCard from "../../components/EventCard";
import LandingSection from "../../components/LandingSection";

const useMockData = false;
const mockEvents = [
  {
    id: 1,
    title: "Mock Event A",
    summary: "Happening now . This event will improve your AC and EC!! it is a both books and art tags! good experience for you ",
    time: "2025-03-28T10:00:00Z",
    endTime: "2025-04-10T23:59:59Z",
    image: require("../../assets/todayevent1.png"),
    location: "Library",
    description: "Come and join mock event A! ",
    tags: ["Books", "Art"],
    rewards: {
      AC: 5,
      EC: 10
    },
    participated: true,
    organizer: "Music Club", 

  },
  {
    id: 2,
    title: "Mock Event B",
    summary: "Happening now",
    time: "2025-03-29T10:00:00Z",
    endTime: "2025-04-11T23:59:59Z",
    image: require("../../assets/todayevent2.png"),
    location: "Library",
    description: "Come and join mock event B!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 },
    participated: true, 
    organizer: "secondbook",
  },
  {
    id: 3,
    title: "Mock Event 3",
    summary: "Happening now",
    time: "2025-03-30T10:00:00Z",
    endTime: "2025-04-12T23:59:59Z",
    image: require("../../assets/todayevent3.png"),
    location: "Library",
    description: "Come and join mock event 3!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 , "NP":1, "PR":2 },
    participated: true,
    organizer: "Music Club", 
  },
  {
    id: 4,
    title: "Mock Event 4",
    summary: "Happening now",
    time: "2025-04-11T10:00:00Z",
    endTime: "2025-04-23T23:59:59Z",
    image: require("../../assets/upevent1.png"),
    location: "Library",
    description: "Come and join mock event 4!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 },
    participated: true,
    organizer: "Music Club", 
  },
  {
    id: 5,
    title: "Mock Event 5",
    summary: "Happening now IAM MCOK EVENT 5 and come on to have a look!!",
    time: "2025-04-15T10:00:00Z",
    endTime: "2025-04-26T23:59:59Z",
    image: require("../../assets/upevent2.png"),
    location: "Library",
    description: "Come and join mock event B!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 }
  },
  {
    id: 6,
    title: "Mock Event 6",
    summary: "Happening now IAM MCOK EVENT SIX and come on to have a look!!",
    time: "2025-04-19T10:00:00Z",
    endTime: "2025-04-26T23:59:59Z",
    image: require("../../assets/upevent3.png"),
    location: "Library",
    description: "Come and join mock event 6!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 }
  },

  {
    id: 7,
    title: "Mock Event 7",
    summary: "Up next",
    time: "2025-04-15T12:00:00Z",
    endTime: "2025-04-15T14:00:00Z",
    image: "",
    location: "Hall",
    description: "Coming soon",
    tags: ["Music"],
    rewards: { "AC": 0, "EC": 7, "SM": 3 },
    participated: true,
    organizer: "Music Club", 
  },

  {
    id: 8,
    title: "Mock Event D",
    summary: "Up next",
    time: "2025-04-15T12:00:00Z",
    endTime: "2025-04-15T14:00:00Z",
    image: require("../../assets/pastevent1.png"),
    location: "Hall",
    description: "Came already",
    tags: ["Music"],
    rewards: { "EC": 8, "SM": 8 },
    participated: true,
    organizer: "Music Club", 
  },

  {
    id: 9,
    title: "Mock Event 8",
    summary: "Up next",
    time: "2025-04-07T12:00:00Z",
    endTime: "2025-04-11T14:00:00Z",
    image: require("../../assets/current8.png"),
    location: "Hall",
    description: "Came already",
    tags: ["Music"],
    rewards: { "EC": 8, "SM": 8 },
    participated: true,
    organizer: "Music Club", 
  }
]


function EventPopup({ title, events, onClose, page, setPage }) {
  const pageSize = 10;
  const totalPages = Math.ceil(events.length / pageSize);
  const paginatedEvents = events.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div
        className="popup-content"
        style={{
          padding: "32px 40px",
          position: "relative",
          width: "90%",
          maxWidth: "1600px",
          margin: "40px auto",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          Close
        </Button>

        <h2 style={{ marginBottom: "20px" }}>{title}</h2>

        {/* ✅ 用 MUI Grid 均匀分配每行最多5个卡片 */}
        <Grid container spacing={2} justifyContent="flex-start">
          {paginatedEvents.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4} lg={2.4}>
              <Link
                to={`/event/${event.id}`}
                onClick={() => localStorage.setItem("eventDetail", JSON.stringify(event))}
                style={{ textDecoration: "none" }}
              >
                <EventCard
                  image={event.image}
                  title={event.title}
                  summary={event.summary}
                  time={event.time}
                  endTime={event.endTime}
                  location={event.location}
                  tags={event.tags}
                  variant="popup"
                />
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* ✅ 分页器 */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

function MainHomePage() {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showCurrentPopup, setShowCurrentPopup] = useState(false);
  const [showUpcomingPopup, setShowUpcomingPopup] = useState(false);
  const [showPastPopup, setShowPastPopup] = useState(false);
  const [showRecommendPopup, setShowRecommendPopup] = useState(false);
  const [pastPage, setPastPage] = useState(1);
  const navigate = useNavigate();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  
  /*useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginAlert(true); // 显示提示
      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2秒后跳转
    }
  }, []);
  */

  const shortcutsData = [
    { name: "Schedule", icon: <LuCalendarCheck />, path: "/schedule/today" },
    // { name: "You might like", icon: <FiSunset />, path: "#", onClick: () => setShowRecommendPopup(true)},
    { name: "Explore", icon: <BiHappyHeartEyes />, path: "#", onClick: () => navigate("/events") },
  ];


  const fetchEventsByFilter = async (filterType, page = 1) => {
    try {
      const res = await fetch(`http://localhost:7000/event_list?filter=${filterType}&page=${page}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();

      const IMAGE_BASE_URL = "http://localhost:7000";
      const categories = ["AC", "AP", "CT", "EC", "EI", "LT", "NP", "PM", "PR", "SM"];

      return (data.events || []).map(event => {
        const rewards = {};
        categories.forEach(cat => {
          rewards[cat] = Number(event[cat] || 0);
        });

        return {
          id: event.eventID,
          title: event.name,
          summary: event.summary,
          time: event.startTime,
          endTime: event.endTime,
          location: event.location,
          description: event.description,
          image: event.image && event.image.trim() !== ""
            ? `http://localhost:7000${event.image}`
            : "/WhatsOnLogo.png",
          tags: event.tags ? event.tags.split(",") : [],
          rewards
        };
      });

    } catch (error) {
      console.error(`❌ Failed to fetch ${filterType} events:`, error);
      return []; // 返回空数组，避免 useEffect 设置 null 报错
    }
  };

  //用户参加历史过的活动
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
    SM: "Self-Motivation & Initiative",
  };

  const fetchMyEvents = async (page = 1) => {
    try {
      const res = await fetch(`http://localhost:7000/my_event?filter=previous&page=${page}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
  
      return (data.events || []).map(event => {
        const rewards = {};
        for (const key in event) {
          if (skillMap[key]) {
            rewards[skillMap[key]] = Number(event[key] || 0);
          }
        }

        return {
          id: event.eventID,
          title: event.name,
          time: event.startTime,
          endTime: event.endTime,
          location: event.location,
          summary: event.summary,
          image: event.image && event.image.trim() !== ""
            ? `http://localhost:7000${event.image}`
            : "/WhatsOnLogo.png",
          tags: [event.tag || "Attended"],
          rewards, 
        };
      });
    } catch (err) {
      console.error(" Failed to fetch my attended events:", err);
      return [];
    }
  };

  useEffect(() => {
    const now = new Date();
    if (useMockData) {
      const current = [];
      const upcoming = [];
      const past = [];

      mockEvents.forEach(event => {
        const start = new Date(event.time);
        const end = new Date(event.endTime);
        if (start <= now && end >= now) {
          current.push(event);
        } else if (start > now) {
          upcoming.push(event);
        } else if (event.participated) {
          past.push(event); // 只加入参加过的历史活动
        }
      });

      setCurrentEvents(current);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } else {
      fetchEventsByFilter("current").then(setCurrentEvents);
      fetchEventsByFilter("upcoming").then(setUpcomingEvents);
      //fetchEventsByFilter("previous", pastPage).then(setPastEvents);
      fetchMyEvents().then(setPastEvents);  // 👈 改这里
    }
  }, [pastPage]);

  return (
    <>
      <Header />

      <LandingSection />
      <div className="homepage" id="event-section" sx={{ background: "#e6f4e6", minHeight: "100vh" }}>
      <Container
          maxWidth={false}
          sx={{
            px: { xs: 2, sm: 4, md: 8, xl: 15 }, // ✅ 左右padding适配不同屏幕
            maxWidth: "1800px", // ✅ 给大屏限制一个最大宽度
            mx: "auto" // ✅ 居中显示
          }}
        >
          {/* Shortcuts */}
          <Stack direction="row" spacing={1} justifyContent="center" mb={6}>
            {shortcutsData.map((s, idx) => (
              <Grid item xs={12} sm={4} key={idx} mt={8}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    color: "white",
                    bgcolor: "#235858",
                    height: 80,
                    px: 2,
                    maxWidth: 340,
                    minWidth: 290,
                    textTransform: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    borderRadius: 1,
                    transition: "all 0.3s ease",
                    '&:hover': {
                      backgroundColor: "#a8e847",
                      transform: "scale(1.03)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                    }
                  }}
                  onClick={() => s.path !== "#" ? window.location.href = s.path : s.onClick()}
                >
                  <Stack direction="column" alignItems="center" spacing={0.5}>
                    <Box sx={{ fontSize: 28 }}>{s.icon}</Box>
                    {s.name}
                  </Stack>

                </Button>
              </Grid>
            ))}
          </Stack>

          {/* only past Events Section */}
          <Typography variant="h4" fontWeight="bold" textAlign="center" margin={6}>My Past Events</Typography>
          <Grid container spacing={2} rowSpacing={1}>
            {pastEvents.map(event => (
              <Grid item key={event.id} xs={12} sm={6} lg={6} mb={8}>
                <Link to={`/event/${event.id}`} style={{ textDecoration: "none" }} onClick={() => localStorage.setItem("eventDetail", JSON.stringify(event))}>
                  <PastEventCard
                    image={event.image}
                    title={event.title}
                    summary={event.summary}
                    time={event.time}
                    endtime={event.endTime}
                    location={event.location}
                    tags={event.tags}
                    rewards={event.rewards}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>

          {/* Upcoming Events Section 
        <Typography variant="h4" fontWeight="bold" textAlign="center"  mt={5} margin={6}>Upcoming Events
        <Grid container spacing={2} rowSpacing={5}>
          {upcomingEvents.map(event => (
            <Grid item key={event.id} xs={12} sm={6} md={4} lg={3} mb={8}>
              <Link to={`/event/${event.id}`} style={{ textDecoration: "none" }} onClick={() => localStorage.setItem("eventDetail", JSON.stringify(event))}>
              <EventCard
                image={event.image}
                title={event.title}
                summary={event.summary}
                time={event.time}
                endTime={event.endTime}   
                location={event.location}
                tags={event.tags}
                variant="popup"
              />
              </Link>
            </Grid>
          ))}
        </Grid> */}
        </Container>

        {/* Popups */}
        {showCurrentPopup && <EventPopup title="All Current Events" events={currentEvents} onClose={() => setShowCurrentPopup(false)} page={1} setPage={() => { }} />}
        {showUpcomingPopup && <EventPopup title="All Upcoming Events" events={upcomingEvents} onClose={() => setShowUpcomingPopup(false)} page={1} setPage={() => { }} />}
        {showRecommendPopup && <EventPopup title="Recommended Events" events={mockEvents.slice(0, 6)} onClose={() => setShowRecommendPopup(false)} page={1} setPage={() => { }} />}
        {showPastPopup && <EventPopup title="All Past Events" events={pastEvents} onClose={() => setShowPastPopup(false)} page={pastPage} setPage={setPastPage} />}


      </div>
      <Footer />

      <Snackbar
        open={showLoginAlert}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error"  sx={{ width: "100%" }}>
          Please login first.
        </Alert>
      </Snackbar>
      </>
  );

}

export default MainHomePage;