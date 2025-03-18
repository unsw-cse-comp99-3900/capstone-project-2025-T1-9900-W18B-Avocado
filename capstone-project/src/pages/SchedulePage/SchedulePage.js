import React from "react";
import { Link, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./SchedulePage.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const eventsData = {
  today: [
    { id: 1, name: "Cultural Mixer", start: "28/2/2025  10:00:00 pm", end: "1/3/2025  3:00:00 am", location: "Science Theatre"},
    { id: 2, name: "AI Workshop", start: "28/2/2025  6:00:00 pm", end: "28/2/2025  9:00:00 pm", location: "Kensington Hall"},
  ],
  upcoming: [
    { id: 3, name: "Wellness Retreat", start: "2/3/2025  10:00:00 pm", end: "3/3/2025  3:00:00 am", location: "Wellness Room"},
    { id: 4, name: "Art & Craft Workshop", start: "1/3/2025  10:00:00 pm", end: "2/3/2025  3:00:00 am", location: "Art Studio"},
  ],
  past: [
    { id: 5, name: "Startup Pitch Fest", start: "28/2/2025  12:00:00 pm", attendance: "67%" },
  ],
};

// 显示事件列表
function EventsList({ category }) {
  const eventList = eventsData[category] || [];
  return (
    <div className="events-list">
      {eventList.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <table className="events-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Time</th>
              {category !== "past" ? <th>End Time</th> : <th>Attendance</th>}
              {category !== "past" && <th>Location</th>}
              <th>Ticket</th>
            </tr>
          </thead>
          <tbody>
            {eventList.map((event) => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.start}</td>
                {category !== "past" ? (
                  <>
                    <td>{event.end}</td>
                    <td>{event.location}</td>
                  </>
                ) : (
                  <td>{event.attendance}</td>
                )}
                <td>
                  <button className="ticket-button">detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function SchedulePage() {
  const location = useLocation();

  return (
    <div>
      <Header />
      <div className="schedule-container">
        {/* 左侧选项卡 */}
        <div className="tabs">
          <Link to="/schedule/today" className={location.pathname === "/schedule/today" ? "active" : ""}>
            Today's Events
          </Link>
          <Link to="/schedule/upcoming" className={location.pathname === "/schedule/upcoming" ? "active" : ""}>
            Upcoming Events
          </Link>
          <Link to="/schedule/past" className={location.pathname === "/schedule/past" ? "active" : ""}>
            My Past Events
          </Link>
        </div>

        {/* 右侧活动详情 (动态路由) */}
        <Routes>
          {/* 默认跳转到 today's events */}
          <Route path="today" element={<EventsList category="today" />} />
          <Route path="upcoming" element={<EventsList category="upcoming" />} />
          <Route path="past" element={<EventsList category="past" />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default SchedulePage;
