import React, { createContext, useContext, useState, useEffect } from 'react';

const PtreContext = createContext();

export const PtreProvider = ({ children }) => {
    const [ptreData, setPtreData] = useState(() => {
        const storedData = localStorage.getItem('ptreData');
        return storedData ? JSON.parse(storedData) : null;
    });

    const setTeamData = (newData) => {
        setPtreData((prevData) => ({
            ...prevData,
            teamData: {
                ...prevData?.teamData,
                ...newData,
            },
        }));
    };

    const setUniverseMenuData = (newData) => {
        setPtreData((prevData) => ({
            ...prevData,
            universeMenuData: {
                ...prevData?.universeMenuData,
                ...newData,
            },
        }));
    };

    useEffect(() => {
        if (ptreData) {
            localStorage.setItem('ptreData', JSON.stringify(ptreData));
        } else {
            localStorage.removeItem('ptreData');
        }
    }, [ptreData]);

    return (
        <PtreContext.Provider value={{ ptreData, setPtreData, setTeamData, setUniverseMenuData }}>
            {children}
        </PtreContext.Provider>
    );
};

export const usePtre = () => {
    const context = useContext(PtreContext);
    if (!context) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};

export const useTeamData = () => {
    const { ptreData } = usePtre();
    return ptreData?.teamData;
};

export const useUniverseMenuData = () => {
    const { ptreData } = usePtre();
    return ptreData?.universeMenuData;
};