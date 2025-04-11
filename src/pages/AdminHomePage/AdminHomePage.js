import React, { useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import "./AdminHomePage.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import NewEventForm from "../../components/Admin/NewEventForm";
import NewAnnoucementForm from "../../components/Admin/NewAnnouncementForm";
import EventListTable from "../../components/Admin/EventList";

import { Box,Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UserListTable from "../../components/Admin/UserList";


function Placeholder({ text }) {
  return (
    <Box p={3}>
      <Typography variant="h6">{text}</Typography>
    </Box>
  );
}

function AdminHomePage() {
  const location = useLocation();
  const [expandedTab, setExpandedTab] = useState("");

  const handleTabClick = (tab) => {
    setExpandedTab(expandedTab === tab ? "" : tab);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="tabs">
          {/* Event Management */}
          <div>
            <div className="tab-header" onClick={() => handleTabClick("event")}>
              <ExpandMoreIcon className={expandedTab === "event" ? "expand-icon expanded" : "expand-icon"} />
              Event Management
            </div>
            {expandedTab === "event" && (
              <div className="tab-children">
                <Link
                  to="/admin/new-event"
                  className={location.pathname === "/admin/new-event" ? "active" : ""}
                >
                  Create New Event
                </Link>
                <Link
                  to="/admin/event-list"
                  className={location.pathname === "/admin/event-list" ? "active" : ""}
                >
                  Event List
                </Link>
              </div>
            )}
          </div>

          {/* User Management */}
          <div>
            <div className="tab-header" onClick={() => handleTabClick("user")}>
              <ExpandMoreIcon className={expandedTab === "user" ? "expand-icon expanded" : "expand-icon"} />
              User Management
            </div>
            {expandedTab === "user" && (
              <div className="tab-children">
                <Link
                  to="/admin/user-list"
                  className={location.pathname === "/admin/user-list" ? "active" : ""}
                >
                  User List
                </Link>
              </div>
            )}
          </div>

          {/* Announcement Management */}
          <div>
            <div className="tab-header" onClick={() => handleTabClick("announcement")}>
              <ExpandMoreIcon className={expandedTab === "announcement" ? "expand-icon expanded" : "expand-icon"} />
              Announcement Management
            </div>
            {expandedTab === "announcement" && (
              <div className="tab-children">
                <Link
                  to="/admin/new-announcement"
                  className={location.pathname === "/admin/new-announcement" ? "active" : ""}
                >
                  Create New Announcement
                </Link>
                <Link
                  to="/admin/announcement-list"
                  className={location.pathname === "/admin/announcement-list" ? "active" : ""}
                >
                  Announcement List
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="routes">
          <Routes>
            <Route path="" element={<Placeholder text="Please select an option from the sidebar." />} />
            <Route path="new-event" element={<NewEventForm />} />

            <Route path="new-announcement" element={<NewAnnoucementForm />} />
            <Route path="event-list" element={<EventListTable />} />
            <Route path="user-list" element={<UserListTable />} />
            <Route path="manage-announcement" element={<Placeholder text="Edit or remove announcements." />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminHomePage;