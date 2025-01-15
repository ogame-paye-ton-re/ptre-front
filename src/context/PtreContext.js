import React, { createContext, useContext, useState, useEffect } from "react";

const PtreContext = createContext();

function migrateCookiesToLocalStorage() {
  const cookies = document.cookie.split("; ");
  const teams = [];
  let currentTeamId = null;

  const teamUniverse = cookies
    .find((c) => c.startsWith(`ptre_univers`))
    ?.split("=")[1];

  const teamCountry = cookies
    .find((c) => c.startsWith(`ptre_country`))
    ?.split("=")[1];

  const universes = { community: teamCountry, server: teamUniverse };

  cookies.forEach((cookie) => {
    const [name, value] = cookie.split("=");
    if (name.startsWith("ptre_multi_team_id_")) {
      const index = name.split("_").pop();
      const teamId = value;
      const teamKey = cookies
        .find((c) => c.startsWith(`ptre_multi_team_key_${index}`))
        ?.split("=")[1];
      const teamName = cookies
        .find((c) => c.startsWith(`ptre_multi_team_name_${index}`))
        ?.split("=")[1];

      if (teamId && teamKey && teamName) {
        teams.push({
          teamKey: teamKey,
          adminKey: null,
          teamName: decodeURIComponent(teamName),
          teamId: teamId,
          defaultUnivers: index == 1 ? teamUniverse : "",
          defaultCountry: index == 1 ? teamCountry : "",
          admin: false,
        });
      }
    }
  });

  if (teams.length === 0) {
    console.log("No cookies to migrate.");
    return;
  }

  const existingData = localStorage.getItem("ptreData");
  if (existingData && existingData) {
    console.log("ptreData already exists in localStorage. Skipping migration.");
    return;
  }

  if (teams.length > 0) {
    currentTeamId = teams[0].teamId;
  }

  const newLocalStorageData = JSON.stringify({
    teams: teams,
    currentTeamId: currentTeamId,
    universes: universes,
  });

  localStorage.setItem("ptreData", newLocalStorageData);
  console.log("Cookies successfully migrated to localStorage.");
}

export const PtreProvider = ({ children }) => {
  migrateCookiesToLocalStorage();

  const [ptreData, setPtreData] = useState(() => {
    const storedData = localStorage.getItem("ptreData");
    return storedData
      ? JSON.parse(storedData)
      : { teams: null, universes: null, currentTeamId: null };
  });

  const setCurrentTeam = (teamId) => {
    setPtreData((prevData) => {
      const selectedTeam = prevData.teams.find(
        (team) => team.teamId === teamId
      );
      const defaultCountry = selectedTeam?.defaultCountry || "";
      const defaultUniverse = selectedTeam?.defaultUnivers || "";

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

  const setTeamData = (newTeam) => {
    setPtreData((prevData) => {
      const teams = prevData.teams || [];
      const updatedTeams = teams.map((team) =>
        team.teamId === newTeam.teamId ? { ...team, ...newTeam } : team
      );

      if (!updatedTeams.some((team) => team.teamId === newTeam.teamId)) {
        updatedTeams.push(newTeam);
      }

      return { ...prevData, teams: updatedTeams };
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
      localStorage.setItem("ptreData", JSON.stringify(ptreData));
    } else {
      localStorage.removeItem("ptreData");
    }
  }, [ptreData]);

  return (
    <PtreContext.Provider
      value={{
        ptreData,
        setPtreData,
        setTeamData,
        setCurrentTeam,
        setUniverseMenuData,
      }}
    >
      {children}
    </PtreContext.Provider>
  );
};

export const usePtre = () => {
  const context = useContext(PtreContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

export const useTeams = () => {
  const { ptreData } = usePtre();
  return ptreData?.teams || [];
};

export const useCurrentTeam = () => {
  const { ptreData } = usePtre();
  const teams = ptreData?.teams || [];
  return teams.find((team) => team.teamId === ptreData?.currentTeamId);
};

export const useUniverseMenuData = () => {
  const { ptreData } = usePtre();
  return ptreData?.universes;
};
