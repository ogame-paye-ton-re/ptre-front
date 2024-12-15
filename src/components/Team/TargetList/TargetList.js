import React, { useState } from 'react';

import LatestPlayers from './../../../shared/LatestPlayers/LatestPlayers';
import TeamTargets from './../../../shared/TeamTargets/TeamTargets';
import ErrorComponent from './../../../shared/ErrorComponent/ErrorComponent'


import './TargetList.css';

const TargetList = () => {
    const [error, setError] = useState(null);

    if (error) {
        return <ErrorComponent message={error} />;
    }

    return (
        <>
            {/* Top block */}
            <LatestPlayers setError={setError} />
            {/* Target List block */}
            <TeamTargets setError={setError} />
        </>
    );
};

export default TargetList;