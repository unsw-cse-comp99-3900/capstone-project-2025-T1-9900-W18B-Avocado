import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LuCalendarCheck } from "react-icons/lu";
import { BiHappyHeartEyes } from "react-icons/bi";
import { FiSunset } from "react-icons/fi";
import "./MainHomePage.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Button, Pagination ,Grid, Divider , Box, Typography} from "@mui/material";
import EventCard from "../../components/EventCard"; 


const useMockData = false;
const mockEvents = [
  {
    id: 1,
    title: "Mock Event A",
    summary: "Happening now . This event will improve your AC and EC!! it is a both books and art tags! good experience for you ",
    time: "2025-03-28T10:00:00Z",
    end_time: "2025-04-10T23:59:59Z",
    image: require("../../assets/todayevent1.png"),
    location: "Library",
    description: "Come and join mock event A! ",
    tags: ["Books", "Art"],
    rewards:  10
    
  },
  {
    id: 2,
    title: "Mock Event B",
    summary: "Happening now",
    time: "2025-03-29T10:00:00Z",
    end_time: "2025-04-10T23:59:59Z",
    image: require("../../assets/todayevent2.png"),
    location: "Library",
    description: "Come and join mock event B!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 }
  },
  {
    id: 3,
    title: "Mock Event 3",
    summary: "Happening now",
    time: "2025-03-30T10:00:00Z",
    end_time: "2025-04-11T23:59:59Z",
    image: require("../../assets/todayevent3.png"),
    location: "Library",
    description: "Come and join mock event 3!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 }
  },
  {
    id: 4,
    title: "Mock Event 4",
    summary: "Happening now",
    time: "2025-04-11T10:00:00Z",
    end_time: "2025-04-18T23:59:59Z",
    image: require("../../assets/upevent1.png"),
    location: "Library",
    description: "Come and join mock event 4!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 }
  },
  {
    id: 5,
    title: "Mock Event 5",
    summary: "Happening now IAM MCOK EVENT 5 and come on to have a look!!",
    time: "2025-04-12T10:00:00Z",
    end_time: "2025-04-26T23:59:59Z",
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
    end_time: "2025-04-26T23:59:59Z",
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
    time: "2025-04-07T12:00:00Z",
    end_time: "2025-04-08T14:00:00Z",
    image: "",
    location: "Hall",
    description: "Coming soon",
    tags: ["Music"],
    rewards: { "AC": 0, "EC": 7, "SM": 3 }
  },

  {
    id: 8,
    title: "Mock Event D",
    summary: "Up next",
    time: "2025-04-10T12:00:00Z",
    end_time: "2025-04-11T14:00:00Z",
    image: require("../../assets/pastevent1.png"),
    location: "Hall",
    description: "Came already",
    tags: ["Music"],
    rewards: { "EC": 8, "SM": 8 }
  },

  {
    id: 9,
    title: "Mock Event 8",
    summary: "Up next",
    time: "2025-04-07T12:00:00Z",
    end_time: "2025-04-11T14:00:00Z",
    image: require("../../assets/current8.png"),
    location: "Hall",
    description: "Came already",
    tags: ["Music"],
    rewards: { "EC": 8, "SM": 8 }
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
                  endTime={event.end_time}
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

function Home({ currentEvents, upcomingEvents, onCurrentFindMore, onUpcomingFindMore, onPastFindMore, shortcutsData }) {
  return (
    <div className="content">
      <div className="left-shortcuts">
        {shortcutsData.map((shortcut, index) => {
          const content = (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                borderRadius: 2,
                transition: "all 0.3s ease",
                cursor: "pointer",
                height: "100%",
                
              }}
            >
              <Box sx={{ fontSize: 48, color: "#1976d2", mb: 1 }}>{shortcut.icon}</Box>
          
              <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.25rem", mb: 1, "&:hover": { color: "#1565c0" } }}>
                {shortcut.name}
              </Typography>
          
              <Typography variant="body2" sx={{ fontSize: "1rem", color: "#555", textAlign: "center" }}>
                {shortcut.summary}
              </Typography>
            </Box>
          );

          return shortcut.path && shortcut.path !== "#" ? (
            <Link to={shortcut.path} key={index} className="shortcuts">
              {content}
            </Link>
          ) : (
            <div key={index} className="shortcuts" onClick={shortcut.onClick}>
              {content}
            </div>
          );
        })}
      </div>

      <div className="right-cards">
        {/* Current Events */}
        <div className="cards-container">
          <div className="cards-header">
            <div className="event-module">Current Events</div>
            <Button variant="outlined" size="small" onClick={onCurrentFindMore}>
              Find More
            </Button>
          </div>
          <Grid container spacing={2} justifyContent="flex-start" sx={{ padding: '0 16px' }}>
            {currentEvents.slice(0, 5).map(event => (
              <Grid item key={event.id} xs={12} sm={6} md={4} lg={2.4}>
                <Link to={`/event/${event.id}`} style={{ textDecoration: "none" }} onClick={() => localStorage.setItem("eventDetail", JSON.stringify(event))}>
                <EventCard
                  image={event.image}
                  title={event.title}
                  summary={event.summary}
                  time={event.time}
                  endTime={event.end_time}
                  location={event.location}
                  tags={event.tags}
                  variant="popup"
                />
                </Link>
              </Grid>
            ))}
          </Grid>
        </div>

        <div
          className="cards-container"
          style={{
            borderTop: "2px solid #e0e0e0",

            paddingLeft: "24px",
            paddingRight: "24px"
          }}
        >

        {/* Upcoming Events */}
        <div className="cards-container">
          <div className="cards-header">
            <div className="event-module">Upcoming Events</div>
            <Button variant="outlined" size="small" onClick={onUpcomingFindMore}>
              Find More
            </Button>
          </div>
          <Grid container spacing={2} justifyContent="flex-start" sx={{ padding: '0 16px' }}>
            {upcomingEvents.slice(0, 5).map(event => (
              <Grid item key={event.id} xs={12} sm={6} md={4} lg={2.4}>
                <Link to={`/event/${event.id}`} style={{ textDecoration: "none" }} onClick={() => localStorage.setItem("eventDetail", JSON.stringify(event))}>
                <EventCard
                  image={event.image}
                  title={event.title}
                  summary={event.summary}
                  time={event.time}
                  endTime={event.end_time}
                  location={event.location}
                  tags={event.tags}
                  variant="popup"
                />
                </Link>
              </Grid>
            ))}
          </Grid>
        </div>
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

  const shortcutsData = [
    { name: "Schedule", summary: "Check your attending events", icon: <LuCalendarCheck />, path: "/schedule/today" },
    { name: "You might like...", summary: "Events recommended for you", icon: <BiHappyHeartEyes />, path: "#", onClick: () => setShowRecommendPopup(true)},
    { name: "Past Events", summary: "Explore previous events", icon: <FiSunset />, path: "#", onClick: () => setShowPastPopup(true) }, 
  ];

  const fetchEventsByFilter = async (filterType, page = 1) => {
    try {
      const res = await fetch(`http://localhost:7000/event_list?filter=${filterType}&page=${page}`);
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
          end_time: event.endTime,
          location: event.location,
          description: event.description,
          image: event.image && event.image.trim() !== "" 
            ? `${IMAGE_BASE_URL}${event.image}` 
            : "/logo.png",
          tags: event.tags ? event.tags.split(",") : [],
          rewards
        };
      });
  
    } catch (error) {
      console.error(`❌ Failed to fetch ${filterType} events:`, error);
      return []; // 返回空数组，避免 useEffect 设置 null 报错
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
        const end = new Date(event.end_time);
        if (start <= now && end >= now) {
          current.push(event);
        } else if (start > now) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      });
  
      setCurrentEvents(current);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } else{
      fetchEventsByFilter("current").then(setCurrentEvents);
      fetchEventsByFilter("upcoming").then(setUpcomingEvents);
      fetchEventsByFilter("previous", pastPage).then(setPastEvents);
    }
  }, [pastPage]);

  return (
    <div className="homepage">
      <Header />
      <Home
        currentEvents={currentEvents}
        upcomingEvents={upcomingEvents}
        onCurrentFindMore={() => setShowCurrentPopup(true)}
        onUpcomingFindMore={() => setShowUpcomingPopup(true)}
        onPastFindMore={() => setShowPastPopup(true)}
        shortcutsData={shortcutsData}
      />

      {showCurrentPopup && (
        <EventPopup
          title="All Current Events"
          events={currentEvents}
          onClose={() => setShowCurrentPopup(false)}
          page={1}
          setPage={() => {}}
        />
      )}

      {showUpcomingPopup && (
        <EventPopup
          title="All Upcoming Events"
          events={upcomingEvents}
          onClose={() => setShowUpcomingPopup(false)}
          page={1}
          setPage={() => {}}
        />
      )}

      {showRecommendPopup && (
        <EventPopup
          title="Recommended Events"
          events={mockEvents.slice(0, 6)} // 仅测试推荐用
          onClose={() => setShowRecommendPopup(false)}
          page={1}
          setPage={() => {}}
        />
      )}
      {showPastPopup && (
        <EventPopup
          title="All Past Events"
          events={pastEvents}
          onClose={() => setShowPastPopup(false)}
          page={pastPage}
          setPage={setPastPage}
        />
      )}

      <Footer />
    </div>
  );
}

export default MainHomePage;
