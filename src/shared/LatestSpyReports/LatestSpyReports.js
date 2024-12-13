import React from 'react';

import { formatWithThousandSeparator } from './../../utils/numbers';
import { formatDate } from './../../utils/date';
import './LatestSpyReports.css';

const LatestSpyReports = ({ spyReports }) => {
    return (
        <div className="container" style={{ marginTop: '10px' }}>
            <div className="box_1">
                <div className="icon-title">
                    <img src="/assets/ogame/mini/rank_military.png" alt="Military Icon" className="section-icon" />
                    <h3>Last 10 Reports (Fleets)</h3>
                </div>
                <div className="spy-report-cards">
                    {spyReports.length > 0 ? (
                        spyReports.map((report, index) => (
                            
                            <div key={index} className="spy-report-card">
                                <div className="report-meta">
                                    <span className={`report-visibility ${report.public ? 'public' : 'private'}`}>
                                        {report.public ? 'Public' : 'Private'}
                                    </span>
                                    <span className="report-date">
                                        {formatDate(report.event_timestamp, 'long')}
                                    </span>
                                    <span className="report-server">{report.country}-{report.universe}</span>
                                </div>
                                <div className="report-body">
                                    <div className="report-player">
                                        <i className="icon-player fas fa-user"></i>
                                        <span>
                                            {report.player_name} (IG: {report.player_alias}) 
                                        </span>
                                    </div>
                                    <div className="report-location">
                                        <i className={`icon-location fas ${report.type_position === "3" ? 'fa-moon' : 'fa-globe'}`}></i>
                                        <span>{report.coord_galaxy}:{report.coord_system}:{report.coord_position}</span>
                                        <span>{report.type_position === "3" ? 'Moon' : 'Planet'}</span>
                                    </div>
                                    <div className="report-stats">
                                        <div>
                                            <i className="icon-ships fas fa-rocket"></i>
                                            <span>{formatWithThousandSeparator(report.ship_count.toLocaleString())}</span>
                                            <span>ships</span>
                                        </div>
                                        <div>
                                            <i className="icon-fleet fas fa-fighter-jet"></i>
                                            <span>{formatWithThousandSeparator(report.fleet_points.toLocaleString())}</span>
                                            <span>fleet points</span>
                                        </div>
                                        <div>
                                            <i className="icon-defense fas fa-shield-alt"></i>
                                            <span>{formatWithThousandSeparator(report.def_points.toLocaleString())}</span>
                                            <span>def points</span>
                                        </div>
                                        <div>
                                            <i className="icon-resources fas fa-box"></i>
                                            <span>{formatWithThousandSeparator(report.resources.toLocaleString())}</span>
                                            <span>resources</span>
                                        </div>
                                    </div>
                                    <div className="report-technology">
                                        <i className="icon-tech fas fa-cogs"></i>
                                        <span>
                                            {report.technos_detected ? 'Technology Available' : 'No Technology Available'}
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

export default LatestSpyReports;