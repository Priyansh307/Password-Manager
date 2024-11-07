import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navcontainer">
        <div className="logo">
          <span className="logo-blue">&lt;</span>
          <span>Pass</span><span className="logo-blue">OP/&gt;</span>
        </div>
        <a href="#"><button className="github-button">
          <img className="github-icon" src="/icons/github.svg" alt="github logo" />
          <span className="github-text">GitHub</span>
        </button>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
