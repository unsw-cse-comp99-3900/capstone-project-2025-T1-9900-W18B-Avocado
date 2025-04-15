import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import "./Header.css";
import AccountMenu from "./AccountMenu";

function Header() {
  const navigate = useNavigate();
  const getHomePath = () => {
    const role = localStorage.getItem("userRole");
    return role === "Admin" ? "/admin" : "/home";
  };

  return (
    <header className="header">
      {/* left logo */}
      <div className="logo">
        <Link to={getHomePath()} className="logo">
          <img src="/WhatsOnLogo.png" alt="Logo" />
        </Link>
      </div>

      {/* right icons */}
      <nav className="nav-icons">
        <div
          className="icon"
          onClick={() => navigate(getHomePath())}
          style={{ cursor: "pointer" }}
        >
          <HomeIcon />
        </div>


        <Link to="/search" className="icon"><SearchIcon /></Link>
        <Link to="/messages" className="icon"><MailOutlineIcon /></Link>

        <AccountMenu />
      </nav>
    </header>
  );
}

export default Header;