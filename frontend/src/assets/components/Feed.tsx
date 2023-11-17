import Activity from "./Activity";

const Feed = ({ activities }: any) => {
    return (
        <div className="feed">
            {activities.map((activity: any) => (
                <Activity activity={activity} />
            ))}
        </div>
    );
};

export default Feed;
