import React, { useState, useEffect } from "react";
import { usePtre } from '../../../context/PtreContext';
import api from './../../../utils/api';
import './LoginModal.css';

const LoginModal = ({ isModalOpen, toggleModal, animationClass, activeTab, toggleTab }) => {
    const { setTeamData, setUniverseMenuData } = usePtre();

    const [loginKey, setLoginKey] = useState("");
    const [teamName, setTeamName] = useState("");
    const [loginError, setLoginError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!isModalOpen) {
            setLoginKey("");
            setTeamName("");
            setLoginError(false);
            setErrorMessage("");
            setLoading(false);
            setLoginSuccess(false);
            setSuccessMessage("");
        }
    }, [isModalOpen]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const keyRegex = /^(TM|AD)-?([A-Z0-9]{4}-?){3}[A-Z0-9]{4}$/;
    
        if (!loginKey || !keyRegex.test(loginKey)) {
            setLoginError(true);
            setErrorMessage(`Please enter a valid team key in the format:
                TM-XXXX-XXXX-XXXX-XXXX or AD-XXXX-XXXX-XXXX-XXXX.`);
            setLoading(false);
            return;
        }
    
        try {
            const response = await api.post('/api.php?view=team_login', { team_key_login: loginKey });
    
            if (response.RESULT_CODE === 0) {
                const loginStatus = response.data.login_status;
    
                if (loginStatus === -1) {
                    setLoginError(true);
                    setErrorMessage("Login failed: Incorrect team key.");
                } else if (loginStatus === 1) {
                    console.log("Login successful:", response.data);
                    setUniverseMenuData({
                        community: response.data.default_country,
                        server: response.data.default_univers,
                    })
                    setTeamData({
                        teamKey: response.data.team_key,
                        adminKey: response.data.admin_key,
                        teamName: response.data.team_name,
                        teamId: response.data.team_id,
                        defaultUnivers: response.data.default_univers,
                        defaultCountry: response.data.default_country,
                    });
                    setLoginSuccess(true);
                    setSuccessMessage(`Successfully logged in to team ${response.data.team_name}`);
                    setTimeout(() => {
                        toggleModal();
                    }, 3000);
                } else {
                    setLoginError(true);
                    setErrorMessage("Unexpected login status. Please try again.");
                }
            } else {
                setLoginError(true);
                setErrorMessage("API call failed. Please try again later.");
            }
        } catch (error) {
            setLoginError(true);
            setErrorMessage("Login request failed. Please check your network connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginInputChange = (e) => {
        setLoginKey(e.target.value);
        if (loginError) {
            setLoginError(false);
            setErrorMessage("");
        }
    };

    const handleCreateTeamSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!teamName) {
            setLoading(false);
            console.error("Please enter a valid team name.");
            return;
        }

        try {
            const response = await api.post('/api.php?view=team_create', { name: teamName });
            console.log("Team created successfully:", response);
            toggleModal();
        } catch (error) {
            console.error("Team creation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        isModalOpen && (
            <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={toggleModal}>
                <div
                    className={`modal-content ${animationClass}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-tabs">
                        <button
                            className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
                            onClick={() => toggleTab('join')}
                        >
                            Join Team
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
                            onClick={() => toggleTab('create')}
                        >
                            Create Team
                        </button>
                    </div>
                    <div className="tab-content">
                        {loginSuccess ? (
                            <div className="tab-content-container">
                                <div className="modal-image-container">
                                    <img src="/assets/ptre_logo_trans.png" className="h-48px" alt="Team Logo" />
                                </div>
                                <h2>{successMessage}</h2>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'join' && (
                                    <div className="tab-content-container">
                                        <div className="modal-image-container">
                                            <img src="/assets/ptre_logo_trans.png" className="h-48px" alt="" />
                                        </div>
                                        <h2>Login to your team</h2>
                                        <p>Enter your PTRE Team key or Admin key to access your account.</p>
                                        <form onSubmit={handleLoginSubmit}>
                                            <div className={`input-wrapper ${loginError ? 'error' : ''}`}>
                                                <i className="icon icon-key fas fa-key"></i>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your key (TM-XXX/AD-XXX)"
                                                    value={loginKey}
                                                    onChange={handleLoginInputChange}
                                                    className={loginError ? 'input-error' : ''}
                                                />
                                            </div>
                                            {loginError && (
                                                <div className="error-message" style={{ whiteSpace: 'pre-line', color: 'red', fontSize: '0.875rem' }}>
                                                    {errorMessage}
                                                </div>
                                            )}
                                            <button type="submit" disabled={loading}>Login</button>
                                        </form>
                                    </div>
                                )}
                                {activeTab === 'create' && (
                                    <div className="tab-content-container">
                                        <div className="modal-image-container">
                                            <img src="/assets/ptre_logo_trans.png" className="h-48px" alt="" />
                                        </div>
                                        <h2>Create a new team</h2>
                                        <p>Fill in the details to create a new PTRE team.</p>
                                        <div className="team-details">
                                            <p>
                                                Creating a Team gives you a private space on the PTRE platform where you and your team members can manage and share spy reports. This space is exclusive to your team and is accessible using an invitation key.
                                            </p>
                                            <p>
                                                Benefits of a PTRE Team
                                            </p>
                                            <ul>
                                                <li>Collaborate securely with your in-game alliance or a group of friends.</li>
                                                <li>Share and research spy reports directly from Discord.</li>
                                                <li>Manage multiple alliances under a unified team.</li>
                                            </ul>
                                            <p>
                                                Get started by filling in the details below to create your team!
                                            </p>
                                        </div>
                                        <form onSubmit={handleCreateTeamSubmit}>
                                            <div className="input-wrapper">
                                                <i className="icon icon-key fas fa-people-group"></i>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your team name"
                                                    value={teamName}
                                                    onChange={(e) => setTeamName(e.target.value)}
                                                />
                                            </div>
                                            <button type="submit" disabled={loading}>Create Team</button>
                                            <p className="warning-message">
                                                <strong>Warning:</strong> You do not need to create a new team when you change your in-game universe. One team can manage several universes.
                                            </p>
                                        </form>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default LoginModal;
