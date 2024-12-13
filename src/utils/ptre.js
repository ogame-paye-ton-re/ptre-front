import { shortenNumber } from '../utils/numbers';
import { formatDate } from '../utils/date';
import { Link } from 'react-router-dom';

export const classIdToImage = {
    '1': '/assets/ogame/mini/collector.png',
    '2': '/assets/ogame/mini/general.png',
    '3': '/assets/ogame/mini/discoverer.png',
};

export const mapTopBoxPlayerData = (data) =>
    data.map((item) => ({
        iid: item.iid,
        playerName: item.player_name,
        days: item.timestamp
            ? Math.floor((Date.now() / 1000 - item.timestamp) / (60 * 60 * 24))
            : null,
        fleetPoints: shortenNumber(item.fleet_points) || null,
        icon: classIdToImage[item.class_id] || null,
    }));

export const PlayerRow = ({ iid, icon, playerName, days, fleetPoints, isFirst }) => (
    <div className={`player-row-data ${isFirst ? 'first-player-row-data' : ''}`}>
        {icon && <img src={icon} alt="Icon" className="player-icon" />}
        <span>
            <Link to={`/?iid=${iid}`}>
                {playerName}
            </Link> (
            {days != null ? `${days} days` : `${(fleetPoints)} pts`}
            )
        </span>
    </div>
);

export const GalaxyEventRow = ({
    date,
    profileId,
    action = [],
    profileLabel = "Profile",
    alliance,
    status
}) => {
    const { rank, coords, type, player_name } = action;
    const formattedDate = formatDate(date);

    const getEventMessage = (type) => {
        switch (type) {
            case 'new_colo':
                return `${player_name} colonized a new planet at`;
            case 'new_moon':
                return `${player_name} got a moon at`;
            case 'new_colo_and_moon':
                return `${player_name} got a planet and moon at`;
            case 'left_colo':
                return `${player_name} destroyed a planet at`;
            case 'left_moon':
                return `${player_name} lost a moon at`;
            case 'left_colo_and_moon':
                return `${player_name} destroyed a planet and moon at`;
            default:
                return `${player_name} did an action at`;
        }
    };

    return (
        <tr className={`status_${status || 'unknown'}`}>
            <td>{formattedDate}</td>
            <td>
                {getEventMessage(type)}{' '}
                <Link
                    to={`?page=galaxy_event_explorer&country=fr&univers=256&galaxy=${coords ? coords.split(':')[0].replace('[', '').replace(']', '') : ''}&system=${coords ? coords.split(':')[1] : ''}`}
                >
                    {coords ? coords : '[?:?:?]'}
                </Link> (#{rank || 'N/A'})
            </td>
            <td>
                <Link
                    to={`?country=fr&univers=256&player_id=${profileId}`}
                    className="events-table-player-icon"
                >
                    <img src="/assets/ogame/mini/player.png" alt="Profile Icon" />
                    {profileLabel}
                </Link>
            </td>
            <td className="center">{alliance ? alliance : 'N/A'}</td>
        </tr>
    );
};

export const SpyEventRow = ({
    date,
    profileId,
    playerName,
    coordGalaxy,
    coordSystem,
    coordPosition,
    alliance,
    profileLabel = "Profile",
}) => {
    const formattedDate = formatDate(date, 'long');
    const coords = `[${coordGalaxy}:${coordSystem}:${coordPosition}]`;

    return (
        <tr>
            <td>{formattedDate}</td>
            <td>
                <Link to={`?page=galaxy_event_explorer&country=fr&univers=256&galaxy=${coordGalaxy}&system=${coordSystem}`}>
                    {coords || '[?:?:?]'}
                </Link>
            </td>
            <td>
                <Link
                    to={`?country=fr&univers=256&player_id=${profileId}`}
                    className="events-table-player-icon"
                >
                    <img src="/assets/ogame/mini/player.png" alt="Player Icon" />
                    {playerName || profileLabel}
                </Link>
            </td>
            <td className="center">{alliance ? alliance : 'N/A'}</td>
        </tr>
    );
};