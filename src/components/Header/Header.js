import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import api from './../../utils/api';

import { useCurrentTeam, usePtre, useUniverseMenuData } from '../../context/PtreContext';

import './Header.css';

const Header = ({ toggleModal }) => {
    const teamData = useCurrentTeam();
    const universeData = useUniverseMenuData();
    const { setUniverseMenuData } = usePtre();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [communities, setCommunities] = useState([]);
    const [isSticky, setIsSticky] = useState(false);
    const location = useLocation();
    const filterCommunityWrapperRef = useRef(null);
    const filterCommunityRef = useRef(null);
    const filterServerWrapperRef = useRef(null);
    const serverSelectRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isActive = (url) => {
        const currentPage = new URLSearchParams(location.search).get("page");
        const menuPage = new URLSearchParams(new URL(url, window.location.origin).search).get("page");
        return currentPage === menuPage;
    };

    const handleCommunityChange = (community) => {
        setUniverseMenuData({
            community: community,
            server: community && communities[community] && communities[community].length > 0 ? String(communities[community][0].univers) : ""
        });
    };

    const handleServerChange = (server) => {
        setUniverseMenuData({
            server: server
        });
    };

    const shakeFilterCommunity = () => {
        if (filterCommunityRef.current) {
            filterCommunityRef.current.classList.add("shake-animation");
            setTimeout(() => {
                filterCommunityRef.current.classList.remove("shake-animation");
            }, 500);
        }
    };

    const baseMenuItems = [
        { name: 'Home', url: '/' },
        { name: 'Galaxy Event Explorer', url: '/?page=galaxy_event_explorer' },
        { name: 'Position Finder', url: '/?page=position_8_finder' },
        { name: 'SS Finder', url: '/?page=empty_system_finder' },
        { name: 'Techs', url: '/?page=lifeforms_researchs' },
        { name: 'Public Reports', url: '/?page=public_spy_reports' },
    ];

    const additionalMenuItems = teamData
        ? [
            { name: 'Target list', url: '/?page=players_list' },
        ]
        : [];

    const menuItems = [...baseMenuItems, ...additionalMenuItems];

    useEffect(() => {
        const handleWrapperClick = (event) => {
            if (
                serverSelectRef.current?.disabled &&
                (!universeData?.community || universeData?.community === "world") &&
                filterServerWrapperRef.current.contains(event.target)
            ) {
                shakeFilterCommunity();
            }
        };

        const wrapper = filterCommunityWrapperRef.current;
        if (wrapper) {
            wrapper.addEventListener("click", handleWrapperClick);
        }

        return () => {
            if (wrapper) {
                wrapper.removeEventListener("click", handleWrapperClick);
            }
        };
    }, [universeData?.community]);

    useEffect(() => {
        const fetchUniversesMenu = async () => {
            try {
                const response = teamData?.teamKey
                    ? await api.post("/api.php?view=universes_menu", {
                        team_key: teamData.teamKey.replace(/-/g, ""),
                    })
                    : await api.get("/api.php", { view: "universes_menu" });

                if (response.RESULT_CODE === 0 && response.data.bloc_error === 0) {
                    setCommunities(response.data.content);
                } else {
                    console.error("Unexpected login status or API failure.");
                }
            } catch (err) {
                console.error("Error fetching universes menu:", err);
            }
        };
        fetchUniversesMenu();
    }, [teamData?.teamKey]);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 212 && window.innerWidth > 768);
        };
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

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

                        <div id="filter-community-wrapper" ref={filterCommunityWrapperRef}>
                            <div id="filter-community" ref={filterCommunityRef}>
                                <img
                                    style={{ height: '24px', display: 'block', margin: 'auto' }}
                                    src={universeData?.community ? `/assets/flags/${universeData.community}.webp` : '/assets/flags/world.webp'}
                                    alt=""
                                />
                                <ul>
                                    {Object.keys(communities).map(languageCode => (
                                        <li key={languageCode} onClick={() => handleCommunityChange(languageCode)}>
                                            <img style={{ height: '24px' }} src={`/assets/flags/${languageCode}.webp`} alt={languageCode} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div id="filter-server-wrapper" ref={filterServerWrapperRef}>
                                <select
                                    id="server-select"
                                    value={universeData?.server || ""}
                                    onChange={(e) => handleServerChange(e.target.value)}
                                    ref={serverSelectRef}
                                    disabled={!universeData?.community || false}
                                    style={{ pointerEvents: universeData?.community ? "auto" : "none" }}
                                >
                                    <option value="" disabled>Select a server</option>
                                    {universeData?.community && communities[universeData.community] &&
                                        communities[universeData.community].map(server => (
                                            <option key={server.univers} value={server.univers}>
                                                {server.univers} - {server.label}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
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
                        {teamData ? (
                            <>
                                <span className="login-link">
                                    <img
                                        src="/assets/icons/user.webp"
                                        alt="Profile"
                                        className="icon profile-icon"
                                    />
                                    {teamData.teamName}
                                </span>
                                <div>
                                    <span href="/" className="add-team-link" onClick={toggleModal}>
                                        <div className="add-team-wrapper">
                                            <span>+</span>
                                        </div>
                                    </span>
                                </div>
                            </>
                        ) : (
                            <span className="login-link" onClick={toggleModal}>
                                <img
                                    src="/assets/icons/user.webp"
                                    alt="Profile"
                                    className="icon profile-icon"
                                />
                                Login
                            </span>
                        )}
                    </div>
                    <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                        ☰
                    </button>
                </div>
            </div>
            {/* Full-width Header Image */}
            <div className="header-image">
                <img src="/assets/header-image.png" alt="Placeholder" className="full-width-image" />
            </div>
            {/* Second Navbar */}
            <div className={`navbar navbar2 ${isSticky ? 'sticky' : ''}`}>
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
