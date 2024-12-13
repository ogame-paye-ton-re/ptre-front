import React, { useState } from 'react';

import LatestPlayers from './../../../shared/LatestPlayers/LatestPlayers';
import LatestEvents from '../../../shared/LatestEvents/LatestEvents';
import SpyReportList from '../../../shared/SpyReportList/SpyReportList';
import ErrorComponent from './../../../shared/ErrorComponent/ErrorComponent'

import './Home.css';

const Home = () => {
    const [error, setError] = useState(null);

    const components = [
        { Component: LatestPlayers, key: 'latest-players' },
        { Component: LatestEvents, key: 'latest-events' },
        { Component: SpyReportList, key: 'spy-reports-list' },
    ];

    const renderComponents = () =>
        components.map(({ Component, key }) => <Component key={key} setError={setError} />);

    return (
        <div className="home-container">
            {error ? <ErrorComponent message={error} /> : renderComponents()}
        </div>
    );
};

export default Home;