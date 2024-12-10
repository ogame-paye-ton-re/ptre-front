import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-left">
                    {[
                        {
                            title: "General",
                            links: [
                                { href: "/?page=splash", text: "Presentation" },
                                { href: "/#", text: "Discord Setup" },
                            ],
                        },
                        {
                            title: "Tools",
                            links: [
                                { href: "/#", text: "Galaxy Event Explorer" },
                                { href: "/#", text: "Position Finder" },
                                { href: "/#", text: "SS Finder" },
                                { href: "/#", text: "Public Reports" },
                                { href: "/#", text: "Techs" },
                            ],
                        },
                        {
                            title: "Team Management",
                            links: [{ href: "/#", text: "Login/Create Team" }],
                        },
                        {
                            title: "Contact & Help",
                            links: [
                                { href: "/#", text: "API Status" },
                                { href: "/#", text: "Statistics" },
                                { href: "/#", text: "Contact Us" },
                            ],
                        },
                    ].map((category, index) => (
                        <div key={`category-${index}`} className="footer-part-left-block">
                            <span className="c-1">{category.title}</span>
                            {category.links.map((link, linkIndex) => (
                                <div key={`link-${index}-${linkIndex}`} className="footer-link">
                                    <a href={link.href} title={link.text}>
                                        {link.text}
                                    </a>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="footer-right">
                    <div className="statistics">
                        <h4>This Month:</h4>
                        <ul>
                            <li><span className="c-green">12.544</span> new Spy Reports, including <span className="c-green">6.335</span> from OGLight</li>
                            <li><span className="c-green">349</span> web-active Teams, <span className="c-green">392</span> active Discord servers</li>
                            <li><span className="c-green">5.416.298</span> IG activities pushed, <span className="c-green">12.469</span> activity graphics displayed</li>
                        </ul>
                        <a href="/more-stats" className="more-stats-link">Plus de statistiques</a>
                        <p>No new data</p>
                    </div>
                </div>
                <div className="clear"></div>
                <div className="footer-part-bottom">
                    © PTRE, by GeGe, since October 2018<br />
                    <div className="footer-apps-btns">
                        <a title="Join us on Discord" target="_blank" rel="noopener noreferrer" className="footer-apps-btn i-app-discord" href="https://discord.gg/WsJGC9G"></a>
                        <a title="Support PTRE" target="_blank" rel="noopener noreferrer" className="footer-apps-btn i-app-kofi" href="https://ko-fi.com/ptreforogame"></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
