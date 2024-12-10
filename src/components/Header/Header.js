import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isActive = (url) => {
        const currentPage = new URLSearchParams(location.search).get("page");
        const menuPage = new URLSearchParams(new URL(url, window.location.origin).search).get("page");
        return currentPage === menuPage;
    };

    const menuItems = [
        { name: 'Home', url: '/' },
        { name: 'Galaxy Event Explorer', url: '/?page=galaxy_event_explorer' },
        { name: 'Position Finder', url: '/?page=position_8_finder' },
        { name: 'SS Finder', url: '/?page=empty_system_finder' },
        { name: 'Techs', url: '/?page=lifeforms_researchs' },
        { name: 'Public Reports', url: '/?page=public_spy_reports' }
    ];

    return (
        <header className="header">
            {/* First Navbar */}
            <div className="navbar">
                <div className="container">
                    <div className="logo">
                        <Link to="/">
                            <img src="/assets/ptre_logo_trans_header.png" alt="PTRE Logo" className="logo-image" />
                        </Link>
                    </div>

                    <div className="navbar-left">
                        <select className="designed-select">
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                        </select>
                        <span className="separator"></span>
                        <div className="search-container">
                            <img src="/assets/icons/search.webp" alt="Search" className="search-icon" />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="search-input"
                            />
                        </div>
                    </div>

                    <div className="header-right">
                        <select className="language-selector">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                        </select>
                        <span className="separator"></span>
                        <a href="https://discord.gg/WsJGC9G" className="icon-link" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/discord-icon.png" alt="Discord" className="icon" />
                        </a>
                        <a href="https://ko-fi.com/ptreforogame" className="icon-link" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/kofi-icon.png" alt="Ko-Fi" className="icon" />
                        </a>
                        <span className="separator"></span>
                        <Link to="/?page=team" className="login-link">
                            <img src="/assets/icons/user.webp" alt="Profile" className="icon profile-icon" />
                            Login
                        </Link>
                    </div>
                    <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                        ☰
                    </button>
                </div>
            </div>
            {/* Full-width Header Image */}
            <div className="header-image">
                <img src="https://placehold.co/1248x88/png" alt="Placeholder" className="full-width-image" />
            </div>
            {/* Second Navbar */}
            <div className="navbar navbar2">
                <div className="container">
                    <nav className="large-screen-menu">
                        <ul>
                            {menuItems.map((item, i) => (
                                <li key={`large-menu-item-${i}`}>
                                    <Link
                                        to={item.url}
                                        className={isActive(item.url) ? "active" : ""}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            <nav className={`small-screen-menu ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    {Array.from({ length: 18 }, (_, i) => (
                        <li key={`small-menu-item-${i}`}>
                            <a href={`#link-${i + 1}`}>Menu {i + 1}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
