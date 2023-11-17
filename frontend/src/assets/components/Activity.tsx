import * as utils from "../utils/dataFormatting";

const Activity = ({ activity }: any) => {
    return (
        <div key={activity.post_id} className="activity">
            <div className="activity-head">
                <div className="side">
                    <img
                        src="https://d3d00swyhr67nd.cloudfront.net/w800h800/collection/BBO/MERL/BBO_MERL_M_20-001.jpg"
                        alt=""
                    />
                </div>
                <div className="user-info">
                    <span className="username">Lucas</span>
                    <span className="activity-date">
                        {utils.ISOtoDate(activity.start_date)}
                    </span>
                </div>
            </div>
            <div className="activity-body">
                <div className="side">
                    <div className="sport-icon">
                        {activity.sport_type != null
                            ? utils.getSportIcon(activity.sport_type)
                            : activity.sport_type}
                    </div>
                </div>
                <div>
                    <h3>{activity.activity_name}</h3>
                    <div className="activity-info">
                        <div className="activity-data">
                            <div className="data-section">
                                <span className="data-section-head">Time</span>
                                <span className="data-section-data">
                                    {utils.secondsToDuration(activity.duration)}
                                </span>
                            </div>
                            <div className="data-section">
                                <span className="data-section-head">
                                    Distance
                                </span>
                                <span className="data-section-data">
                                    {utils.metresToKM(activity.distance)}km
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activity;
