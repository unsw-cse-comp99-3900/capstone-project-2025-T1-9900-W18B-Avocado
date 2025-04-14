import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 可加入清除 token 的逻辑
    navigate("/login");
  };

  return (
    <header className="header">
      {/* left logo */}
      <div className="logo">
        <Link to="/home" className="logo">
          <img src="/WhatsOnLogo.png" alt="Logo" />
        </Link>
      </div>

      {/* right icons */}
      <nav className="nav-icons">
        <Link to="/home" className="icon"><HomeIcon /></Link>
        <Link to="/search" className="icon"><SearchIcon /></Link>
        <Link to="/messages" className="icon"><MailOutlineIcon /></Link>
        <Link to="/profile" className="icon"><PersonIcon /></Link>

        {/* ✅ Log out 按钮 */}
        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </nav>
    </header>
  );
}

export default Header;
