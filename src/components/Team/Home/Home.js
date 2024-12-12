import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ErrorComponent from './../../../shared/ErrorComponent/ErrorComponent'
import api from './../../../utils/api';
import { mapTopBoxPlayerData, PlayerRow, GalaxyEventRow, SpyEventRow } from './../../../utils/ptre';
import { useCurrentTeam, useUniverseMenuData } from '../../../context/PtreContext';


import './Home.css';

const Home = () => {
    const teamData = useCurrentTeam();
    const universeData = useUniverseMenuData();

    const [topBoxData, setTopBoxData] = useState({
        topx_last_fleets: [],
        topx_top_fleets: [],
        topx_last_bunkers: [],
    });
    const [eventBoxData, setEventBoxData] = useState({
        last_galaxy_events: [],
        last_spy_events: [],
        last_spy_reports: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!teamData?.teamKey) {
            return;
        }

        const controller = new AbortController();

        const fetchTopBoxData = async () => {
            const teamKeydWithoutDash = teamData.teamKey.replace(/-/g, '');

            return api.post(
                `/api.php?view=topx_box&country=${universeData.community}&univers=${universeData.server}`,
                {
                    team_key: teamKeydWithoutDash,
                },
                { signal: controller.signal }
            );
        };

        const fetchEventBoxData = async () => {
            const teamKeydWithoutDash = teamData.teamKey.replace(/-/g, '');

            return api.post(
                `/api.php?view=main&country=${universeData.community}&univers=${universeData.server}`,
                {
                    team_key: teamKeydWithoutDash,
                },
                { signal: controller.signal }
            );
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                const [topBoxResponse, eventBoxResponse] = await Promise.all([
                    fetchTopBoxData(),
                    fetchEventBoxData(),
                ]);

                setTopBoxData({
                    topx_last_fleets: mapTopBoxPlayerData(topBoxResponse.data.topx_last_fleets.content),
                    topx_top_fleets: mapTopBoxPlayerData(topBoxResponse.data.topx_top_fleets.content),
                    topx_last_bunkers: mapTopBoxPlayerData(topBoxResponse.data.topx_last_bunkers.content),
                });

                setEventBoxData({
                    last_galaxy_events: eventBoxResponse.data.bloc_last_galaxy_events.content,
                    last_spy_events: eventBoxResponse.data.last_spy.content,
                    last_spy_reports: eventBoxResponse.data.last_spy_reports.content,
                });
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Request canceled');
                } else {
                    console.error(err);
                    setError(err.message || 'Failed to fetch data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [teamData?.teamKey, universeData?.community, universeData?.server]);

    if (error) {
        return <ErrorComponent message={error} />;
    }

    return (
        <>
            <div className="container top-container">
                {/* New Section */}
                <div className="box_1">
                    <img src={`/assets/titles/ptre_new_trans.png`} alt="Fleets Title" />
                    <div className="text-with-lines">
                        <span>Private</span>
                    </div>
                    {loading ? (
                        <div className="player-row-data first-player-row-data">Loading...</div>
                    ) : topBoxData.topx_last_fleets.length > 0 ? (
                        topBoxData.topx_last_fleets.map((item, index) => (
                            <PlayerRow
                                key={index}
                                iid={item.iid}
                                icon={item.icon}
                                playerName={item.playerName}
                                fleetPoints={item.fleetPoints}
                                isFirst={index === 0}
                            />
                        ))
                    ) : (
                        <div className="player-row-data first-player-row-data">No data available</div>
                    )}
                </div>

                {/* Top Fleets Section */}
                <div className="box_1">
                    <img src={`/assets/titles/ptre_fleets_trans.png`} alt="Top Fleets Title" />
                    <div className="text-with-lines">
                        <span>Private</span>
                    </div>
                    {loading ? (
                        <div className="player-row-data first-player-row-data">Loading...</div>
                    ) : topBoxData.topx_top_fleets.length > 0 ? (
                        topBoxData.topx_top_fleets.map((item, index) => (
                            <PlayerRow
                                key={index}
                                iid={item.iid}
                                icon={item.icon}
                                playerName={item.playerName}
                                fleetPoints={item.fleetPoints}
                                isFirst={index === 0}
                            />
                        ))
                    ) : (
                        <div className="player-row-data first-player-row-data">No data available</div>
                    )}
                </div>

                {/* Top Bunkers Section */}
                <div className="box_1">
                    <img src={`/assets/titles/ptre_bunkers_trans.png`} alt="Bunkers Title" />
                    <div className="text-with-lines">
                        <span>Private</span>
                    </div>
                    {loading ? (
                        <div className="player-row-data first-player-row-data">Loading...</div>
                    ) : topBoxData.topx_last_bunkers.length > 0 ? (
                        topBoxData.topx_last_bunkers.map((item, index) => (
                            <PlayerRow
                                key={index}
                                iid={item.iid}
                                icon={item.icon}
                                playerName={item.playerName}
                                days={item.days}
                                isFirst={index === 0}
                            />
                        ))
                    ) : (
                        <div className="player-row-data first-player-row-data">No data available</div>
                    )}
                </div>
            </div>
            <div className="container events-container">
                {/* Latest Galaxy Events */}
                <div className="box_1">
                    <div className="icon-title">
                        <img src="/assets/ogame/mini/discoverer.png" alt="Discoverer Icon" className="section-icon" />
                        <h3>Last galaxy events</h3>
                    </div>
                    <Link to="?page=galaxy_event_explorer" className="section-link">
                        GALAXY EVENT EXPLORER
                    </Link>
                    <p className="section-description">Check galaxy updated as ingame</p>

                    <table className="events-table">
                        <thead>
                            <tr>
                                <th className='left'>Date</th>
                                <th className='left'>Events</th>
                                <th className='left'>Profile</th>
                                <th>Coalition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4}>Loading...</td></tr>
                            ) : eventBoxData.last_galaxy_events.map((event, index) => (
                                <GalaxyEventRow
                                    key={index}
                                    date={event.timestamp}
                                    profileId={event.player_id}
                                    action={event.action}
                                    alliance={event.coa}
                                    status={event.status}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Latest Spy Events */}
                <div className="box_1">
                    <div className="icon-title">
                        <img src="/assets/ogame/mini/general.png" alt="General Icon" className="section-icon" />
                        <h3>Last Spy</h3>
                    </div>
                    <Link to="?page=last_spy" className="section-link">
                        LAST SPY
                    </Link>
                    <p className="section-description">Who spied on your team</p>
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th className='left'>Date</th>
                                <th className='left'>Location</th>
                                <th className='left'>Player</th>
                                <th>Coalition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4}>Loading...</td></tr>
                            ) : eventBoxData.last_spy_events.map((event, index) => (
                                <SpyEventRow
                                    key={index}
                                    date={event.timestamp}
                                    profileId={event.player_id}
                                    playerName={event.player_name}
                                    coordGalaxy={event.coord_galaxy}
                                    coordSystem={event.coord_system}
                                    coordPosition={event.coord_position}
                                    alliance={event.coa}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Home;