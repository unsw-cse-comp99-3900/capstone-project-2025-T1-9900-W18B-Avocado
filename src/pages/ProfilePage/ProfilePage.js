import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FiSunset } from "react-icons/fi";
import { LuCalendarCheck } from "react-icons/lu";
import { LiaMedalSolid } from "react-icons/lia";
import { AiOutlineRadarChart } from "react-icons/ai";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const shortcutsData = [
  { name: "Past Event", icon: <FiSunset />, path: "/reward-history" },
  { name: "Event Schedule", icon: <LuCalendarCheck />, path: "/schedule/today" },
  { name: "My Rewards", icon: <LiaMedalSolid />, path: "/my-rewards" },
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
        console.error("Failed to obtain user information:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    // localStorage.removeItem("token");
    navigate("/login");
  };

  if (!userData) return <div>加载中...</div>;

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        {/* 左侧：头像 + 记录 */}
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
              <div className="brief-number">3</div> {/* 可改为动态 */}
            </div>
            <div className="brief-container">
              <div>My Reward</div>
              <div className="brief-reward">
                <div className="brief-number">10</div> {/* 可接 reward 字段 */}
                <div>pts</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：个人信息 */}
        <div className="right-profile">
          <div className="profile-details">
            <h2>My Profile</h2>
            <div className="detail-container">
              <div><strong>ID:</strong> {userData.studentID}</div>
              <div><strong>Role:</strong> {userData.role}</div>
            </div>
            <div className="detail-container">
              <div><strong>Name:</strong> {userData.name}</div>
              <div><strong>Email:</strong> {userData.email}</div>
            </div>
            <div className="detail-container">
              <div><strong>Faculty:</strong> {userData.faculty}</div>
              <div><strong>Degree:</strong> {userData.degree}</div>
              <div><strong>Graduation Year:</strong> {userData.graduationYear}</div>
            </div>

            <button className="logout-button" onClick={handleLogout}>Log out</button>
          </div>

          {/* 快捷方式 */}
          <div className="profile-shortcuts">
            {shortcutsData.map((shortcut, index) => (
              <Link to={shortcut.path} key={index} className="shortcut-link">
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
