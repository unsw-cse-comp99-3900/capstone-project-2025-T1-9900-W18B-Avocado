import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LuCalendarCheck } from "react-icons/lu";
import { BiHappyHeartEyes } from "react-icons/bi";
import { FiSunset } from "react-icons/fi";
import "./MainHomePage.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const useMockData = false;
const mockEvents = [
  {
    id: 1,
    title: "Mock Event A",
    summary: "Happening now",
    time: "2025-03-28T10:00:00Z",
    end_time: "2025-04-10T23:59:59Z",
    image: require("../../assets/todayevent1.png"),
    location: "Library",
    description: "Come and join mock event A!",
    tags: ["Books", "Art"],
    rewards:  10
    
  },
  {
    id: 2,
    title: "Mock Event B",
    summary: "Happening now",
    time: "2025-03-29T10:00:00Z",
    end_time: "2025-04-06T23:59:59Z",
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
    end_time: "2025-04-08T23:59:59Z",
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
    time: "2025-03-31T10:00:00Z",
    end_time: "2025-04-08T23:59:59Z",
    image: require("../../assets/todayevent1.png"),
    location: "Library",
    description: "Come and join mock event 4!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 }
  },
  {
    id: 5,
    title: "Mock Event 5",
    summary: "Happening now",
    time: "2025-03-29T10:00:00Z",
    end_time: "2025-04-06T23:59:59Z",
    image: require("../../assets/todayevent2.png"),
    location: "Library",
    description: "Come and join mock event B!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 }
  },
  {
    id: 6,
    title: "Mock Event 6",
    summary: "Happening now",
    time: "2025-03-29T10:00:00Z",
    end_time: "2025-04-06T23:59:59Z",
    image: require("../../assets/todayevent3.png"),
    location: "Library",
    description: "Come and join mock event 6!",
    tags: ["Books"],
    rewards: { "AC": 5, "EC": 10 }
  },

  {
    id: 7,
    title: "Mock Event C",
    summary: "Up next",
    time: "2025-04-06T12:00:00Z",
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
    time: "2025-04-01T12:00:00Z",
    end_time: "2025-04-02T14:00:00Z",
    image: "",
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
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>Close</button>
        <h2>{title}</h2>
        <div className="event-cards popup-grid">
          {paginatedEvents.map(event => (
            <Link to={`/event/${event.id}`} key={event.id} className="event-card popup-card"
                onClick={() => localStorage.setItem("eventDetail", JSON.stringify(event))}
            >
              <img
                src={event.image && event.image.trim() !== "" ? event.image : "/logo.png"}
                alt={event.title}
                className="event-image"
              />
              <div className="event-info">
                <div className="event-title">{event.title}</div>
                <div className="event-summary">{event.summary}</div>
                <div className="event-time">{new Date(event.time).toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="pagination-controls">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Previous</button>
          <span>Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}

function Home({ currentEvents, upcomingEvents, onCurrentFindMore, onUpcomingFindMore, onPastFindMore, shortcutsData  }) {
  return (
    <div className="content">
      <div className="left-shortcuts">
      {shortcutsData.map((shortcut, index) => {
        const content = (
          <>
            <div className="shortcut-name">{shortcut.name}</div>
            <div className="shortcut-summary">{shortcut.summary}</div>
            <div className="shortcut-icon">{shortcut.icon}</div>
          </>
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
            <button className="find-more" onClick={onCurrentFindMore}>Find More</button>
          </div>
          <div className="event-cards">
            {currentEvents.slice(0, 3).map(event => (
              <Link to={`/event/${event.id}`} key={event.id} className="event-card"
                onClick={() => localStorage.setItem("eventDetail", JSON.stringify(event))}
              >
                <img src={event.image || "/logo.png"} alt={event.title} className="event-image" />
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-summary">{event.summary}</div>
                  <div className="event-time">{new Date(event.time).toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="cards-container">
          <div className="cards-header">
            <div className="event-module">Upcoming Events</div>
            <button className="find-more" onClick={onUpcomingFindMore}>Find More</button>
          </div>
          <div className="event-cards">
            {upcomingEvents.slice(0, 3).map(event => (
              <Link to={`/event/${event.id}`} key={event.id} className="event-card"
                onClick={() => localStorage.setItem("eventDetail", JSON.stringify(event))}
              >
                <img src={event.image || "/logo.png"} alt={event.title} className="event-image" />
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-summary">{event.summary}</div>
                  <div className="event-time">{new Date(event.time).toLocaleString()}</div>
                </div>
              </Link>
            ))}
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
    const res = await fetch(`http://localhost:7000/event_list?filter=${filterType}&page=${page}`);
    const data = await res.json();

    const IMAGE_BASE_URL = "http://localhost:7000";

    return (data.events || []).map(event => {
      const categories = ["AC", "AP", "CT", "EC", "EI", "LT", "NP", "PM", "PR", "SM"];
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
