import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FiSunset } from "react-icons/fi";
import { LuCalendarCheck } from "react-icons/lu";
import { FaGift } from "react-icons/fa";
import { AiOutlineRadarChart } from "react-icons/ai";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const shortcutsData = [
  { name: "Past Event", icon: <FiSunset />, path: "/reward-history" },
  { name: "Event Schedule", icon: <LuCalendarCheck />, path: "/schedule/today" },
  { name: "Redeem Rewards", icon: <FaGift />, path: "/my-rewards" },
  { name: "Career Coach", icon: <AiOutlineRadarChart />, path: "/career-coach" },
];

function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Network error or unauthenticated");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to obtain user information, loading mock data:", error);
        setUserData({
          studentID: "20251234",
          name: "Jane Doe",
          role: "Student",
          email: "janedoe@example.com",
          faculty: "Engineering",
          degree: "Master of Software Engineering",
          graduationYear: "2026",
          isArcMember: "1",
          reward: 45,
          eventHistory: [1, 2, 3, 4, 5],
        });
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <Header>
        <div className="header-right-logout">
          <button className="logout-button" onClick={handleLogout}>Log out</button>
        </div>
      </Header>
      <div className="profile-container">
        <div className="left-profile">
          <div className="avatar">
            <IoPersonCircleOutline className="avatar-icon" />
          </div>
          <div className="arcmember-box">
            {userData.isArcMember === "1" ? "ArcMember" : "Guest"}
          </div>
          <div className="brief-record">
            <div className="brief-container">
              <div>Event History</div>
              <div className="brief-number">{userData.eventHistory?.length || 0}</div>
            </div>
            <div className="brief-container">
              <div>My Reward</div>
              <div className="brief-reward">
                <div className="brief-number">{userData.reward || 0}</div>
                <div>pts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-profile">
          <div className="profile-details">
            <h2>My Profile</h2>
            <div className="profile-columns" style={{ justifyContent: "space-between" }}>
              <div className="profile-left-column">
                <div><strong>ID:</strong> {userData.studentID}</div>
                <div><strong>Role:</strong> {userData.role}</div>
                <div><strong>Name:</strong> {userData.name}</div>
                <div><strong>Email:</strong> {userData.email}</div>
              </div>
              <div className="profile-right-column" style={{ marginRight: "80px" }}>
                <div><strong>Faculty:</strong> {userData.faculty}</div>
                <div><strong>Degree:</strong> {userData.degree}</div>
                <div><strong>Graduation Year:</strong> {userData.graduationYear}</div>
              </div>
            </div>
          </div>

          <div className="profile-shortcuts" style={{ flexWrap: "nowrap", justifyContent: "space-between" }}>
            {shortcutsData.map((shortcut, index) => (
              <Link to={shortcut.path} key={index} className="shortcut-link" style={{ width: "22%" }}>
                <div className="shortcut-name">{shortcut.name}</div>
                <div className="shortcut-icon">{shortcut.icon}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;