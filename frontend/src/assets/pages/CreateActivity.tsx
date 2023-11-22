import { ChangeEventHandler, useState } from "react";
import { useAuth } from "../../App";
import { useNavigate } from "react-router-dom";
import * as utils from "../utils/gpsHandling";

const CreateActivity = () => {
    const { user, login, logout } = useAuth();
    const [formData, setFormData] = useState({
        distance: "",
        duration: "",
        title: "",
        type: "Run",
        location: "United Kingdom",
        date: null,
    });

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [gpsFile, setGpsFile] = useState<any>(null);
    const [gpsFileName, setGpsFileName] = useState<string>("");

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const xmlString: any = e.target!.result;
                setGpsFile(xmlString);
            };
            reader.readAsText(file);
            setGpsFileName(event.target.value);
        }
    };

    const handleUpload = async () => {
        try {
            const gpsOptions: [string, object] = [
                `api/activity/gpxupload`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: formData.title,
                        file: gpsFile,
                    }),
                },
            ];

            const manualOptions: [string, object] = [
                `api/athlete/${user.id}/manualupload`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                },
            ];

            const response = await fetch(...gpsOptions);

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    const coords = responseData.data.gpx.trk[0];
                    const points = utils.convertGPXData(coords);

                    const speedThreshold = 5; // Adjust as needed
                    const movingTime = utils.calculateTotalMovingTime(points, speedThreshold);

                    const distance = utils.calculateOverallDistance(points);

                    console.log(distance);
                } else {
                    console.log(responseData.message);
                }
            } else {
                console.log("error");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="upload container">
                <div className="data-inputs">
                    {gpsFile ? (
                        <>
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                placeholder="Activity"
                                name="title"
                                id="title"
                                className="valid"
                                onChange={handleInputChange}
                            ></input>
                        </>
                    ) : (
                        <>
                            <label htmlFor="distance">Distance</label>
                            <input
                                type="number"
                                placeholder="00"
                                name="distance"
                                id="distance"
                                className="valid"
                                onChange={handleInputChange}
                            ></input>

                            <label htmlFor="duration">Duration</label>
                            <input
                                type="number"
                                placeholder="00"
                                name="duration"
                                id="duration"
                                className="valid"
                                onChange={handleInputChange}
                            ></input>
                            <label htmlFor="Title">Title</label>
                            <input
                                type="text"
                                placeholder="Activity"
                                name="title"
                                id="title"
                                className="valid"
                                onChange={handleInputChange}
                            ></input>

                            <label htmlFor="date">Date</label>
                            <input type="date" name="date" id="date" className="valid" onChange={handleInputChange} />

                            <label htmlFor="type">Type</label>
                            <select name="type" id="type" value={formData.type} onChange={handleInputChange}>
                                <option value="Run">Run</option>
                                <option value="Ride">Ride</option>
                                <option value="Orienteering">Orienteering</option>
                            </select>
                        </>
                    )}
                    <button onClick={handleUpload}>upload</button>
                </div>
                <div className="gps-file">
                    <input type="file" onChange={handleFileChange} value={gpsFileName} />
                    {gpsFile ? (
                        <button
                            onClick={() => {
                                setGpsFile(null);
                                setGpsFileName("");
                            }}
                        >
                            X
                        </button>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default CreateActivity;
