import * as utils from "../utils/dataFormatting";
import { useNavigate } from "react-router-dom";
import defaultProfileImage from "../images/default_user.jpg";

const ActivityThumbnail = ({ activity }) => {
    const navigate = useNavigate();

    const handleActivitySelect = async (id: number) => {
        navigate(`../activities/${id}`);
    };

    return (
        <div id={activity.post_id} className="activity-thumbnail" onClick={() => handleActivitySelect(activity.post_id)}>
            <div className="activity-head">
                <div className="side">
                    <img src={defaultProfileImage} alt="" />
                </div>
                <div className="user-info">
                    <span className="username">{activity.username}</span>
                    <span className="activity-date">{utils.ISOtoDate(activity.start_date)}</span>
                </div>
            </div>
            <div className="activity-body">
                <div className="side">
                    <div className="sport-icon">
                        {activity.sport_type != null ? utils.getSportIcon(activity.sport_type) : activity.sport_type}
                    </div>
                </div>
                <div>
                    <h3>{activity.activity_name}</h3>
                    <div className="activity-info">
                        <div className="activity-data">
                            <div className="data-section">
                                <span className="data-section-head">Time</span>
                                <span className="data-section-data">{utils.secondsToDuration(activity.duration)}</span>
                            </div>
                            <div className="data-section">
                                <span className="data-section-head">Distance</span>
                                <span className="data-section-data">{utils.metresToKM(activity.distance)}km</span>
                            </div>
                            <div className="data-section">
                                <span className="data-section-head">Pace</span>
                                <span className="data-section-data">{utils.getPace(activity.distance, activity.duration)}/km</span>
                            </div>
                        </div>
                    </div>
                    {activity.strava_id ? <p style={{ color: "#ee8822" }}>Retrieved from Strava</p> : null}
                </div>
            </div>
        </div>
    );
};

export default ActivityThumbnail;
