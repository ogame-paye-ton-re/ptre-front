import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ErrorComponent from './../../../shared/ErrorComponent/ErrorComponent'
import api from './../../../utils/api';
import { shortenNumber } from './../../../utils/numbers';

import './Home.css';

const PlayerRow = ({ iid, icon, playerName, days, fleetPoints, isFirst }) => (
    <div className={`player-row-data ${isFirst ? 'first-player-row-data' : ''}`}>
        {icon && <img src={icon} alt="Icon" className="player-icon" />}
        <span>
            <Link to={`/?iid=${iid}`}>
                {playerName}
            </Link> (
            {days != null ? `${days} days` : `${(fleetPoints)} pts`}
            )
        </span>
    </div>
);

const classIdToImage = {
    '1': '/assets/ogame/mini/collector.png',
    '2': '/assets/ogame/mini/general.png',
    '3': '/assets/ogame/mini/discoverer.png',
};

const Home = () => {
    const [topBoxData, setTopBoxData] = useState({
        topx_last_fleets: [],
        topx_top_fleets: [],
        topx_last_bunkers: [],
    });
    //const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await api.post(
                    '/api.php?view=topx_box&country=fr&univers=256',
                    {
                        team_key: 'TMDCD4R6ZVT27BPEHU', // TMNVLZGHJ75D01FR2D
                    },
                    { signal: controller.signal }
                );

                const mapPlayerData = (data) =>
                    data.map(item => ({
                        iid: item.iid,
                        playerName: item.player_name,
                        days: item.timestamp ? Math.floor((Date.now() / 1000 - item.timestamp) / (60 * 60 * 24)) : null,
                        fleetPoints: shortenNumber(item.fleet_points) || null,
                        icon: classIdToImage[item.class_id] || null,
                    }));


                setTopBoxData({
                    topx_last_fleets: mapPlayerData(response.data.topx_last_fleets.content),
                    topx_top_fleets: mapPlayerData(response.data.topx_top_fleets.content),
                    topx_last_bunkers: mapPlayerData(response.data.topx_last_bunkers.content),
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
    }, []);


    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <ErrorComponent message={error} />;
    }

    return (
        <>
            <div className="container home-container">
                {/* New Section */}
                <div className="box_1">
                    <img src={`/assets/titles/ptre_new_trans.png`} alt="Fleets Title" />
                    <div className="text-with-lines">
                        <span>Private</span>
                    </div>
                    {topBoxData.topx_last_fleets.length > 0 ? (
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
                    {topBoxData.topx_top_fleets.length > 0 ? (
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
                    {topBoxData.topx_last_bunkers.length > 0 ? (
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
        </>
    );
};

export default Home;