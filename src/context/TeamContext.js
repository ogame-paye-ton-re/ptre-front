import React, { createContext, useContext, useState, useEffect } from 'react';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
    const [teamData, setTeamData] = useState(() => {
        const storedData = localStorage.getItem('teamData');
        return storedData ? JSON.parse(storedData) : null;
    });

    useEffect(() => {
        if (teamData) {
            localStorage.setItem('teamData', JSON.stringify(teamData));
        } else {
            localStorage.removeItem('teamData');
        }
    }, [teamData]);

    return (
        <TeamContext.Provider value={{ teamData, setTeamData }}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) {
      throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
  };
