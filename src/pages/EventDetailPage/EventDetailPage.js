import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./EventDetailPage.css";
import { AiOutlineArrowLeft, AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { todaysEventsData, upcomingEventsData } from "../../pages/MainHomePage/MainHomePage";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";


function EventDetailPage() {
    const { id } = useParams();
    const numericId = parseInt(id, 10);
    const [event, setEvent] = useState(null);
    const [showRewards, setShowRewards] = useState(false);
    
    useEffect(() => {
        const allEvents = [...todaysEventsData, ...upcomingEventsData];
        const foundEvent = allEvents.find((e) => e.id === numericId);
        setEvent(foundEvent);
    }, [numericId]);
    

    if (!event) {
        return <h2>Loading...</h2>;
    }


    return (
        <div className="event-detail-page">
            <Header />

            <div className="event-detail-container">
                <Link to="/home" className="back-button">
                    <AiOutlineArrowLeft /> Back to Home
                </Link>

                <div className="event-layout">
                    <div className="event-image-container">
                        <div className="event-booking">Booking the event</div>
                        <img src={event.image} alt={event.title} className="event-image" />
                    </div>

                    {/* 右侧 - 活动详情 */}
                    <div className="event-info-container">
                        <h1 className="event-title">{event.title}</h1>
                        <p className="event-summary">{event.summary}</p>

                        {/* Tags */}
                        <div className="event-tags">
                            <span className="tag">Tag:Books</span>
                        </div>

                        {/* 活动详情 */}
                        <div className="event-meta">
                            <p><strong>📍 Location:</strong> {event.location || "TBD"}</p>
                            <p><AiOutlineClockCircle /> <strong>Date & Time:</strong> {event.time}</p>
                        </div>

                        {/* 详细描述 */}
                        <p className="event-description">{event.description || "Join us for a great event!"}</p>

                        {/* 奖励按钮 */}
                        <button className="rewards-button" onClick={() => setShowRewards(true)}>View Earnable Rewards</button>
                        </div>
                    </div>   

                <div className="attend-section">
                    <button className="attend-button">Attend</button>
                </div>

            
                {showRewards && (
                    <div className="rewards-popup">
                        <div className="rewards-content">
                            <h2>Earnable Rewards</h2>
                            <ul>
                            <li><strong>Category 1</strong>: 0 pts</li>
                            <li><strong>Category 2</strong>: 0 pts</li>
                            <li><strong>Category 3</strong>: 0 pts</li>
                            </ul>
                            <button className="close-button" onClick={() => setShowRewards(false)}>OK</button>
                        </div>
                    </div>
                )}
            </div>

            <Footer/>
        </div>
    
    );
    }

export default EventDetailPage;