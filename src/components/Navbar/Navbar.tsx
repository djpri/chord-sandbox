import React from "react";
import { IoMdSettings } from "react-icons/io";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src="/favicon.png" height="20px" />
        <IoMdSettings size="1.5rem" />
      </div>
    </nav>
  );
}

export default Navbar;
