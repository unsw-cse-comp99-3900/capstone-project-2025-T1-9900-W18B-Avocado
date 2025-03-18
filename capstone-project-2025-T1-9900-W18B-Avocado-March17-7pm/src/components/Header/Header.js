import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";
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
        <Link to="/search" className="icon"><FaSearch /></Link>
        <Link to="/messages" className="icon"><FaBell /></Link>
        <Link to="/profile" className="icon"><FaUser /></Link>
      </nav>
    </header>
  );
}

export default Header;
