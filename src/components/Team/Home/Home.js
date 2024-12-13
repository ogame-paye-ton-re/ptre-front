import React, { useState } from 'react';

import LatestPlayers from './../../../shared/LatestPlayers/LatestPlayers';
import LatestEvents from '../../../shared/LatestEvents/LatestEvents';
import LatestSpyReports from './../../../shared/LatestSpyReports/LatestSpyReports';
import ErrorComponent from './../../../shared/ErrorComponent/ErrorComponent'

import './Home.css';

const Home = () => {
    const [error, setError] = useState(null);

    const components = [
        { Component: LatestPlayers, key: 'latest-players' },
        { Component: LatestEvents, key: 'latest-events' },
        { Component: LatestSpyReports, key: 'latest-spy-reports' },
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