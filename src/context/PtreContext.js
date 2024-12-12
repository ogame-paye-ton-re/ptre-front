import React, { createContext, useContext, useState, useEffect } from 'react';

const PtreContext = createContext();

export const PtreProvider = ({ children }) => {
    const [ptreData, setPtreData] = useState(() => {
        const storedData = localStorage.getItem('ptreData');
        return storedData ? JSON.parse(storedData) : { teams: [], universes: {}, currentTeamId: null };
    });

    const setTeamData = (newTeam) => {
        setPtreData((prevData) => {
            const updatedTeams = prevData.teams.map((team) =>
                team.teamId === newTeam.teamId ? { ...team, ...newTeam } : team
            );
            if (!updatedTeams.some((team) => team.teamId === newTeam.teamId)) {
                updatedTeams.push(newTeam);
            }
            return { ...prevData, teams: updatedTeams };
        });
    };

    const setCurrentTeam = (teamId) => {
        setPtreData((prevData) => {
            const selectedTeam = prevData.teams.find((team) => team.teamId === teamId);
            const defaultCountry = selectedTeam?.defaultCountry || '';
            const defaultUniverse = selectedTeam?.defaultUnivers || '';

            return {
                ...prevData,
                currentTeamId: teamId,
                universes: {
                    ...prevData.universes,
                    community: defaultCountry,
                    server: defaultUniverse,
                },
            };
        });
    };

    const setUniverseMenuData = (newData) => {
        setPtreData((prevData) => ({
            ...prevData,
            universes: {
                ...prevData?.universes,
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
        <PtreContext.Provider
            value={{ ptreData, setPtreData, setTeamData, setCurrentTeam, setUniverseMenuData }}
        >
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

export const useTeams = () => {
    const { ptreData } = usePtre();
    return ptreData?.teams || [];
};

export const useCurrentTeam = () => {
    const { ptreData } = usePtre();
    return ptreData?.teams.find((team) => team.teamId === ptreData.currentTeamId);
};

export const useUniverseMenuData = () => {
    const { ptreData } = usePtre();
    return ptreData?.universes;
};