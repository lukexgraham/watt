const Loading = ({ size }: { size: string }) => {
    return (
        <div className="loading">
            <span className="loader" style={{ height: size, width: size }}></span>
        </div>
    );
};

export default Loading;
