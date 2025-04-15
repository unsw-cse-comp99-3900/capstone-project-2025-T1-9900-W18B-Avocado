import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PasswordRecovery from "./pages/PasswordRecovery/PasswordRecovery";

import MainHomePage from "./pages/MainHomePage/MainHomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import EventDetailPage from "./pages/EventDetailPage/EventDetailPage";
// import SearchPage from "./pages/SearchPage/SearchPage";
import CoachPage from "./pages/CoachPage/CoachPage"; //coachpage_YJL
// Add Router for CoachPage (move to user Profile later)
import AdminHomePage from "./pages/AdminHomePage/AdminHomePage";

import MyRewardsPage from "./pages/MyRewardsPage/MyRewardsPage"; 
import RewardHistoryPage from "./pages/RewardHistoryPage/RewardHistoryPage";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />

          <Route path="/home" element={<MainHomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/schedule/*" element={<SchedulePage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />

          <Route path="/admin/*" element={<AdminHomePage />} />

          <Route path="/my-rewards" element={<MyRewardsPage />} /> 
          <Route path="/reward-history" element={<RewardHistoryPage />} />
          {/* <Route path="/search" element={<SearchPage />} /> */}
          <Route path="/career-coach" element={<CoachPage />} /> 
          {/* <Route path="/search" element={<SearchPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/recommend-events" element={<RecommendEventPage />} />
          <Route path="/past-events" element={<PastEventPage />} />
          <Route path="/todays-events" element={<TodaysEventPage />} />
          <Route path="/upcoming-events" element={<UpcomingEventPage />} /> */}

        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;