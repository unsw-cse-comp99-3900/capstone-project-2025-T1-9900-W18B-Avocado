import React from "react";
import { Link } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SearchIcon from '@mui/icons-material/Search';
import logo from "../../assets/wso-logo.png";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      {/* left logo */}
      <div className="logo">
        <Link to="/home" className="logo">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* right icons */}
      <nav className="nav-icons">
        <Link to="/search" className="icon"><SearchIcon /></Link>
        <Link to="/messages" className="icon"><MailOutlineIcon /></Link>
        <Link to="/profile" className="icon"><PersonIcon /></Link>
      </nav>
    </header>
  );
}

export default Header;
