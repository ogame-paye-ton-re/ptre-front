import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from './../../utils/api';
import { GalaxyEventRow, SpyEventRow } from './../../utils/ptre';
import { useCurrentTeam, useUniverseMenuData } from './../../context/PtreContext';

import './LatestEvents.css';

const LatestEvents = ({ setError }) => {
    const teamData = useCurrentTeam();
    const universeData = useUniverseMenuData();

    const [eventBoxData, setEventBoxData] = useState({
        last_galaxy_events: [],
        last_spy_events: [],
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
            if (!teamData?.teamKey) {
                return;
            }
    
            const controller = new AbortController();
    
            const fetchEventBoxData = async () => {
                const teamKeydWithoutDash = teamData.teamKey.replace(/-/g, '');
    
                return api.post(
                    `/api.php?view=last_events&country=${universeData.community}&univers=${universeData.server}`,
                    {
                        team_key: teamKeydWithoutDash,
                    },
                    { signal: controller.signal }
                );
            };
    
            const fetchData = async () => {
                try {
                    setLoading(true);
    
                    const eventBoxResponse = await fetchEventBoxData();
    
                    setEventBoxData({
                        last_galaxy_events: eventBoxResponse.data.bloc_last_galaxy_events.content,
                        last_spy_events: eventBoxResponse.data.last_spy.content,
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
        }, [teamData?.teamKey, universeData?.community, universeData?.server, setError]);

    return (
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
                            <tr>
                                <td colSpan={4}>Loading...</td>
                            </tr>
                        ) : eventBoxData.last_galaxy_events.length > 0 ? (
                            eventBoxData.last_galaxy_events.map((event, index) => (
                                <GalaxyEventRow
                                    key={index}
                                    date={event.timestamp}
                                    profileId={event.player_id}
                                    action={event.action}
                                    alliance={event.coa}
                                    status={event.status}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='center'>Not enough OGLight data. You need to install OGLight / Infinity / EasyPTRE.</td>
                            </tr>
                        )}
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
                        ) : eventBoxData.last_spy_events.length > 0 ? (
                            eventBoxData.last_spy_events.map((event, index) => (
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='center'>Not enough OGLight data. You need to install OGLight / Infinity / EasyPTRE.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LatestEvents;