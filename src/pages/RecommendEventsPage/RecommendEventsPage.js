import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar, Box, Typography, Chip, CircularProgress, Grid
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Bar } from "react-chartjs-2";
import EventCard from "../../components/EventCard";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Create initials from user name
function stringAvatar(name) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("");
  return {
    sx: {
      bgcolor: deepPurple[500],
      width: 100,
      height: 100,
      fontSize: 36,
    },
    children: initials.toUpperCase(),
  };
}

function RecommendEventsPage() {
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
        console.error("Failed to fetch profile, using mock data:", error);
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
          coachAnalysis: "You're showing strong engagement in tech fields! Try exploring more artistic or cultural events to expand your profile.",
        });
      }
    };

    fetchProfile();
  }, []);

  if (!userData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={80} />
      </Box>
    );
  }

  // Tag preference mock data
  const tagLabels = [
    "Wellness", "Networking", "Games", "Startups", "Technology", "Entrepreneurship",
    "Careers", "Sustainability", "Tech", "Books", "Art", "Coding", "Debate",
    "Movies", "Music", "Social", "Cultural", "Foods", "Volunteering"
  ];
  const tagValues = [5, 7, 3, 2, 6, 4, 8, 1, 6, 2, 3, 9, 2, 4, 5, 3, 2, 1, 2];

  const maxIndex = tagValues.indexOf(Math.max(...tagValues));
  const minIndex = tagValues.indexOf(Math.min(...tagValues));
  const mostPreferredTag = tagLabels[maxIndex];
  const leastPreferredTag = tagLabels[minIndex];

  const mockTopTagEvents = [
    { id: 1, title: `${mostPreferredTag} Event A`, description: "Top event related to your favorite tag.", image: "/static/uploads/sample.jpg" },
    { id: 2, title: `${mostPreferredTag} Event B`, description: "Another great event you'll enjoy.", image: "/static/uploads/sample.jpg" },
    { id: 3, title: `${mostPreferredTag} Event C`, description: "Don't miss this one!", image: "/static/uploads/sample.jpg" },
  ];

  const mockLeastTagEvents = [
    { id: 4, title: `${leastPreferredTag} Event X`, description: "Expand your interest with this event.", image: "/static/uploads/sample.jpg" },
    { id: 5, title: `${leastPreferredTag} Event Y`, description: "Explore something new.", image: "/static/uploads/sample.jpg" },
    { id: 6, title: `${leastPreferredTag} Event Z`, description: "A refreshing new experience awaits!", image: "/static/uploads/sample.jpg" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <Header>
        <div className="header-right-logout">
          <button className="logout-button" onClick={handleLogout}>Log out</button>
        </div>
      </Header>

      <div className="profile-container" style={{ display: "flex", alignItems: "stretch" }}>
        {/* Left Profile */}
        <div className="left-profile" style={{ width: "30%" }}>
          <div className="avatar" style={{ marginBottom: "10px" }}>
            <Avatar {...stringAvatar(userData.name || 'U N')} />
          </div>
          <Box mt={1}>
            <Chip
              label={userData.isArcMember === "1" ? "Arc Member" : "Not Arc Member"}
              color={userData.isArcMember === "1" ? "success" : "default"}
              variant={userData.isArcMember === "1" ? "filled" : "outlined"}
              sx={{ fontWeight: "bold", fontSize: "0.85rem" }}
            />
          </Box>
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

        {/* Right Chart Area */}
        <div className="right-profile" style={{ flex: 1 }}>
          <Box className="career-coach-box" p={3} borderRadius={2} boxShadow={2} bgcolor="white" sx={{ height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Tag Preference Chart
            </Typography>
            <Box height={400}>
              <Bar
                data={{
                  labels: tagLabels,
                  datasets: [{
                    label: 'Preference',
                    data: tagValues,
                    backgroundColor: [
                      '#81c784', '#4db6ac', '#64b5f6', '#ba68c8', '#f06292',
                      '#ff8a65', '#ffd54f', '#a1887f', '#90a4ae', '#7986cb',
                      '#aed581', '#4dd0e1', '#4fc3f7', '#ce93d8', '#f48fb1',
                      '#ffb74d', '#fff176', '#bcaaa4', '#b0bec5'
                    ],
                    borderRadius: 6
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: '#ffffff',
                      titleColor: '#000',
                      bodyColor: '#333',
                    }
                  },
                  scales: {
                    y: { beginAtZero: true, grid: { color: '#eee' } },
                    x: { ticks: { maxRotation: 90, minRotation: 60 }, grid: { display: false } }
                  }
                }}
              />
            </Box>
            <Typography variant="body1" mt={2}>
              {userData.coachAnalysis}
            </Typography>
          </Box>
        </div>
      </div>

      {/* Bottom Recommendations */}
      <div style={{ padding: "20px" }}>
        <Box mt={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🏆 Most Preferred Tag: {mostPreferredTag}
          </Typography>
          <Grid container spacing={2}>
            {mockTopTagEvents.map(event => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard
                  title={event.title}
                  summary={event.description}
                  image={event.image}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🧭 Least Preferred Tag: {leastPreferredTag}
          </Typography>
          <Grid container spacing={2}>
            {mockLeastTagEvents.map(event => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard
                  title={event.title}
                  summary={event.description}
                  image={event.image}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>

      <Footer />
    </div>
  );
}

export default RecommendEventsPage;