import './Create.css';

const Create = () => {

    return (
        <div className="container">
            <div className="box_1 create_team">
                <div className="left-part">
                    <div className="icon-title">
                        <img src="/assets/ogame/mini/player.png" alt="Player Icon" className="section-icon" />
                        <h3>Connect to an existing Team</h3>
                    </div>
                    <p className="description">Join an existing team to collaborate with others and contribute to success!<br/> (If you dont have any key, ask your Team creator)</p>
                    <div className="input-container">
                        <input type="text" placeholder="Enter Code (TM-XXX/AD-XXX)" />
                        <button>Connect</button>
                    </div>
                </div>
                <div className="right-part">
                    <div className="icon-title">
                        <img src="/assets/ogame/mini/alliance.png" alt="Alliance Icon" className="section-icon" />
                        <h3>Create a new Team</h3>
                    </div>
                    <p className="description">Start a new team and lead it to victory with your strategy!</p>
                    <div className="team-details">
                        <p>
                            Creating a Team will allow you to get a private area (on PTRE website) where you may add private spy reports.
                            Those reports will only be shared between your team members (people who get the Invitation key).
                        </p>
                        <p>
                            You may also push / share / research all your spy reports directly from Discord.
                        </p>
                        <p>
                            A Team could be:
                        </p>
                        <ul>
                            <li>One ingame alliance</li>
                            <li>A merge of multiple ingame alliances</li>
                            <li>A group of friends</li>
                        </ul>
                    </div>
                    <div className="input-container">
                        <input type="text" placeholder="Enter Team Name" />
                        <button>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;