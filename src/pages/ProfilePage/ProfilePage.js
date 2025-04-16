import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { IoPersonCircleOutline } from "react-icons/io5";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { LuCalendarCheck } from "react-icons/lu";
import RedeemIcon from '@mui/icons-material/Redeem';
import { AiOutlineRadarChart } from "react-icons/ai";
import { Box, Typography, Button } from "@mui/material";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const shortcutsData = [
  { name: "Event & Reward History", icon: <EmojiEventsIcon />, path: "/reward-history" },
  { name: "Event Schedule", icon: <LuCalendarCheck />, path: "/schedule/today" },
  { name: "Redeem Rewards", icon: <RedeemIcon />, path: "/redeem" },
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
          skillScores: {
            "Effective Communication": 8,
            "Leadership & Team Management": 6,
            "Problem-Solving": 7,
            "Project Management": 5,
            "Networking & Relationship-Building": 4,
            "Cross-Cultural Collaboration": 6,
            "Creativity & Strategic Thinking": 9,
            "Adaptability": 7,
            "Negotiation & Persuasion": 5,
          },
          coachAnalysis:
            "You're a strong communicator with great creative thinking skills, which will take you far in your career! Keep building your analytical and negotiation abilities, and you'll become an even more well-rounded and influential professional. Keep pushing forward!",
        });
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  if (!userData) return <div>Loading...</div>;

  const skillLabels = Object.keys(userData.skillScores || {});
  const skillValues = Object.values(userData.skillScores || {});

  const chartData = {
    labels: skillLabels,
    datasets: [
      {
        label: "Your Skill Levels",
        data: skillValues,
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 206, 86, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 206, 86, 1)",
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 10,
        angleLines: {
          display: true,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="profile-page">
      <Header>
        <div className="header-right-logout">
          <button className="logout-button" onClick={handleLogout}>Log out</button>
        </div>
      </Header>
      <div className="profile-container">
        {/* 左侧信息 */}
        <div className="left-profile" style={{ width: "30%" }}>
          <div className="avatar" style={{ marginBottom: "10px" }}>
            <IoPersonCircleOutline className="avatar-icon" style={{ fontSize: "120px" }} />
          </div>
          <div className="arcmember-box">
            {userData.isArcMember === "1" ? "ArcMember" : "Guest"}
          </div>
          <div className="left-profile-info" style={{ marginTop: "20px", fontSize: "14px", lineHeight: "1.6" }}>
            <div><strong>ID:</strong> {userData.studentID}</div>
            <div><strong>Role:</strong> {userData.role}</div>
            <div><strong>Name:</strong> {userData.name}</div>
            <div><strong>Email:</strong> {userData.email}</div>
            <div><strong>Faculty:</strong> {userData.faculty}</div>
            <div><strong>Degree:</strong> {userData.degree}</div>
            <div><strong>Graduation Year:</strong> {userData.graduationYear}</div>
          </div>
          <div className="brief-record" style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
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

        {/* 右侧内容：雷达图 + 快捷方式 */}
        <div className="right-profile">
          {/* Career Coach Section 放顶部 */}
          <Box className="career-coach-box" p={3} borderRadius={2} boxShadow={2} bgcolor="white">
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Career Coach
            </Typography>
            <Box height={400}>
              <Radar data={chartData} options={chartOptions} />
            </Box>
            <Typography variant="body1" mt={2}>
              {userData.coachAnalysis}
            </Typography>
          </Box>

          {/* 快捷方式按钮放底部 */}
          <div className="profile-shortcuts" style={{ flexWrap: "nowrap", justifyContent: "space-between", marginTop: "30px" }}>
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
