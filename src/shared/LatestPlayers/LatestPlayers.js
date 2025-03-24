import React, { useEffect, useState } from 'react';

import api from './../../utils/api';
import { PlayerRow, mapTopBoxPlayerData } from './../../utils/ptre';

import { useCurrentTeam, useUniverseMenuData } from '../../context/PtreContext';

import './LatestPlayers.css';

const LatestPlayers = ({ setError }) => {
    const teamData = useCurrentTeam();
    const universeData = useUniverseMenuData();

    const [topBoxData, setTopBoxData] = useState({
        latestFleets: [],
        topFleets: [],
        latestBunkers: [],
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
    
        const fetchTopBoxData = async () => {
            try {
                setLoading(true);
    
                let response;
    
                if (!teamData?.teamKey) {
                    response = await api.get(
                        `/api.php?api=topx_box&country=${universeData.community}&univers=${universeData.server}`,
                        { signal: controller.signal }
                    );
                } else {
                    const teamKeyWithoutDash = teamData.teamKey.replace(/-/g, '');
                    response = await api.post(
                        `/api.php?api=topx_box&country=${universeData.community}&univers=${universeData.server}`,
                        { team_key: teamKeyWithoutDash },
                        { signal: controller.signal }
                    );
                }
    
                const { topx_last_fleets, topx_top_fleets, topx_last_bunkers } = response.data;
                setTopBoxData({
                    latestFleets: mapTopBoxPlayerData(topx_last_fleets.content),
                    topFleets: mapTopBoxPlayerData(topx_top_fleets.content),
                    latestBunkers: mapTopBoxPlayerData(topx_last_bunkers.content),
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
    
        fetchTopBoxData();
    
        return () => controller.abort();
    }, [teamData?.teamKey, universeData?.community, universeData?.server, setError]);
    
    return (
        <div className="container top-container">
            {/* New Section */}
            <div className="box_1">
                <img src={`/assets/titles/ptre_new_trans.png`} alt="Fleets Title" />
                <div className="text-with-lines">
                    <span>Private</span>
                </div>
                {loading ? (
                    <div className="player-row-data first-player-row-data">Loading...</div>
                ) : topBoxData.latestFleets.length > 0 ? (
                    topBoxData.latestFleets.map((item, index) => (
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
                ) : topBoxData.topFleets.length > 0 ? (
                    topBoxData.topFleets.map((item, index) => (
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
                ) : topBoxData.latestBunkers.length > 0 ? (
                    topBoxData.latestBunkers.map((item, index) => (
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
    );
};

export default LatestPlayers;
