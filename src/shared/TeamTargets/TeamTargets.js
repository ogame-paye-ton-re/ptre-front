import React, { useState, useEffect } from 'react';
import { useCurrentTeam, useUniverseMenuData } from '../../context/PtreContext';
import Tooltip from "./../../shared/Tooltip/Tooltip";

import { formatDate } from '../../utils/date';
import { formatWithThousandSeparator } from '../../utils/numbers';
import api from './../../utils/api';

import './TeamTargets.css';

const TeamTargets = () => {
    const teamData = useCurrentTeam();
    const universeData = useUniverseMenuData();

    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!teamData?.teamKey) {
            return;
        }

        const controller = new AbortController();

        const fetchTargets = async () => {
            const teamKeydWithoutDash = teamData.teamKey.replace(/-/g, '');

            try {
                setLoading(true);
                const response = await api.post(
                    `/api.php?view=players_list&country=${universeData.community}&univers=${universeData.server}`,
                    {
                        team_key: teamKeydWithoutDash,
                    },
                    { signal: controller.signal }
                );

                if (response.RESULT_CODE === 0) {
                    console.log(response)
                    setTargets(response.data.content);
                } else {
                    console.log("API call failed. Please try again later.")
                }

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Request canceled');
                } else {
                    console.error('Failed to fetch target list:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTargets();
    }, [teamData?.teamKey, universeData?.community, universeData?.server]);

    const renderActivityColor = (lastActivity) => {
        if (!lastActivity) return 'gray';

        const now = new Date();
        const lastActivityDate = new Date(lastActivity * 1000);
        const timeDifferenceInMs = now - lastActivityDate;
        const timeDifferenceInHours = timeDifferenceInMs / (1000 * 60 * 60);

        if (timeDifferenceInHours < 1) return 'green'; // < 1 hour
        if (timeDifferenceInHours < 24) return 'orange'; // < 1 day
        return 'red'; // > 1 day
    };

    const renderLastSpyColor = (lastSpy) => {
        if (!lastSpy) return 'gray';

        const lastSpyDate = new Date(lastSpy * 1000);
        if (isNaN(lastSpyDate)) return 'gray';

        const daysSinceLastActivity = Math.floor(
            (new Date() - lastSpyDate) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastActivity <= 7) return 'green'; // < 1 week
        if (daysSinceLastActivity <= 30) return 'orange'; // < 1 month
        return 'red'; // > 1 month
    };


    return (
        <div className="container" style={{ marginTop: '10px' }}>
            <div className="box_1">
                <div className="icon-title">
                    <img src="/assets/ogame/mini/rank_military.png" alt="Military Icon" className="section-icon" />
                    <h3>Target List (uni {universeData?.community}-{universeData?.server})</h3>
                </div>
                <div className="team-targets">
                    {loading ? (
                        <p>Loading targets...</p>
                    ) : targets.length > 0 ? (
                        <table className="targets-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Alliance</th>
                                    <th>Fleet Points</th>
                                    <th>Ship Count</th>
                                    <th>Last Spy
                                        <Tooltip content={
                                            <>
                                                <p>Data from the last spy mission. This includes the most recent spy report of the target.</p>
                                                <ul>
                                                    <li><span style={{ color: 'green' }}>Green:</span> Recent check (&lt; 1 week)</li>
                                                    <li><span style={{ color: 'orange' }}>Orange:</span> Moderate check (&lt; 1 month)</li>
                                                    <li><span style={{ color: 'red' }}>Red:</span> No check for over a month</li>
                                                    <li><span style={{ color: 'gray' }}>Gray:</span> No check recorded</li>
                                                </ul>
                                            </>
                                        }>
                                            <span className="tooltip-wrapper">
                                                <span className="tooltip-icon">❓</span>
                                            </span>
                                        </Tooltip>
                                    </th>
                                    <th>Last Check
                                        <Tooltip content={
                                            <>
                                                <p>Last time the player was checked.</p>
                                                <ul>
                                                    <li><span style={{ color: 'green' }}>Green:</span> Recent check (&lt; 1 hour)</li>
                                                    <li><span style={{ color: 'orange' }}>Orange:</span> Moderate check (&lt; 1 day)</li>
                                                    <li><span style={{ color: 'red' }}>Red:</span> No check for over a day</li>
                                                    <li><span style={{ color: 'gray' }}>Gray:</span> No check recorded</li>
                                                </ul>
                                            </>
                                        }>
                                            <span className="tooltip-wrapper">
                                                <span className="tooltip-icon">❓</span>
                                            </span>
                                        </Tooltip>
                                    </th>
                                    <th>IG Activities (Ally)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {targets.map((target, index) => (
                                    <tr key={index}>
                                        <td>
                                            {target.name}
                                            {target.alias &&
                                                target.alias !== target.name &&
                                                ` (${target.alias})`}
                                        </td>
                                        <td>{target.alliance || 'N/A'}</td>
                                        <td>{formatWithThousandSeparator(target.fleet_points)}</td>
                                        <td>{formatWithThousandSeparator(target.ship_count)}</td>
                                        <td style={{ color: renderLastSpyColor(target?.event_timestamp) }}>
                                            {target.event_timestamp ? formatDate(target.event_timestamp, 'long') : 'N/A'}
                                        </td>

                                        <td style={{ color: renderActivityColor(target.activity_last_event_timestamp) }}>
                                            {target.activity_last_event_timestamp !== 0 ? formatDate(target.activity_last_event_timestamp, 'dateOnly') : 'N/A'}
                                        </td>
                                        <td>{target.activity_team_count} ({target.activity_coa_count})</td>
                                        <td>
                                            <button className="btn-add-target">ADD TO IG LIST</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No targets available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamTargets;
