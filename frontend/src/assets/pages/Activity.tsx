import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = "pk.eyJ1IjoibHVrZWdyYWhhbSIsImEiOiJjbHA3aWM1bnMyMWR6MndvNXhuMHV2aXdsIn0.9h2SYXWhmJIvVkRLtfsGtw";

const Activity = () => {
    const { id } = useParams();
    const [activityData, setActivityData] = useState({});
    const [geoJson, setGeoJson] = useState<any>(null);

    const mapContainer = useRef<HTMLElement | any>(null);
    const map = useRef<mapboxgl.Map | any>(null);

    const loadMap = async () => {
        if (map.current) return;

        const coordinates = geoJson.geometry.coordinates;

        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

        // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        for (const coord of coordinates) {
            bounds.extend(coord);
        }

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/satellite-v9",
            center: geoJson.geometry.coordinates[0],
            bounds: bounds,
            fitBoundsOptions: { padding: 40 },
        });

        map.current.on("load", () => {
            map.current?.addSource("lineTrack", {
                type: "geojson",
                data: geoJson,
            });

            map.current?.addSource("start", {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: geoJson.geometry.coordinates[0],
                    },
                    properties: {
                        title: "Start",
                        description: "Starting Location",
                    },
                },
            });

            map.current?.addSource("end", {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: geoJson.geometry.coordinates[geoJson.geometry.coordinates.length - 1],
                    },
                    properties: {
                        title: "End",
                        description: "Ending Location",
                    },
                },
            });

            map.current?.addLayer({
                id: "lineTrack",
                type: "line",
                source: "lineTrack",
                paint: {
                    "line-color": "#ee8822",
                    "line-width": 3,
                },
            });

            map.current?.addLayer({
                id: "end-circle",
                type: "circle",
                source: "end",
                paint: {
                    "circle-radius": 10,
                    "circle-color": "#ff3311",
                },
            });

            map.current?.addLayer({
                id: "start-circle",
                type: "circle",
                source: "start",
                paint: {
                    "circle-radius": 10,
                    "circle-color": "#77ee22",
                },
            });
        });
    };

    const getActivity = async () => {
        try {
            const response = await fetch(`/api/activity/${id}`, {
                method: "GET",
            });

            if (response.ok) {
                const responseData = await response.json();

                if (!responseData.success) throw new Error(responseData.error);

                setActivityData(responseData.data);
                const stravaId = responseData.data.strava_id;
                const streamResponse = stravaId
                    ? await fetch(`/api/activity/${stravaId}/getStravaDataStream`)
                    : await fetch(`/api/activity/${id}/getDataStream`);

                if (streamResponse.ok) {
                    const streamData = await streamResponse.json();
                    let coords;

                    if (!stravaId) {
                        const ok = streamData.data.map((str: any) => JSON.parse(str));
                        coords = ok.map(({ lat, lon }: { lat: number; lon: number }) => [lon, lat]);
                    } else {
                        coords = streamData.data.latlng.data.map(([Lat, Lng]: [Lat: number, Lng: number]) => [Lng, Lat]);
                    }

                    const newGeoJson = {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: coords,
                        },
                    };

                    setGeoJson(newGeoJson);
                }
            }
        } catch (error) {
            console.error("Error fetching activity or data stream:", error);
        }
    };

    useEffect(() => {
        getActivity();
    }, [id]);

    useEffect(() => {
        if (geoJson) loadMap();
    }, [geoJson]);

    return (
        <div className="container">
            <div className="activity-page">
                <div className="activity-section">
                    {Object.values(activityData).map((value: any) => (
                        <span>{value}</span>
                    ))}
                </div>
                <div className="activity-section">
                    <div ref={mapContainer} className="map-container" />
                </div>
            </div>
        </div>
    );
};

export default Activity;
