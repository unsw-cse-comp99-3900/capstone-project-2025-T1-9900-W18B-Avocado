import React from "react";
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
import { IoPersonCircleOutline } from "react-icons/io5";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./CoachPage.css";

// 注册 Chart.js 组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function CoachPage() {
  // 示例用户数据，实际使用时请替换为后端数据或通过 props 传入
  const userData = {
    name: "Anny",
    role: "Student",
    eventHistoryCount: 7,
    rewardPoints: 15,
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
  };

  const skillLabels = Object.keys(userData.skillScores);
  const skillValues = Object.values(userData.skillScores);

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
    <div className="coach-page">
      <Header />
      <div className="coach-container">
        {/* 左侧：使用 IoPersonCircleOutline 显示头像 */}
        <div className="coach-left">
          <div className="coach-profile-card">
            <div className="avatar">
              <IoPersonCircleOutline className="avatar-icon" />
            </div>
            <h2 className="coach-user-name">{userData.name}</h2>
            <div className="coach-arc-badge">Arc Member</div>
            <div className="coach-event-stats">
              <div className="event-history">
                <div>Event History</div>
                <div className="event-count">{userData.eventHistoryCount}</div>
              </div>
              <div className="my-reward">
                <div>My Reward</div>
                <div className="reward-count">{userData.rewardPoints} pt</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：雷达图和详细分析 */}
        <div className="coach-right">
          <div className="coach-chart-section">
            <div className="chart-wrapper">
              <Radar data={chartData} options={chartOptions} />
            </div>
            <div className="coach-analysis">
              <p>{userData.coachAnalysis}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoachPage;