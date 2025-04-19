import React, { useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import "./AdminHomePage.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import NewEventForm from "../../components/Admin/NewEventForm";
import NewNoticeForm from "../../components/Admin/NewNoticeForm";
import EventListTable from "../../components/Admin/EventList";
import UserListTable from "../../components/Admin/UserList";
import NoticeListTable from "../../components/Admin/NoticeList";


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

    const isTabActive = (tab) => {
        const map = {
            event: ["/admin/new-event", "/admin/event-list"],
            user: ["/admin/user-list"],
            notice: ["/admin/new-notice", "/admin/notice-list"],
        };
        return map[tab]?.some((path) => location.pathname === path);
    };

    return (
        <>
            <Header />
            <div className="admin-container">
                <div className="admin-tabs">
                    {/* Event Management */}
                    <div>
                        <div
                            className={`admin-tab-header ${expandedTab === "event" || isTabActive("event") ? "admin-expanded-parent" : ""
                                }`}
                            onClick={() => handleTabClick("event")}
                        >
                            <ExpandMoreIcon
                                className={
                                    expandedTab === "event" ? "admin-expand-icon expanded" : "admin-expand-icon"
                                }
                            />
                            Event Management
                        </div>

                        {expandedTab === "event" && (
                            <div className="admin-tab-children">
                                <Link
                                    to="/admin/new-event"
                                    className={location.pathname === "/admin/new-event" ? "admin-active" : ""}
                                >
                                    Create New Event
                                </Link>
                                <Link
                                    to="/admin/event-list"
                                    className={location.pathname === "/admin/event-list" ? "admin-active" : ""}
                                >
                                    Event List
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* User Management */}
                    <div>
                        <div className={`admin-tab-header ${expandedTab === "user" || isTabActive("user") ? "admin-expanded-parent" : ""}`}
                            onClick={() => handleTabClick("user")}>
                            <ExpandMoreIcon className={expandedTab === "user" ? "admin-expand-icon expanded" : "admin-expand-icon"} />
                            User Management
                        </div>
                        {expandedTab === "user" && (
                            <div className="admin-tab-children">
                                <Link
                                    to="/admin/user-list"
                                    className={location.pathname === "/admin/user-list" ? "admin-active" : ""}
                                >
                                    User List
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Notice Management */}
                    <div>
                        <div className={`admin-tab-header ${expandedTab === "notice" || isTabActive("notice") ? "admin-expanded-parent" : ""}`}
                            onClick={() => handleTabClick("notice")}>
                            <ExpandMoreIcon className={expandedTab === "notice" ? "admin-expand-icon expanded" : "admin-expand-icon"} />
                            Notice Management
                        </div>
                        {expandedTab === "notice" && (
                            <div className="admin-tab-children">
                                <Link
                                    to="/admin/new-notice"
                                    className={location.pathname === "/admin/new-notice" ? "admin-active" : ""}
                                >
                                    Create New Notice
                                </Link>
                                <Link
                                    to="/admin/notice-list"
                                    className={location.pathname === "/admin/notice-list" ? "admin-active" : ""}
                                >
                                    Notice List
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <div className="admin-routes">
                    <Routes>
                        <Route path="" element={<Placeholder text="Please select an option from the sidebar." />} />
                        <Route path="new-event" element={<NewEventForm />} />
                        <Route path="new-notice" element={<NewNoticeForm />} />
                        <Route path="event-list" element={<EventListTable />} />
                        <Route path="user-list" element={<UserListTable />} />
                        <Route path="notice-list" element={<NoticeListTable />} />
                    </Routes>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AdminHomePage;