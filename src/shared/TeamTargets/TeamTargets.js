import React, { useState, useEffect } from 'react';
import { useCurrentTeam, useUniverseMenuData } from '../../context/PtreContext';

import { formatDate } from '../../utils/date';
import { formatWithThousandSeparator } from '../../utils/numbers';
import api from './../../utils/api';

import './TeamTargets.css';

const TeamTargets = () => {
    const teamData = useCurrentTeam();
    const universeData = useUniverseMenuData();

    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingRows, setUpdatingRows] = useState({});

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
        return () => controller.abort();
    }, [teamData?.teamKey, universeData?.community, universeData?.server]);

    const handleAddToIGList = async (target, index, status) => {
        setUpdatingRows((prev) => ({ ...prev, [index]: true }));

        const teamKeydWithoutDash = teamData.teamKey.replace(/-/g, '');

        try {
            const response = await api.post(
                `/api.php?view=target_update&country=${universeData.community}&univers=${universeData.server}&requested_status=${status}&player_id=${target.player_id}`,
                { team_key: teamKeydWithoutDash }
            );

            if (response.RESULT_CODE === 0) {
                setTargets((prevTargets) =>
                    prevTargets.map((item, idx) =>
                        idx === index
                            ? { ...item, target_status: response.data.requested_status }
                            : item
                    )
                );
            } else {
                console.log('Failed to update target status. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating target status:', error);
        } finally {
            setUpdatingRows((prev) => ({ ...prev, [index]: false }));
        }
    };


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
                                    <th>Last Spy</th>
                                    <th>Last Check</th>
                                    <th>IG Activities (Ally)</th>
                                    <th className='text-center'>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {targets.map((target, index) => (
                                    <tr key={index}>
                                        <td>{target.name}</td>
                                        <td>{target.alliance || 'N/A'}</td>
                                        <td>{formatWithThousandSeparator(target.fleet_points)}</td>
                                        <td>{formatWithThousandSeparator(target.ship_count)}</td>
                                        <td style={{ color: renderLastSpyColor(target?.event_timestamp) }}>
                                            {target.event_timestamp ? formatDate(target.event_timestamp, 'long') : 'N/A'}
                                        </td>
                                        <td style={{ color: renderActivityColor(target.activity_last_event_timestamp) }}>
                                            {target.activity_last_event_timestamp !== 0
                                                ? formatDate(target.activity_last_event_timestamp, 'dateOnly')
                                                : 'N/A'}
                                        </td>
                                        <td>{target.activity_team_count} ({target.activity_coa_count})</td>
                                        <td className='text-center'>
                                            <span className={`target-current-status ${target.target_status === 0 ? 'enabled' : target.target_status === 1 ? 'ignored' : 'none'}`}>
                                                {target.target_status === 0 ? 'ENABLED' : target.target_status === 1 ? 'IGNORED' : 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            {updatingRows[index] ? (
                                                'Processing...'
                                            ) : (
                                                <>
                                                    {target.target_status === -1 && (
                                                        <button
                                                            className="btn-add-target"
                                                            onClick={() => handleAddToIGList(target, index, '0')}
                                                        >
                                                            ADD TO IG LIST
                                                        </button>
                                                    )}
                                                    {target.target_status === 0 && (
                                                        <button
                                                            className="btn-ignore-target"
                                                            onClick={() => handleAddToIGList(target, index, '1')}
                                                        >
                                                            IGNORE
                                                        </button>
                                                    )}
                                                    {target.target_status === 1 && (
                                                        <div className="btn-group">
                                                            <button
                                                                className="btn-enable-target"
                                                                onClick={() => handleAddToIGList(target, index, '0')}
                                                            >
                                                                ENABLE
                                                            </button>
                                                            <button
                                                                className="btn-remove-target"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAddToIGList(target, index, '-1');
                                                                }}
                                                                title="Remove from In-Game List"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
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
