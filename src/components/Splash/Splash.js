import React from "react";
import './Splash.css';

const Splash = () => {
    const featuresData = [
        {
            icon: "/assets/ogame/mini/ship_210.png",
            featureName: "Saving Spy Reports to PTRE",
            statuses: ["YES", "YES", "YES"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/discord-logo.png",
            featureName: "Pushing Spy Reports to Discord",
            statuses: ["YES", "YES", "YES"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/rank_military.png",
            featureName: "Displaying ingame PTRE best Spy report",
            statuses: ["YES", "YES", "YES"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/rank_defense.png",
            featureName: "Sending player's activities to PTRE",
            statuses: ["YES", "YES", "YES"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/research_106.png",
            featureName: "Sending counter spy messages to activity database",
            statuses: ["YES", "YES", "YES"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/research_108.png",
            featureName: "Displaying activity graphic",
            statuses: ["YES", "YES", "NO"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/planet_9.png",
            featureName: "Detecting and sending new planets / moons to Team database",
            statuses: ["YES", "YES", "NO"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/moon_3.gif",
            featureName: "Syncing back ingame new planets / moons from PTRE",
            statuses: ["YES", "NO", "NO"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/player.png",
            featureName: "Syncing Ingame Team targets",
            statuses: ["YES", "NO", "YES"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/building_42.png",
            featureName: "Friends & Phalanx (close friends and phalanx levels)",
            statuses: ["NO", "NO", "YES"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/general.png",
            featureName: "Display Galaxy Event Explorer events directly ingame",
            statuses: ["NO", "NO", "YES"],
            anchor: "saving-spy-reports",
        },
        {
            icon: "/assets/ogame/mini/lf_human.png",
            featureName: "Researchs and Lifeform sync to PTRE",
            statuses: ["NO", "NO", "YES"],
            anchor: "saving-spy-reports",
        },
    ];

    const videoData = [
        {
            src: "https://www.youtube.com/embed/LE1T3AB4P7s",
            title: "OGame PTRE",
        },
        {
            src: "https://www.youtube.com/embed/SiR4lxmChoY",
            title: "OGame - OGLight",
        },
    ];


    return (
        <div className="container">
            <div className="box_1">
                <div className="content-container">
                    <img src="/assets/ptre_logo_trans.png" alt="PTRE Logo" className="horizontal-logo" />
                    <div className="text-content">
                        <p><strong>PTRE</strong> est un outil permettant de sauvegarder et partager vos rapports d'espionnages avec une grande simplicité. Vous pouvez sauvegarder vos RE depuis :</p>

                        <ul>
                            <li><strong>Discord</strong>, en installant le bot PTRE sur votre serveur</li>
                            <li><a href="https://openuserjs.org/scripts/nullNaN/OGLight" target="_blank" rel="noopener noreferrer">OGLight</a>, en installant l'add-on dans votre navigateur</li>
                            <li><a href="https://openuserjs.org/scripts/GeGe_GM/EasyPTRE" target="_blank" rel="noopener noreferrer">EasyPTRE, script officiel pour PTRE</a> (compatible avec AGR, OGL, OGI)</li>
                            <li>OGame Infinity</li>
                            <li>Directement depuis le site web</li>
                        </ul>

                        <p><strong>Vos rapports seront privés et uniquement partagés entre les membres de votre équipe.</strong> PTRE propose aussi des outils de profilage d'activité ingame, de recherche et de tri afin de gérer vos RE.</p>

                        <p>Pour commencer, il vous suffit de <a href="/?page=team">créer votre alliance</a> et <a href="https://discordapp.com/oauth2/authorize?&amp;client_id=512294332058042388&amp;scope=bot" target="_blank" rel="noopener noreferrer">d'installer le bot PTRE</a>.</p>
                    </div>
                </div>
            </div>

            <div className="box_1 box_2">
                {/* Feature Table Section */}
                <div className="features-table">
                    <table>
                        <thead>
                            <tr>
                                <th className="left">Tool Feature</th>
                                <th className="c-green">OGLight</th>
                                <th>Infinity</th>
                                <th>EasyPTRE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {featuresData.map((feature, index) => (
                                <tr key={index}>
                                    <td className="align-image-text">
                                        <div className="feature-container">
                                            <img src={feature.icon} width="20px" alt="Feature Icon" />
                                            <span className="feature-text">{feature.featureName}</span>
                                            {feature.anchor && (
                                                <a href={`#${feature.anchor}`} className="help-icon">
                                                    ?
                                                    <span className="custom-tooltip">More info about this feature</span>
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    {feature.statuses.map((status, idx) => (
                                        <td
                                            key={idx}
                                            className={`center ${status === "YES" ? "c-green" : "c-red"}`}
                                        >
                                            {status}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Video Section */}
                <div className="video-section">
                    {videoData.map((video, index) => (
                        <iframe
                            key={index}
                            width="420"
                            height="315"
                            src={video.src}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Splash;