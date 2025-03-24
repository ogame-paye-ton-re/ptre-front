import React, { useEffect, useState } from 'react';

import { formatWithThousandSeparator } from '../../utils/numbers';
import { formatDate } from '../../utils/date';
import api from '../../utils/api';

import { useCurrentTeam, useUniverseMenuData } from '../../context/PtreContext';

import './SpyReportList.css';

const SpyReportList = ({ setError }) => {
    const teamData = useCurrentTeam();
    const universeData = useUniverseMenuData();

    const [spyReports, setSpyReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
    
        const fetchEventBoxData = async () => {
            if (!teamData?.teamKey) {
                return api.get(
                    `/api.php?api=main&country=${universeData.community}&univers=${universeData.server}`,
                    { signal: controller.signal }
                );
            }
    
            const teamKeyWithoutDash = teamData.teamKey.replace(/-/g, '');
            return api.post(
                `/api.php?api=main&country=${universeData.community}&univers=${universeData.server}`,
                { team_key: teamKeyWithoutDash },
                { signal: controller.signal }
            );
        };
    
        const fetchData = async () => {
            try {
                setLoading(true);
    
                const response = await fetchEventBoxData();
                setSpyReports(response.data.last_spy_reports.content);
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
        <div className="container" style={{ marginTop: '10px' }}>
            <div className="box_1">
                <div className="icon-title">
                    <img src="/assets/ogame/mini/rank_military.png" alt="Military Icon" className="section-icon" />
                    <h3>Last 10 Reports (Fleets)</h3>
                </div>
                <div className="spy-report-cards">
                    {loading ? (
                        <div className="loading-indicator">Loading...</div>
                    ) : spyReports.length > 0 ? (
                        spyReports.map((report, index) => (
                            <div key={index} className="spy-report-card">
                                <div className="report-meta">
                                    <span className={`report-visibility ${report.private ? 'private' : 'public'}`}>
                                        {report.private ? 'Private' : 'Public'}
                                    </span>
                                    <span className="report-date">
                                        {formatDate(report.event_timestamp, 'long')}
                                    </span>
                                    <span className="report-server">
                                        {report.country}-{report.universe}
                                    </span>
                                </div>
                                <div className="report-body">
                                    <div className="report-player">
                                        <i className="icon-player fas fa-user"></i>
                                        <span>
                                            {report.player_name}
                                            {report.player_alias &&
                                                report.player_alias !== report.player_name &&
                                                ` (${report.player_alias})`}
                                        </span>
                                    </div>
                                    <div className="report-location">
                                        <i className={`icon-location fas ${report.type_position === '3' ? 'fa-moon' : 'fa-globe'}`}></i>
                                        <span>
                                            {report.coord_galaxy}:{report.coord_system}:{report.coord_position}
                                        </span>
                                        <span>{report.type_position === '3' ? 'Moon' : 'Planet'}</span>
                                    </div>
                                    <div className="report-stats">
                                        <div>
                                            <i className="icon-ships fas fa-rocket"></i>
                                            <span>{formatWithThousandSeparator(report.ship_count)}</span>
                                            <span>ships</span>
                                        </div>
                                        <div>
                                            <i className="icon-fleet fas fa-fighter-jet"></i>
                                            <span>{formatWithThousandSeparator(report.fleet_points)}</span>
                                            <span>fleet points</span>
                                        </div>
                                        <div>
                                            <i className="icon-defense fas fa-shield-alt"></i>
                                            <span>{formatWithThousandSeparator(report.def_points)}</span>
                                            <span>def points</span>
                                        </div>
                                        <div>
                                            <i className="icon-resources fas fa-box"></i>
                                            <span>{formatWithThousandSeparator(report.resources)}</span>
                                            <span>resources</span>
                                        </div>
                                    </div>
                                    <div className="report-technology">
                                        <i className="icon-tech fas fa-cogs"></i>
                                        <span>
                                            {report.technos_detected ? (
                                                <>
                                                    Technology Available{' '}
                                                    <span style={{ color: 'green', fontSize: '1.2rem' }}>✔</span>
                                                </>
                                            ) : (
                                                <>
                                                    No Technology Available{' '}
                                                    <span style={{ color: 'red', fontSize: '1rem' }}>✘</span>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="report-footer">
                                    <button className="btn-display-report">Display Report</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No spy reports available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpyReportList;
