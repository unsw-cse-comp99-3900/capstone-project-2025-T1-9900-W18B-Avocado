import React from "react";
import { Link } from "react-router-dom";
import { LuCalendarCheck } from "react-icons/lu";
import { BiHappyHeartEyes } from "react-icons/bi";
import { FiSunset } from "react-icons/fi";
import "./MainHomePage.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import event1 from "../../assets/todayevent1.png";
import event2 from "../../assets/todayevent2.png";
import event3 from "../../assets/todayevent3.png";
import event4 from "../../assets/upevent1.png";
import event5 from "../../assets/upevent2.png";
import event6 from "../../assets/upevent3.png";

const shortcutsData = [
  { name: "Schedule", summary: "Check your attending events", icon: <LuCalendarCheck />, path: "/schedule" },
  { name: "You might like...", summary: "Events recommended for you", icon: <BiHappyHeartEyes />, path: "/recommend-events" },
  { name: "Past Events", summary: "Explore previous events", icon: <FiSunset />, path: "/past-events" },
];

export const todaysEventsData = [
  {
    id: 1,
    title: "Go Rumbling",
    summary: "Create a better world",
    time: "March 8, 2025 | 12:00 PM",
    image: event1,
  },
  {
    id: 2,
    title: "Live Band Concert ",
    summary: "Enjoy live performances",
    time: "March 8, 2025 | 3:00 PM",
    image: event2,
  },
  {
    id: 3,
    title: "Pokémon Battle ",
    summary: "Find strongest Pokémon",
    time: "March 8, 2025 | 5:00 PM",
    image: event3,
  },
];

export const upcomingEventsData = [
  {
    id: 4,
    title: "Book Club Meeting",
    summary: "Talk about great books",
    time: "March 20, 2025 | 10:00 AM",
    image: event4,
  },
  {
    id: 5,
    title: "Music Jam Section",
    summary: "Play and enjoy music",
    time: "March 22, 2025 | 2:00 PM",
    image: event5,
  },
  {
    id: 6,
    title: "Food Festival",
    summary: "Taste amazing food",
    time: "March 25, 2025 | 6:00 PM",
    image: event6,
  },
];

function Home() {
  return (
    <div className="content">
      <div className="left-shortcuts">
        {shortcutsData.map((shortcut, index) => (
          <Link to={shortcut.path} key={index} className="shortcuts">
            <div className="shortcut-name">{shortcut.name}</div>
            <div className="shortcut-summary">{shortcut.summary}</div>
            <div className="shortcut-icon">{shortcut.icon}</div>
          </Link>
        ))}
      </div>
      <div className="right-cards">
        <div className="cards-container">
          <div className="cards-header">
            <div className="event-module">Today's Events</div>
            <Link to="/todays-events" className="find-more">Find More</Link>
          </div>
          <div className="event-cards">
            {todaysEventsData.map((event) => (
              <Link to={`/event/${event.id}`} key={event.id} className="event-card">
                <img src={event.image} alt={event.title} className="event-image" />
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-summary">{event.summary}</div>
                  <div className="event-time">{event.time}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="cards-container">
          <div className="cards-header">
            <div className="event-module">Upcoming Events</div>
            <Link to="/upcoming-events" className="find-more">Find More</Link>
          </div>
          <div className="event-cards">
            {upcomingEventsData.map((event) => (
              <Link to={`/event/${event.id}`} key={event.id} className="event-card">
                <img src={event.image} alt={event.title} className="event-image" />
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-summary">{event.summary}</div>
                  <div className="event-time">{event.time}</div>
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
  return (
    <div className="homepage">
      <Header />
      <Home />
      <Footer />
    </div>
  );
}

export default MainHomePage;
