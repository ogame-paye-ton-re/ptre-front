import React from 'react';
import { Link } from 'react-router-dom';
import { useTeams, useCurrentTeam, usePtre } from '../../context/PtreContext';

import './LeftMenu.css';

const LeftMenu = ({ toggleModal }) => {
  const teamsData = useTeams();
  const currentTeam = useCurrentTeam();
  const { setCurrentTeam } = usePtre();

  const handleTeamClick = (teamId) => {
    setCurrentTeam(teamId);
  };

  const getTeamInitials = (teamName) => {
    return teamName.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="left-menu">
      <div className="logo">
        <Link to="/">
          <img src="/assets/ptre_logo_trans_header.png" alt="PTRE Logo" className="logo-icon" />
        </Link>
      </div>
      <ul>
        {teamsData.map((team) => {
          const isActive = team.teamId === currentTeam.teamId;
          return (
            <li key={team.teamId} className="team-item">
              <span 
                className={`team-link ${isActive ? 'active' : ''}`}
                onClick={() => handleTeamClick(team.teamId)}
              >
                <div className={`team-icon ${isActive ? 'active' : ''}`}>
                  {getTeamInitials(team.teamName)}
                </div>
              </span>
            </li>
          );
        })}
        <hr className="team-divider" />
        <li className="team-item add-team" onClick={toggleModal}>
          <div className="team-icon add-team-icon">+</div>
        </li>
      </ul>
    </nav>
  );
};

export default LeftMenu;
