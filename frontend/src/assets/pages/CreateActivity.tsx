import { useState } from "react";
import { useAuth } from "../../App";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "";

const CreateActivity = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        distance: "",
        duration: "",
        title: "",
        type: "",
        location: "United Kingdom",
        date: Date.now(),
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
                API_URL + `/api/activity/${user.id}/gpxupload`,
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
                API_URL + `/api/activity/${user.id}/manualupload`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                },
            ];

            const response = gpsFile ? await fetch(...gpsOptions) : await fetch(...manualOptions);

            if (!response.ok) throw new Error("Error creating activity");

            const responseData = await response.json();

            if (responseData.success) {
                navigate(`../athletes/${user.id}`);
            } else throw new Error(responseData.error);
        } catch (error) {
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
                            <label htmlFor="Title">Title</label>
                            <input
                                type="text"
                                placeholder="Activity"
                                name="title"
                                id="title"
                                className="valid"
                                onChange={handleInputChange}
                            ></input>
                            <label htmlFor="distance">Distance (metres)</label>
                            <input
                                type="number"
                                placeholder="00"
                                name="distance"
                                id="distance"
                                className="valid"
                                onChange={handleInputChange}
                            ></input>

                            <label htmlFor="duration">Duration (seconds)</label>
                            <input
                                type="number"
                                placeholder="00"
                                name="duration"
                                id="duration"
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
                    {status === "submitting" && <Loading size={"40px"} />}
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
