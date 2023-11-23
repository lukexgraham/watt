import { useState } from "react";
import { useAuth } from "../../App";
import { useNavigate } from "react-router-dom";
import * as utils from "../utils/gpsHandling";
import Loading from "../components/Loading";

const CreateActivity = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        distance: "",
        duration: "",
        title: "",
        type: "Run",
        location: "United Kingdom",
        date: null,
    });

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [gpsFile, setGpsFile] = useState<any>(null);
    const [gpsFileName, setGpsFileName] = useState<string>("");
    const [status, setStatus] = useState<string | null>(null);

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
            setStatus("submitting");

            const gpsOptions: [string, object] = [
                `api/activity/${user.id}/gpxupload`,
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

            const response = gpsFile ? await fetch(...gpsOptions) : await fetch(...manualOptions);

            const responseData = await response.json();

            if (responseData.success) {
                // const coords = responseData.data.gpx.trk[0];
                // const points = utils.convertGPXData(coords);
                // navigate(`../athletes/${user.id}`);

                console.log(responseData.data);
            } else throw new Error(responseData.error);
        } catch (error) {
            console.log(error);
            setErrorMessage(String(error));
            setStatus("");
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
                    <button onClick={handleUpload} disabled={status === "submitting"}>
                        upload
                    </button>
                    {status === "submitting" && <Loading size={"20px"} />}
                </div>
                <div className="gps-file">
                    <input type="file" onChange={handleFileChange} value={gpsFileName} />
                    {gpsFile && (
                        <button
                            onClick={() => {
                                setGpsFile(null);
                                setGpsFileName("");
                            }}
                        >
                            X
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreateActivity;
